import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Feather from "@expo/vector-icons/Feather"; 
import { router } from "expo-router";

export default function FeatchersCards() {
  return (
      <View style={styles.grid}>
        <TouchableOpacity onPress={()=>router.replace('/(tabs)/scanner')} style={styles.card}>
          <View style={styles.iconContainerGreen}>
            <Feather name="camera" size={24} color="#16A34A" />
          </View>
          <Text style={styles.cardText}>Scanner</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={()=>router.replace('/(tabs)/activity')} style={styles.card}>
          <View style={styles.iconContainerBlue}>
            <Feather name="activity" size={24} color="#2563EB" />
          </View>
          <Text style={styles.cardText}>Historique</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={()=>router.replace('/guide/guide')} style={styles.card}>
          <View style={styles.iconContainerOrange}>
            <Feather name="book-open" size={24} color="#F97316" />
          </View>
          <Text style={styles.cardText}>Guide</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={()=>router.replace('/settings/settings')} style={styles.card}>
          <View style={styles.iconContainerPurple}>
            <Feather name="settings" size={24} color="#7C3AED" />
          </View>
          <Text style={styles.cardText}>Paramètres</Text>
        </TouchableOpacity>
      </View>
  );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
    },
    grid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        gap: 13, 
        marginBottom: 24, 
    },
    card: {
        backgroundColor: "#fff",
        padding: 16,
        borderRadius: 12,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
        alignItems: "center",
        flexBasis: "48%", 
    },
    iconContainerGreen: {
        backgroundColor: "#D1FAE5", 
        padding: 8,
        borderRadius: 50,
        marginBottom: 8, 
    },
    iconContainerBlue: {
        backgroundColor: "#BFDBFE", 
        padding: 8,
        borderRadius: 50,
        marginBottom: 8,
    },
    iconContainerOrange: {
        backgroundColor: "#FFEDD5", 
        padding: 8,
        borderRadius: 50,
        marginBottom: 8, 
    },
    iconContainerPurple: {
        backgroundColor: "#F3E8FF", 
        padding: 8,
        borderRadius: 50,
        marginBottom: 8,
    },
    cardText: {
        fontSize: 14, 
        fontWeight: "500", 
        color: "#4B5563", 
    },
});