import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ActivityIndicator, ScrollView, ImageBackground } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Stack, router } from 'expo-router';
import { useLocalSearchParams } from 'expo-router';
import { get_prediction } from '@/actions/imageActions';

type IconName = 'check' | 'rotate-cw' | 'filter' | 'search';

const WaitingScreen = () => {
  const {image} = useLocalSearchParams<{image: string}>();
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [prediction, setPrediction] = useState<{result: string} | null>(null);

  useEffect(() => {
    const analyzeImage = async () => {
      try {
        const progressInterval = setInterval(() => {
          setProgress(prev => {
            if (prev >= 100) {
              clearInterval(progressInterval);
              return 100;
            }
            return prev + 1;
          });
        }, 50);

        const stepInterval = setInterval(() => {
          setCurrentStep(prev => {
            if (prev >= 4) {
              clearInterval(stepInterval);
              return 4;
            }
            return prev + 1;
          });
        }, 1000);

        const result = await get_prediction({ uri: image });
        console.log('API Response:', result);
        setPrediction(result);

        setTimeout(() => {
          clearInterval(progressInterval);
          clearInterval(stepInterval);
          console.log('Navigating with prediction:', result.result);
          router.replace({
            pathname: "/result/result",
            params: { 
              prediction: result.result,
              image: image
            }
          });
        }, 5000);

      } catch (error) {
        console.error('Error analyzing image:', error);
      }
    };

    analyzeImage();
  }, [image]);

  const renderStep = (index: number, title: string, icon?: IconName) => {
    const isActive = index === currentStep;
    const isCompleted = index < currentStep;

    return (
      <View style={[styles.stepItem, isCompleted && styles.stepItemCompleted]}>
        <View style={[
          styles.stepCircle,
          isActive && styles.stepCircleActive,
          isCompleted && styles.stepCircle
        ]}>
          {isCompleted ? (
            <Feather name='check' size={14} color="#22C55E" />
          ) : isActive ? (
            <Feather name={icon || 'rotate-cw'} size={14} color="#22C55E" />
          ) : (
            <Text style={styles.stepNumber}>{index + 1}</Text>
          )}
        </View>
        <Text style={[
          styles.stepText,
          isActive && styles.stepTextBold
        ]}>{title}</Text>
      </View>
    );
  };

  return <>
    <Stack.Screen
        name="Result"
        options={{ headerShown: false }}
    />
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <View style={styles.imageSection}>
          <ImageBackground resizeMode='cover' source={{uri: image}} style={styles.imagePlaceholder}>
            <Text style={styles.imageText}>Image capturée</Text>
          </ImageBackground>

          <ActivityIndicator size="large" color="#22C55E" style={styles.spinner} />
          <Text style={styles.analysisText}>Analyse en cours...</Text>
          <Text style={styles.subText}>Veuillez patienter pendant que nous analysons votre plante</Text>

          <View style={styles.progressBarBackground}>
            <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
          </View>
          <Text style={styles.progressText}>{progress}%</Text>
        </View>

        <View style={styles.stepsCard}>
          <Text style={styles.stepsTitle}>Étapes de l'analyse</Text>

          {renderStep(0, "Prétraitement de l'image", "check")}
          {renderStep(1, "Analyse des symptômes", "rotate-cw")}
          {renderStep(2, "Identification de la maladie")}
          {renderStep(3, "Génération de recommandations")}
        </View>

        <TouchableOpacity 
          style={styles.cancelButton}
          onPress={() => router.replace('/(tabs)/scanner')}
        >
          <Text style={styles.cancelButtonText}>Annuler</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  </>
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingBottom: 32,
    marginTop: 50,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  card: {
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    alignItems: 'center',
  },
  iconButton: {
    backgroundColor: '#E5E7EB',
    padding: 8,
    borderRadius: 9999,
  },
  headerCenter: {
    flexGrow: 1,
    alignItems: 'center',
  },
  headerText: {
    fontWeight: '500',
  },
  imageSection: {
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 24,
    borderRadius: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  imagePlaceholder: {
    width: "100%",
    height: 200,
    backgroundColor: '#E5E7EB',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    overflow: 'hidden',
  },
  imageText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  spinner: {
    marginBottom: 16,
  },
  analysisText: {
    fontWeight: '500',
    marginBottom: 4,
  },
  subText: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 16,
    textAlign: 'center',
  },
  progressBarBackground: {
    width: '100%',
    height: 10,
    backgroundColor: '#E5E7EB',
    borderRadius: 9999,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressBarFill: {
    width: '66%',
    height: '100%',
    backgroundColor: '#16A34A',
  },
  progressText: {
    fontSize: 10,
    color: '#9CA3AF',
    alignSelf: 'flex-end',
  },
  stepsCard: {
    marginTop:-9,
    backgroundColor: '#E5E7EB',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  stepsTitle: {
    fontWeight: '800',
    fontSize:15,
    marginBottom: 12,
    color: '#374151',
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  stepCircle: {
    width: 24,
    height: 24,
    borderRadius: 9999,
    backgroundColor: '#DCFCE7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  stepCircleActive: {
    width: 24,
    height: 24,
    borderRadius: 9999,
    backgroundColor: '#22C55E',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  stepCircleInactive: {
    width: 24,
    height: 24,
    borderRadius: 9999,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  stepText: {
    fontSize: 14,
  },
  stepTextBold: {
    fontSize: 14,
    fontWeight: '600',
  },
  stepItemInactive: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    opacity: 0.5,
  },
  stepNumber: {
    fontSize: 10,
    fontWeight: '600',
    color: '#9CA3AF',
  },
  cancelButton: {
    backgroundColor: '#E5E7EB',
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: -12,
  },
  cancelButtonText: {
    color: '#6B7280',
  },
  stepItemCompleted: {
    opacity: 1,
  },
});

export default WaitingScreen;
