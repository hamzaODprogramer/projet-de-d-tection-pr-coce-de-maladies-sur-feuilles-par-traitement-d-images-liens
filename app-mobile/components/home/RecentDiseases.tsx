import { router } from "expo-router";
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { getDetections } from '@/utils/database';

interface Detection {
  id: number;
  image_uri: string;
  disease_name: string;
  confidence: number;
  timestamp: string;
  status: string;
}


export default function RecentDiseases() {

  const [detections, setDetections] = useState<Detection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDetections();
  }, []);

  const loadDetections = async () => {
    try {
      setLoading(true);
      const data = await getDetections();
      setDetections(Array.isArray(data) ? data : []);
      setError(null);
    } catch (error) {
      console.error('Error loading detections:', error);
      setError('Failed to load detection history');
      setDetections([]);
    } finally {
      setLoading(false);
    }
  };

  const groupDetectionsByDate = () => {
    const groups: { [key: string]: Detection[] } = {};
    
    detections.forEach(detection => {
      const date = new Date(detection.timestamp);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      let groupKey = 'Other';
      if (date.toDateString() === today.toDateString()) {
        groupKey = 'Aujourd\'hui';
      } else if (date.toDateString() === yesterday.toDateString()) {
        groupKey = 'Hier';
      } else {
        groupKey = date.toLocaleDateString();
      }
      
      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(detection);
    });
    
    return groups;
  };

  const groupedDetections = groupDetectionsByDate();

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Maladies récentes</Text>
      {Object.entries(groupedDetections)
        .flatMap(([date, detections]) =>
          detections.map(d => ({ ...d, date }))
        )
        .slice(-3)
        .map((item, index) => (
          <View style={styles.diseaseItem}>
            <Image source={{ uri: item.image_uri }} style={styles.imagePlaceholder} />
            <View>
              <Text style={styles.diseaseName}>{item.disease_name}</Text>
              <Text style={styles.diseaseDate}>{item.timestamp}</Text>
            </View>
          </View>
      ))}
      
      <TouchableOpacity onPress={()=>router.replace('/(tabs)/activity')} style={styles.button}>
        <Text style={styles.buttonText}>Voir plus</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    marginBottom: 24,
  },
  title: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 12,
  },
  diseaseItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  imagePlaceholder: {
    width: 40,
    height: 40,
    backgroundColor: "#E5E7EB", 
    borderRadius: 8,
    marginRight: 12,
  },
  diseaseName: {
    fontSize: 14,
    fontWeight: "500",
  },
  diseaseDate: {
    fontSize: 12,
    color: "#6B7280", 
  },
  button : {
    backgroundColor : '#16A34A',
    width :'100%',
    textAlign : 'center',
    display : 'flex',
    justifyContent : 'center',
    alignItems : 'center',
    padding : 9,
    borderRadius : 20,
    color: 'white'
  },
  buttonText : {
    textAlign : 'center',
    color: 'white',
    fontWeight : 'bold',
    fontSize : 14
  }
});
