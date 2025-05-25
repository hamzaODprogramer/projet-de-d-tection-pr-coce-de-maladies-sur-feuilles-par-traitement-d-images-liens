import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ImageBackground, ActivityIndicator } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { saveDetection } from "@/utils/database";

interface DiseaseAnalysis {
  diseaseName: string;
  confidence: number;
  description: string;
  recommendations: string[];
}

// Gemini API configuration
const GEMINI_API_KEY = 'AIzaSyALL-eKHqQCGgpNtzBjWD7dXyp_EP_mAKc';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

export default function ResultScreen() {
  const {image, prediction} = useLocalSearchParams<{image: string, prediction: string}>();
  const [analysis, setAnalysis] = useState<DiseaseAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  
  const isDiseased = prediction === "1" || prediction === "true" || prediction === "True";

  useEffect(() => {
    if (isDiseased) {
      analyzeDisease();
    }
  }, [isDiseased]);

  const analyzeDisease = async () => {
    try {
      setLoading(true);
      
      // Convert image to base64
      const imageResponse = await fetch(image);
      const blob = await imageResponse.blob();
      const base64Image = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const result = reader.result as string;
          resolve(result);
        };
        reader.readAsDataURL(blob);
      });

      const prompt = `Analyze this plant leaf image and provide a detailed analysis. You must respond with ONLY a valid JSON object in the following exact format, with no additional text or formatting:
      {
        "diseaseName": "name of the disease in French",
        "confidence": 85,
        "description": "brief description of the disease in French",
        "recommendations": ["recommendation 1 in French", "recommendation 2 in French", "recommendation 3 in French"]
      }
      Do not include any markdown formatting, backticks, or additional text. Only return the raw JSON object.`;

      const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [
              { text: prompt },
              {
                inline_data: {
                  mime_type: "image/jpeg",
                  data: base64Image.split(',')[1]
                }
              }
            ]
          }],
          generationConfig: {
            temperature: 0.1,
            topK: 32,
            topP: 1,
            maxOutputTokens: 4096,
          }
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const responseText = data.candidates[0].content.parts[0].text;
      
      try {

        console.log('Raw Gemini response:', responseText);      
        const cleanedResponse = responseText.trim().replace(/^```json\n?|\n?```$/g, '');
        const analysisData = JSON.parse(cleanedResponse) as DiseaseAnalysis;
        setAnalysis(analysisData);
        const status = isDiseased ? 'severe' : 'healthy';
        await saveDetection(image, analysisData.diseaseName, analysisData.confidence / 100, status);
        console.log('Detection saved to database');

      } catch (parseError) {
        console.error('Error parsing Gemini response:', parseError);
        console.error('Raw response that failed to parse:', responseText);
        throw new Error('Invalid response format from Gemini');
      }
    } catch (error) {
      console.error('Error analyzing disease:', error);
      // Show error in UI
      setAnalysis({
        diseaseName: "Erreur d'analyse",
        confidence: 0,
        description: "Impossible d'analyser l'image. Veuillez réessayer.",
        recommendations: ["Vérifiez votre connexion internet", "Réessayez avec une autre image"]
      });
    } finally {
      setLoading(false);
    }
  };

  return <>
    <Stack.Screen
      name="Result"
      options={{ headerShown: false }}
    />
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={()=>router.replace('/(tabs)')} style={styles.iconButton}>
          <Feather name="home" size={20} color="#4B5563" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton}>
          <Feather name="settings" size={20} color="#4B5563" />
        </TouchableOpacity>
      </View>

      <View style={styles.resultBox}>
        <Text style={styles.resultTitle}>Résultat de l'analyse</Text>
        <ScrollView
          showsVerticalScrollIndicator={true}
          style={{ maxHeight: 470, minHeight:470 }}
          indicatorStyle="default"
        >
          <ImageBackground source={{uri: image}} style={styles.resultImage} />

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#16A34A" />
              <Text style={styles.loadingText}>Analyse en cours...</Text>
            </View>
          ) : isDiseased ? (
            <View style={styles.alertBox}>
              <View style={styles.alertHeader}>
                <Feather name="alert-circle" size={20} color="red" />
                <Text style={styles.alertTitle}>Maladie détectée</Text>
              </View>
              <Text style={styles.disease}>
                {analysis?.diseaseName || 'Maladie détectée'} ({analysis?.confidence || 95}%)
              </Text>
              <Text style={styles.diseaseDesc}>
                {analysis?.description || 'Analyse en cours...'}
              </Text>
            </View>
          ) : (
            <View style={[styles.alertBox, styles.successBox]}>
              <View style={[styles.alertHeader, styles.successHeader]}>
                <Feather name="check-circle" size={20} color="#16A34A" />
                <Text style={[styles.alertTitle, styles.successTitle]}>Plante en bonne santé</Text>
              </View>
              <Text style={[styles.disease, styles.successText]}>Aucune maladie détectée</Text>
              <Text style={[styles.diseaseDesc, styles.successDesc]}>
                Votre plante est en parfaite santé. Continuez à en prendre soin !
              </Text>
            </View>
          )}

          {analysis?.recommendations && (
            <View style={styles.recommendations}>
              <Text style={styles.recommendationTitle}>Recommandations</Text>
              {analysis.recommendations.map((recommendation, index) => (
                <Text key={index} style={styles.recommendation}>• {recommendation}</Text>
              ))}
            </View>
          )}
        </ScrollView>
        <TouchableOpacity style={styles.detailsButton}>
          <Text style={styles.detailsText}>Voir plus de détails</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.actionRow}>
        <TouchableOpacity onPress={()=>router.replace('/(tabs)/scanner')} style={styles.actionButtonBlue}>
          <Feather name="image" size={18} color="#2563EB" style={styles.iconMargin} />
          <Text style={styles.actionTextBlue}>Nouvelle photo</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={()=>router.replace('/(tabs)')} style={styles.actionButtonGreen}>
          <Feather name="home" size={18} color="#16A34A" style={styles.iconMargin} />
          <Text style={styles.actionTextGreen}>home</Text>
        </TouchableOpacity>
      </View>
    </View>
  </>
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    paddingHorizontal: 15
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  iconButton: {
    backgroundColor: "#E5E7EB",
    padding: 8,
    borderRadius: 50,
  },
  resultBox: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 1,
  },
  resultTitle: {
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 14,
    fontSize: 19,
  },
  resultImage: {
    width: "100%",
    height: 200,
    backgroundColor: '#E5E7EB',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    overflow: 'hidden',
  },
  alertBox: {
    backgroundColor: "#FEE2E2",
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  alertHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
    gap: 5,
    padding: 3,
    opacity: 0.8
  },
  alertTitle: {
    color: "#DC2626",
    fontWeight: "600",
    fontSize: 16,
  },
  disease: {
    fontWeight: "700",
    fontSize: 14,
    marginBottom: 4,
    marginLeft: 8,
  },
  diseaseDesc: {
    fontSize: 13,
    color: "#374151",
    marginLeft: 8,
  },
  recommendations: {
    marginBottom: 16,
  },
  recommendationTitle: {
    fontWeight: "600",
    marginBottom: 4,
    marginLeft: 8,
    fontSize: 17,
  },
  recommendation: {
    fontSize: 13,
    marginBottom: 2,
    marginLeft: 12,
  },
  detailsButton: {
    backgroundColor: "#16A34A",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  detailsText: {
    color: "white",
    fontWeight: "600",
  },
  actionRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    gap: 20
  },
  actionButtonBlue: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: 'center',
    backgroundColor: "#DBEAFE",
    padding: 12,
    borderRadius: 12,
    width: '45%'
  },
  actionButtonGreen: {
    display: 'flex',
    flexDirection: "row",
    alignItems: "center",
    justifyContent: 'center',
    backgroundColor: "#D1FAE5",
    padding: 12,
    borderRadius: 12,
    width: '45%',
  },
  iconMargin: {
    marginRight: 4,
  },
  actionTextBlue: {
    fontSize: 13,
    fontWeight: "500",
    color: "#2563EB",
  },
  actionTextGreen: {
    fontSize: 13,
    fontWeight: "500",
    color: "#16A34A",
  },
  successBox: {
    backgroundColor: "#D1FAE5",
  },
  successHeader: {
    opacity: 1,
  },
  successTitle: {
    color: "#16A34A",
  },
  successText: {
    color: "#16A34A",
  },
  successDesc: {
    color: "#374151",
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#16A34A',
    fontSize: 16,
  },
});
