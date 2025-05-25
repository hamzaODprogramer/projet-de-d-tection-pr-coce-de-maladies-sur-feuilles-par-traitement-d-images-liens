from flask import Flask, request, jsonify, render_template, send_from_directory, redirect, url_for
import os
import cv2
import numpy as np
from PIL import Image
from datetime import datetime
import traceback
from werkzeug.utils import secure_filename
from backend import (detecter_non_vegetation, detecter_zones_malades, predict_health_feuille)

app = Flask(__name__)

UPLOAD_FOLDER = 'static/images'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def save_image(img, filename):
    """Sauvegarde une image dans le dossier d'upload"""
    # Ensure the directory exists
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
    
    # Handle different image formats
    if len(img.shape) == 2:  # Grayscale or mask
        img = cv2.cvtColor(img, cv2.COLOR_GRAY2RGB)
    elif img.shape[2] == 3:  # BGR image
        img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    else:
        raise ValueError(f"Unsupported image format: {img.shape}")
    
    # Convert to PIL Image and save
    image = Image.fromarray(img)
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    image.save(filepath)
    return filepath

@app.route('/', methods=['GET'])
def index_view():
    """Route principale avec message de bienvenue"""
    return render_template('index.html')

@app.route('/analyse', methods=['GET'])
def analyse_view():
    """Route pour choisir le type d'analyse"""
    return render_template('analyse.html')

@app.route('/detection', methods=['GET'])
def image_view():
    """Route pour l'analyse d'image"""
    return render_template('detection.html')

@app.route('/predict', methods=['GET'])
def predict_view():
    """Route pour la prédiction de maladie"""
    return render_template('predict.html')

@app.route('/static/<path:filename>', methods=['GET'])
def serve_static(filename):
    """Sert les fichiers statiques"""
    return send_from_directory('static', filename)

@app.route('/static/images/<path:filename>', methods=['GET'])
def serve_image(filename):
    """Sert les images uploadées"""
    return send_from_directory('static/images', filename)

@app.route('/detect', methods=['POST'])
def detect():
    """Route pour la détection sur image"""
    if 'file' not in request.files:
        return jsonify({'error': 'Aucun fichier fourni'})
        
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({'error': 'Aucun fichier sélectionné'})
        
    if not allowed_file(file.filename):
        return jsonify({'error': 'Type de fichier non autorisé'})
    
    # Création d'un dossier unique pour cette analyse
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    analysis_folder = os.path.join(UPLOAD_FOLDER, f"analyse_{timestamp}")
    os.makedirs(analysis_folder, exist_ok=True)
    app.config['UPLOAD_FOLDER'] = analysis_folder
    
    # Lecture de l'image
    image_data = file.read()
    image = cv2.imdecode(np.fromstring(image_data, np.uint8), cv2.IMREAD_COLOR)
    
    # Appliquer les deux méthodes
    results_non_veg = detecter_non_vegetation(image)
    results_malades = detecter_zones_malades(image)
    
    # Combinaison des résultats
    all_results = {}
    
    # Ajouter les résultats de non_vegetation avec préfixe
    for key, img in results_non_veg.items():
        all_results[f"non_veg_{key}"] = img
        
    # Ajouter les résultats de zones_malades avec préfixe
    for key, img in results_malades.items():
        all_results[f"malade_{key}"] = img
    
    # Sauvegarde des résultats
    image_urls = {}
    for key, img in all_results.items():
        filename = f"{key}.jpg"
        filepath = save_image(img, filename)
        # Store relative path starting from 'static'
        relative_path = os.path.relpath(filepath, 'static').replace('\\', '/')
        image_urls[key] = relative_path
    
    return render_template('results.html', 
                          results=image_urls)

@app.route('/prediction', methods=['POST'])
def predict():
    """Route pour la prédiction de maladie"""
    try:
        if 'image' not in request.files:
            return jsonify({'error': 'Aucune image fournie'})
            
        file = request.files['image']
        if file.filename == '':
            return jsonify({'error': 'Aucun fichier sélectionné'})
            
        # Lecture de l'image
        image_data = file.read()
        image = cv2.imdecode(np.fromstring(image_data, np.uint8), cv2.IMREAD_COLOR)
        
        # Création d'un dossier unique pour cette analyse
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        analysis_folder = f"{UPLOAD_FOLDER}/prediction_{timestamp}"
        os.makedirs(analysis_folder, exist_ok=True)
        app.config['UPLOAD_FOLDER'] = analysis_folder
        
        # Sauvegarde de l'image originale
        secure_name = secure_filename(file.filename)
        filepath = save_image(image, secure_name)
        
        # Récupération du chemin relatif pour le template
        image_url = os.path.relpath(filepath, 'static').replace('\\', '/')
        
        # Prédiction avec SVM
        svm_prediction = predict_health_feuille(image)
        
        # Rendu du template avec les résultats
        return render_template('prediction_result.html',
                             image=image_url,
                             prediction=svm_prediction)
                              
    except Exception as e:
        print(f"Erreur dans la route de prédiction: {str(e)}")
        traceback_str = traceback.format_exc()
        print(traceback_str)
        return jsonify({'error': f'Erreur lors du traitement: {str(e)}'})

@app.route('/prediction_app', methods=['POST'])
def predict_app():
    """Route pour la prédiction de maladie via l'API"""
    if 'image' not in request.files:
        return jsonify({'error': 'Aucune image fournie'})
        
    file = request.files['image']
    if file.filename == '':
        return jsonify({'error': 'Aucun fichier sélectionné'})
        
    try:
        # Lecture de l'image
        file_bytes = file.read()
        # Using np.frombuffer instead of the deprecated fromstring
        image = cv2.imdecode(np.frombuffer(file_bytes, np.uint8), cv2.IMREAD_COLOR)
        
        if image is None:
            return jsonify({'error': 'Impossible de décoder l\'image'})
        
        # Création d'un dossier unique pour cette analyse
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        analysis_folder = f"{UPLOAD_FOLDER}/prediction_{timestamp}"
        app.config['UPLOAD_FOLDER'] = analysis_folder
        
        # Sauvegarde de l'image originale
        filepath = save_image(image, secure_filename(file.filename))
        image_url = filepath.replace('static/', '')
        
        # Prédiction
        result = predict_health_feuille(image)
        
        # Fix: Convert result to a serializable format if needed
        if isinstance(result, set):
            result = list(result)

        if result == "⚠️ Feuille malade" : 
            result = 1
        else : 
            result = 0
        
        # Fix: Return as a proper JSON object
        return jsonify({"result": result, "image_url": image_url})
    except Exception as e:
        import traceback
        error_details = traceback.format_exc()
        app.logger.error(f"Error in predict_app: {error_details}")
        return jsonify({"error": str(e), "details": error_details}), 500

if __name__ == '__main__':
    # Assurer que le dossier des images existe
    os.makedirs(UPLOAD_FOLDER, exist_ok=True)
    # Définir debug=True pour avoir plus d'informations sur les erreurs
    app.run(debug=True,host="0.0.0.0")