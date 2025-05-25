# Guide du Projet - Détection Précoce des Maladies des Feuilles

## 1. Guide d'utilisation

### 1.1 Installation des bibliothèques nécessaires
Avant de démarrer l'application, il est indispensable d'installer les dépendances listées dans le fichier `requirements.txt` :

```bash
pip install -r requirements.txt
```

### 1.2 Exécution de l'application
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
