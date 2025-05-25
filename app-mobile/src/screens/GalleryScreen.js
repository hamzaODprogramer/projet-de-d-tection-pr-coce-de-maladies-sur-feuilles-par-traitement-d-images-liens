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
} from 'react-native';
import * as FileSystem from 'expo-file-system';

const { width } = Dimensions.get('window');
const numColumns = 2;
const tileSize = width / numColumns;

const GalleryScreen = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = async () => {
    try {
      const directory = FileSystem.documentDirectory;
      const files = await FileSystem.readDirectoryAsync(directory);
      const plantImages = files.filter(file => file.startsWith('plant_'));
      
      const imageData = await Promise.all(
        plantImages.map(async (filename) => {
          const fileInfo = await FileSystem.getInfoAsync(directory + filename);
          return {
            uri: fileInfo.uri,
            filename: filename,
            timestamp: fileInfo.modificationTime,
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

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.imageContainer}>
      <Image
        source={{ uri: item.uri }}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.imageInfo}>
        <Text style={styles.imageName} numberOfLines={1}>
          {item.filename}
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Plant Gallery</Text>
      {images.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No plant images found</Text>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    padding: 16,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    padding: 8,
  },
  imageContainer: {
    width: tileSize - 16,
    height: tileSize - 16,
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
    padding: 8,
    backgroundColor: '#fff',
  },
  imageName: {
    fontSize: 12,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
});

export default GalleryScreen; 