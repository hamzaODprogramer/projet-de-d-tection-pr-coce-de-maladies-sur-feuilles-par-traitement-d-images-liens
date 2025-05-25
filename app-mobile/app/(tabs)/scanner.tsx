import React, { useRef, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert, Image } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import { router } from "expo-router";

export default function ScannerScreen() {
  const [status, requestMediaLibraryPermission] = ImagePicker.useMediaLibraryPermissions();
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);

  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);

  const pickImage = async () => {
    requestMediaLibraryPermission()
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.5,
      });

      if (!result.canceled && result.assets[0]) {
        const timestamp = new Date().getTime();
        const filename = `plant_${timestamp}.jpg`;
        const filepath = `${FileSystem.documentDirectory}${filename}`;

        // Copy the image to our app's directory
        await FileSystem.copyAsync({
          from: result.assets[0].uri,
          to: filepath
        });

        setCapturedPhoto(filepath);
        router.replace({
          pathname: "/waiting/waiting",
          params: {
            image: filepath
          }
        });
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Failed to pick image from gallery");
    }
  };

  const takePicture = async () => {
    requestPermission();
    if(permission?.status === "granted"){
      try {
        const photo = await cameraRef.current?.takePictureAsync({
          quality: 0.5,
          exif: false,
        });

        if (photo) {
          const timestamp = new Date().getTime();
          const filename = `plant_${timestamp}.jpg`;
          const filepath = `${FileSystem.documentDirectory}${filename}`;

          await FileSystem.moveAsync({
            from: photo.uri,
            to: filepath
          });

          setCapturedPhoto(filepath);
          router.replace({
            pathname: "/waiting/waiting",
            params: {
              image: filepath
            }
          });
        }
      } catch (error) {
        console.error("Error taking picture:", error);
        Alert.alert("Error", "Failed to save photo");
      }
    }
  }

  return <>
      <View style={styles.card}>
        <View style={styles.iconRow}>
          <TouchableOpacity style={styles.iconWrapper}>
            <Feather name="settings" size={20} color="white" />
          </TouchableOpacity>
          <TouchableOpacity onPress={pickImage} style={styles.iconWrapper}>
            <Feather name="image" size={20} color="white" />
          </TouchableOpacity>
        </View>
        
        <CameraView ref={cameraRef} style={styles.centerBox}>
          <View style={styles.dashedBox}>
            <Text style={styles.text}>Alignez la feuille ici</Text>
          </View>
        </CameraView>
        
        <TouchableOpacity onPress={takePicture} style={styles.centerCircle}>
          <View style={styles.innerCircle}>
            <Feather name="camera" style={{opacity:0.7}} size={30} color="black" />
          </View>
        </TouchableOpacity>
      </View>
  </>
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 8,
  },
  card: {
    backgroundColor: "black",
    borderRadius: 16,
    padding: 16,
    width: "auto",
    height: "100%",
  },
  iconRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
    marginTop: 19,
  },
  iconWrapper: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 8,
    borderRadius: 50,
  },
  centerBox: {
    backgroundColor: "#2d2d2d",
    borderRadius: 16,
    height: 484,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  dashedBox: {
    borderWidth: 2,
    borderColor: "white",
    borderStyle: "dashed",
    borderRadius: 16,
    width: 192,
    height: 192,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "white",
    fontSize: 12,
  },
  centerCircle: {
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  innerCircle: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#e5e7eb",
    borderRadius: 50,
    width: 69,
    height: 69,
    position: "absolute",
    bottom: -35,
  },
});
