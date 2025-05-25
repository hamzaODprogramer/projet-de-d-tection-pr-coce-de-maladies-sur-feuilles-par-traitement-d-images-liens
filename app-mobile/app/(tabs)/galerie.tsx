import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  Alert,
} from 'react-native';
import * as FileSystem from 'expo-file-system';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';

const { width } = Dimensions.get('window');
const numColumns = 2;
const tileSize = width / numColumns;

interface ImageData {
  uri: string;
  filename: string;
  timestamp: number;
}

export default function GalleryScreen() {
  const [images, setImages] = useState<ImageData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = async () => {
    try {
      const directory = FileSystem.documentDirectory;
      if (!directory) return;
      
      const files = await FileSystem.readDirectoryAsync(directory);
      const plantImages = files.filter(file => file.startsWith('plant_'));
      
      const imageData = await Promise.all(
        plantImages.map(async (filename) => {
          const fileInfo = await FileSystem.getInfoAsync(directory + filename);
          return {
            uri: fileInfo.uri,
            filename: filename,
            timestamp: fileInfo.exists ? (fileInfo as any).modificationTime || 0 : 0,
          };
        })
      );

      // Sort images by timestamp (newest first)
      imageData.sort((a, b) => b.timestamp - a.timestamp);
      setImages(imageData);
    } catch (error) {
      console.error('Error loading images:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (filename: string) => {
    Alert.alert(
      "Supprimer l'image",
      "Êtes-vous sûr de vouloir supprimer cette image ?",
      [
        {
          text: "Annuler",
          style: "cancel"
        },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: async () => {
            try {
              const directory = FileSystem.documentDirectory;
              if (!directory) return;
              
              await FileSystem.deleteAsync(directory + filename);
              // Reload images after deletion
              loadImages();
            } catch (error) {
              console.error('Error deleting image:', error);
              Alert.alert("Erreur", "Impossible de supprimer l'image");
            }
          }
        }
      ]
    );
  };

  const renderItem = ({ item }: { item: ImageData }) => (
    <TouchableOpacity 
      style={styles.imageContainer}
      onPress={() => {
        router.push({
          pathname: "/result/result",
          params: {
            image: item.uri,
            prediction: "0"
          }
        });
      }}
    >
      <Image
        source={{ uri: item.uri }}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.imageInfo}>
        <Text style={styles.imageName} numberOfLines={1}>
          {item.filename}
        </Text>
        <TouchableOpacity 
          style={styles.deleteButton}
          onPress={() => handleDelete(item.filename)}
        >
          <Feather name="trash-2" size={16} color="#EF4444" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#16a34a" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.iconRow}>
        <TouchableOpacity style={styles.iconWrapper}>
          <Feather name="settings" size={20} color="#4B5563" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconWrapper}>
          <Feather name="image" size={20} color="#4B5563" />
        </TouchableOpacity>
      </View>
        
      {images.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Feather name="image" size={48} color="#9ca3af" />
          <Text style={styles.emptyText}>Aucune image trouvée</Text>
        </View>
      ) : (
        <FlatList
          data={images}
          renderItem={renderItem}
          keyExtractor={(item) => item.filename}
          numColumns={numColumns}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 18,
    paddingTop: 16,
    width: "auto",
    height: "100%",
  },
  header: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#16a34a',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5'
  },
  listContainer: {
    paddingHorizontal: 8,
  },
  imageContainer: {
    width: tileSize - 23,
    height: tileSize - 23,
    margin: 8,
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  image: {
    width: '100%',
    height: '80%',
  },
  imageInfo: {
    padding: 2,
    paddingHorizontal: 8,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  imageName: {
    fontSize: 12,
    color: '#666',
    flex: 1,
    marginRight: 8,
  },
  deleteButton: {
    padding: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#9ca3af',
    marginTop: 12,
  },
  iconRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
    marginTop: 23,
    paddingHorizontal: 14,
  },
  iconWrapper: {
    backgroundColor: '#E5E7EB',
    padding: 8,
    borderRadius: 999,
  },
});


