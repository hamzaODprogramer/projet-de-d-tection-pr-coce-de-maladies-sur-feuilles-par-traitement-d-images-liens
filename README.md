# Guide du Projet - Détection Précoce des Maladies des Feuilles

## 1. Guide d'utilisation de l'application Web

### 1.1 Installation des bibliothèques nécessaires
Avant de démarrer l'application, il est indispensable d'installer les dépendances listées dans le fichier `requirements.txt` :

```bash
pip install -r requirements.txt
```

### 1.2 Exécution de l'application Web
L'application peut ensuite être lancée à l'aide des commandes suivantes :

```bash
cd utils
python app.py
```

## 2. Architecture et Organisation du Projet

### 2.1 Structure des répertoires

- **Répertoire Dataset** :  
  Contient le dataset original téléchargé depuis Kaggle, comprenant les images de feuilles avec leurs étiquettes correspondantes pour l'entraînement des modèles de classification.

- **Répertoire Dataset_Préparer** :  
  Ce dossier contient le dataset préparé et équilibré après les étapes de prétraitement.

- **Répertoire IMG** :  
  Ce répertoire contient des images d'exemple pouvant être utilisées pour tester les opérations de traitement d'image et valider le fonctionnement des algorithmes de détection de maladies foliaires.

- **Répertoire models** :  
  Ce dossier regroupe l'ensemble des modèles d'apprentissage automatique sauvegardés au format `.pkl`. Ces modèles pré-entraînés permettent d'analyser les images de feuilles et de produire des prédictions précises relatives à l'état sanitaire et à la détection précoce des maladies.

- **Répertoire utils** :  
  Le projet est organisé autour d'un répertoire `utils` qui centralise les éléments liés à l'interface web et au traitement backend :  
  - **templates** : Contient l'ensemble des fichiers HTML servant de modèles pour les pages web de l'application. Ces fichiers définissent la structure et la mise en page de l'interface utilisateur permettant le téléchargement d'images et l'affichage des résultats de diagnostic.  
  - **static** : Contient toutes les ressources statiques (feuilles de style CSS, scripts JavaScript, images, etc.) utilisées par l'interface. Ces ressources complètent les modèles HTML en fournissant les styles visuels et les fonctionnalités côté client.

- **Fichier backend.py** :  
  Le fichier `backend.py` centralise la logique métier du projet de détection des maladies foliaires. Ce module contient toutes les fonctions dédiées à la détection des maladies et à la prédiction de la santé des feuilles.

- **Fichier app.py** :  
  Ce fichier constitue le point d'entrée principal de l'application web. Il gère la logique de l'application Flask, le traitement des requêtes HTTP, et assure la liaison entre les composantes frontend et backend pour offrir une expérience utilisateur fluide.

- **Notebook_Model** :  
  Ce notebook contient les différentes étapes de développement de modèle SVM pour la prédiction de l’état sanitaire des feuilles.

- **Notebook_Traitement_Images** :  
  Ce notebook se concentre sur les techniques avancées de traitement d'image pour la détection des maladies foliaires.
  
--------------------------

# Guide de Test de l'Application React Native avec Expo

## 1. Prérequis

Avant de commencer, assurez-vous d'avoir les outils suivants installés :

- **Node.js** : Version 16 ou supérieure ([nodejs.org](https://nodejs.org)).
- **Expo CLI** : Outil pour gérer les projets Expo.
- **Expo Go** : Application mobile pour tester sur un appareil physique (iOS App Store ou Google Play Store).
- Un appareil mobile (iOS ou Android) ou un émulateur (Android Studio pour Android, Xcode pour iOS).
- **Git** : Pour cloner le dépôt du projet, si applicable.

## 2. Installation des Dépendances

1. **Installer Expo CLI** :
   ```bash
   npm install -g expo-cli
   ```

2. **Cloner le projet (si applicable)** :
   ```bash
   git clone <URL_DU_DÉPÔT>
   cd <NOM_DU_RÉPERTOIRE>
   ```

3. **Installer les dépendances du projet** :
   ```bash
   npm install
   ```

## 3. Configuration de l'Environnement

1. **Vérification du fichier `app.json`** :
   - Vérifiez que `app.json` ou `app.config.js` contient les configurations nécessaires (nom, version, paramètres iOS/Android).

2. **Connexion à l'API backend** :
   - Assurez-vous que le serveur Flask est en cours d'exécution :
     ```bash
     cd utils
     python app.py
     ```
   - Vérifiez que l'URL de l'API dans le code React Native pointe vers le serveur (ex. : `http://<IP_DU_SERVEUR>:5000`).

3. **Configuration réseau** :
   - Si test sur appareil physique, assurez-vous que l'appareil et le serveur sont sur le même réseau Wi-Fi.
   - Utilisez l'adresse IP locale de votre machine (ex. : `192.168.x.x`).

## 4. Exécution de l'Application

1. **Démarrer le projet Expo** :
   ```bash
   expo start
   ```
   - Ouvre une interface dans le terminal et un tableau de bord dans le navigateur.

2. **Tester sur un appareil physique** :
   - Ouvrez **Expo Go** sur votre appareil.
   - Scannez le QR code affiché dans le terminal/navigateur.
   - L'application se charge dans Expo Go.

3. **Tester sur un émulateur** :
   - **Android** :
     - Configurez un émulateur dans Android Studio.
     - Appuyez sur `a` dans le terminal Expo.
   - **iOS** :
     - Configurez un simulateur dans Xcode.
     - Appuyez sur `i` dans le terminal Expo.

## 5. Test des Fonctionnalités

1. **Interface d'Accueil** :
   - Vérifiez l'affichage correct (figure 3.19).
   - Testez la navigation vers "Analyse d'image" et "Prédiction".

2. **Interface de Sélection d'Image** :
   - Accédez à l'interface (figure 3.21).
   - Testez les options :
     - **Prendre une photo** : Utilisez la caméra.
     - **Choisir dans la galerie** : Sélectionnez une image (ex. : répertoire `IMG`).
   - Vérifiez l'envoi correct de l'image au serveur.

3. **Analyse et Prédiction** :
   - Vérifiez l'affichage des résultats d'analyse (figures 3.22, 3.23).
   - Testez la prédiction de l'état sanitaire (figure 3.24) : feuille saine (figure 3.25) ou malade (figure 3.26).
   - Assurez-vous que l'API Gemini fournit des recommandations pertinentes.

4. **Interface de Guide** :
   - Accédez au guide (figures 3.27, 3.28).
   - Vérifiez la clarté et l'accessibilité des instructions.

5. **Interface d'Historique** :
   - Accédez à l'historique (figures 3.29, 3.30).
   - Vérifiez l'affichage des analyses précédentes et de la galerie.

## 6. Dépannage

- **Problème de connexion au serveur** :
  - Vérifiez que Flask est en cours d'exécution (`python app.py`).
  - Confirmez que l'URL de l'API est correcte.
- **Erreur de chargement dans Expo Go** :
  - Assurez-vous que l'appareil est sur le même réseau que le serveur.
  - Redémarrez `expo start`.
- **Problèmes d'émulateur** :
  - Vérifiez la configuration d'Android Studio ou Xcode.
  - Assurez-vous que l'émulateur est bien lancé avant d'appuyer sur `a` ou `i`.

## 7. Remarques

- Testez avec des images variées (saines et malades) du répertoire `IMG` pour valider la robustesse du modèle.
- Si vous utilisez l'API Gemini pour les recommandations, assurez-vous que la clé API est correctement configurée dans le code.
- Pour des tests approfondis, consultez le `Notebook_Traitement_Images` et `Notebook_Model` pour comprendre les algorithmes de traitement et le modèle SVM.
