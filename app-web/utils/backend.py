# IMPORTATION DES BIBLIOTHÈQUES
import sys
from PIL import Image
import numpy as np
import matplotlib.pyplot as plt
import cv2
import os
import joblib
from skimage.feature import hog
from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler
import traceback
# ================================
#  Chargement des modèles pré-entraînés
# ================================

svm_model = joblib.load('../models/svm.pkl')
pca = joblib.load('../models/pca.pkl')
scaler = joblib.load('../models/scaler.pkl')



# ================================
#  Extraction des caractéristiques HOG
# ================================
def generer_vecteur_hog(image, dim=(128, 128)):
     # 1.Redimensionner l'image à la taille cible
    image_resized = cv2.resize(image, dim)
     # 2. Convertir l'image redimensionnée en niveaux de gris si elle a plus de deux dimensions
    if len(image_resized.shape) > 2:
        image_gray = cv2.cvtColor(image_resized, cv2.COLOR_BGR2GRAY)
    else:
        image_gray = image_resized
    # 3.Extraire les caractéristiques HOG de l'image redimensionnée
    features = hog(image_gray,
                   orientations=9,
                   pixels_per_cell=(8, 8),
                   cells_per_block=(2, 2),
                   block_norm='L2-Hys',
                   transform_sqrt=True,
                   visualize=False)
    return features

# ================================
#  Création d’une fonction pour detecter les zones non végétatives
# ================================
def detecter_non_vegetation(image_bgr):
    # 1. Conversion en niveaux de gris
    img_gray = cv2.cvtColor(image_bgr, cv2.COLOR_BGR2GRAY)
     # 2. Convertir l’image de l’espace BGR à l’espace HSV
    img_hsv = cv2.cvtColor(image_bgr, cv2.COLOR_BGR2HSV)
     # 3. Définir la plage des couleurs vertes
    vert_min = np.array([25, 40, 40])
    vert_max = np.array([100, 255, 255])
     # 4. Créer un masque pour isoler les zones vertes
    masque_vert = cv2.inRange(img_hsv, vert_min, vert_max)
     # 5. Inverser le masque pour obtenir les zones non vertes
    masque_non_vert = cv2.bitwise_not(masque_vert)
     # 6. Appliquer le masque sur l’image originale
    image_masquee = cv2.bitwise_and(image_bgr, image_bgr, mask=masque_non_vert)
    # 7. Inverser l’image masquée 
    image_masquee_inversee = cv2.bitwise_not(image_masquee)
    return {
       
        "Image masquée": image_masquee,
        "Identification de zones non végétatives": image_masquee_inversee
    }

# ================================
#  Identification des zones suspectes malades (brun, rouge, jaune)
# ================================
def detecter_zones_malades(image_bgr):
     # Conversion de l'image BGR à l'espace HSV
    image = image_bgr
    image_hsv = cv2.cvtColor(image_bgr, cv2.COLOR_BGR2HSV)

    # Définir la plage de couleurs pour les zones malades (brun, rouge, jaune)
    plage_coleur_zones_malades_min = np.array([10, 100, 50])  
    plage_coleur_zones_malades_max = np.array([30, 255, 255])  
    #Appliquer le masque pour détecter les zones brunes
    
    mask = cv2.inRange(image_hsv, plage_coleur_zones_malades_min, plage_coleur_zones_malades_max)
    _, etiquettes, stats, _ = cv2.connectedComponentsWithStats(mask, 8)

    # Filtrer les zones en fonction de la taille
    zones_malades = []
    for i, stat in enumerate(stats):
        if stat[4] > 100:  
            zones_malades.append((stat[0], stat[1], stat[2], stat[3]))

    # Dessiner les zones malades sur l'image originale
    for zone in zones_malades:
        x, y, w, h = zone
        cv2.rectangle(image, (x, y), (x + w, y + h), (255, 255, 0), 2)  
        

    return {
       
        "Zones de maladies": mask,
        "Détection des zones maladies": image,
    }
    
    
# ================================
# Prédiction finale de l'état de la feuille (saine/malade)
# ================================
def predict_health_feuille(image):
    image_resizee = cv2.resize(image, (64, 64))
    vecteur = generer_vecteur_hog(image_resizee)
    vecteur_reduit = pca.transform([vecteur])
    vecteur_normalise =scaler.transform(vecteur_reduit)

    prediction = svm_model.predict(vecteur_normalise)
    return "✅ Feuille saine" if prediction == 0 else "⚠️ Feuille malade"
