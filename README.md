<div align="center">

<img src="./app-mobile/assets/images/icon.png" alt="" align="center" height="80" />

# Détection Précoce des Maladies sur Feuilles

[![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=flat-square&logo=python&logoColor=white)](https://python.org)
[![Flask](https://img.shields.io/badge/Flask-2.3-black?style=flat-square&logo=flask)](https://flask.palletsprojects.com)
[![React Native](https://img.shields.io/badge/Expo-52-black?style=flat-square&logo=expo&logoColor=white)](https://expo.dev)
[![scikit-learn](https://img.shields.io/badge/scikit--learn-F7931E?style=flat-square&logo=scikit-learn&logoColor=white)](https://scikit-learn.org)

</div>

Système de détection précoce des maladies foliaires combinant un modèle SVM entraîné sur des données Kaggle, un backend Flask pour l'analyse d'images, et une application mobile React Native (Expo) pour la capture et le diagnostic en temps réel.

## Architecture

```
┌──────────────────────┐     ┌──────────────────┐     ┌──────────────────────┐
│  React Native (Expo) │────▶│   Flask Backend  │────▶│   SVM Model (.pkl)   │
│  - Scanner/Galerie   │◀────│   /prediction_app│     │   HOG + PCA + Scaler │
│  - Analyse Gemini    │     │   /detect        │     └──────────────────────┘
│  - Historique SQLite │     │   /prediction    │
└──────────────────────┘     └──────────────────┘
                                     │
                            ┌────────┴────────┐
                            │  Gemini API      │
                            │  (recommandations)│
                            └─────────────────┘
```

- **Application mobile** (React Native / Expo) — capture d'images via caméra ou galerie, analyse via l'API Gemini (nom de la maladie, confiance, description, recommandations), historique local dans SQLite
- **Backend Flask** — détection des zones non-végétatives et des zones malades par segmentation HSV, prédiction SVM (feuille saine / malade) basée sur les descripteurs HOG
- **Modèle ML** — SVM avec noyau RBF, précédé d'une réduction de dimension PCA et d'une normalisation StandardScaler

## Fonctionnalités

- **Détection de zones non-végétatives** — segmentation HSV des parties vertes, identification des zones sans végétation
- **Détection de zones malades** — identification des zones brunes/rouges/jaunes avec filtrage par composantes connexes
- **Classification SVM** — extraction de features HOG, réduction PCA, prédiction binaire sain/malade
- **Analyse Gemini** — description détaillée de la maladie avec recommandations de traitement en français
- **Historique local** — sauvegarde des analyses dans SQLite avec statut, confiance et date

## Dataset

Le modèle a été entraîné sur un [dataset Kaggle](https://www.kaggle.com/) de feuilles avec 4 classes :
- Saine (`healthy`)
- Rouille (`rust`)
- Tavelure (`scab`)
- Maladies multiples (`multiple_diseases`)

Le jeu de données contient 3 642 images réparties en train/test, équilibrées entre feuilles saines et malades.

## Prerequisites

- Python 3.10+
- Node.js 18+
- Expo CLI (`npm install -g expo-cli`)
- Expo Go (sur appareil mobile)

## Installation et démarrage

### Backend

```bash
pip install -r requirements.txt
cd utils
python app.py
```

Le serveur Flask démarre sur `http://0.0.0.0:5000`.

### Application mobile

```bash
cd app-mobile
npm install
npx expo start
```

Scannez le QR code avec Expo Go ou utilisez un émulateur (`a` pour Android, `i` pour iOS).

> [!TIP]
> Assurez-vous que le mobile et le serveur sont sur le même réseau Wi-Fi. Modifiez l'URL du backend dans `app-mobile/.env` si nécessaire.

### Notebooks Jupyter

Deux notebooks sont disponibles pour explorer le pipeline complet :

- `Notebook_Traitement_Images.ipynb` — prétraitement et équilibrage du dataset
- `Notebook_Model.ipynb` — entraînement du SVM avec GridSearchCV et évaluation

## Structure du projet

```
├── app-mobile/              # Application React Native (Expo)
│   ├── app/                 # Écrans (tabs, result, settings, guide, waiting)
│   ├── components/          # Composants réutilisables
│   ├── constants/           # Thème (Colors), routes, guide
│   ├── utils/               # Base de données SQLite
│   └── actions/             # Image actions API
├── utils/                   # Backend Flask
│   ├── app.py               # Routes et logique serveur
│   ├── backend.py           # Détection et classification
│   ├── templates/           # Pages HTML (5 templates)
│   └── static/              # CSS, JS, images
├── models/                  # Modèles pré-entraînés (.pkl)
│   ├── svm.pkl
│   ├── pca.pkl
│   └── scaler.pkl
├── DataSet/                 # Dataset Kaggle original
│   ├── images/              # 3642 images JPG
│   ├── train.csv
│   ├── test.csv
│   └── sample_submission.csv
├── IMG/                     # Images d'exemple
├── Notebook_Model.ipynb     # Notebook d'entraînement SVM
├── Notebook_Traitement_Images.ipynb  # Notebook de prétraitement
└── requirements.txt         # Dépendances Python
```

## API

### `POST /predict_app`

Endpoint utilisé par l'application mobile.

**Request :** `multipart/form-data` avec un champ `image` (fichier).

**Response :**
```json
{
  "result": 0,
  "image_url": "/static/images/feuille_20250519_143049.jpg"
}
```

`result` : `0` = sain, `1` = malade.

### `POST /detect`

Analyse détaillée : retourne les zones non-végétatives et les zones de maladies avec annotations visuelles.

### `POST /prediction`

Analyse + classification SVM, retourne une page HTML avec le résultat.

## Stack technique

| Composant | Technologie |
|---|---|
| Mobile | React Native, Expo 52, TypeScript |
| Backend | Python 3, Flask 2.3 |
| ML | scikit-learn (SVM), joblib |
| Vision | OpenCV, scikit-image (HOG) |
| Base de données | expo-sqlite (local) |
| API IA | Google Gemini 2.0 Flash |
