import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
export default function WelcomCard() {
  return (
    <View style={styles.header}>
    <View style={styles.headerText}>
        <Text style={styles.greeting}>Bonjour</Text>
        <Text style={styles.name}>Monsieur, Madame</Text>
    </View>
    <TouchableOpacity style={styles.iconContainer}>
        <FontAwesome5 name="leaf" size={24} color="#16a34a" />
    </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 2,
    borderColor: "#D1D5DB", 
    borderRadius: 15,
    padding: 16,
    width: 288, 
    height: 560,
    backgroundColor: "#F9FAFB", 
  },
  header: {
    backgroundColor: "#16A34A", 
    padding: 19,
    borderRadius: 10,
    marginBottom: 24, 
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerText: {
    justifyContent: "center",
  },
  greeting: {
    fontSize: 17, 
    color: "white",
  },
  name: {
    fontWeight: "bold",
    color: "white",
    fontSize : 20
  },
  iconContainer: {
    backgroundColor: "white",
    borderRadius: 50,
    padding: 8,
  },
});
