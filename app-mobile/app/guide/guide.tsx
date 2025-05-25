import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 
import GuideInfo from '@/constants/GuideInfo';
import { router, Stack } from 'expo-router';

const GuideScreen = () => {
  return <>
    <Stack.Screen options={{ headerShown:false}} />
    <View style={{marginTop:40,flexDirection:'row', alignItems:'center', display:'flex'}}>
      <TouchableOpacity onPress={()=>router.replace('/(tabs)')} style={styles.backStyleView} >
        <Ionicons name='home' size={21} color='#16a34a' onPress={() => router.replace('/(tabs)')} />
      </TouchableOpacity>
      <View style={styles.TitleStyleView} >
        <Text style={styles.TitleStyle}>Guide</Text>
      </View>
    </View>
    
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerCard}>
        <Text style={styles.headerTitle}>Comment utiliser PlantCare</Text>
        <Text style={styles.headerDescription}>
          Suivez ces étapes pour identifier les problèmes de vos plantes
        </Text>
      </View>

      {GuideInfo.map(({ step, title, desc, hint }, index) => (
        <View key={index} style={styles.card}>
          <View style={styles.stepHeader}>
            <View style={styles.stepCircle}>
              <Text style={styles.stepText}>{step}</Text>
            </View>
            <Text style={styles.stepTitle}>{title}</Text>
          </View>
          <Text style={styles.stepDesc}>{desc}</Text>
          {hint && (
            <View style={styles.tipBox}>
              <Text style={styles.tipText}>{hint}</Text>
            </View>
          )}
        </View>
      ))}
      <View style={styles.helpBox}>
        <Ionicons name="help-circle-outline" size={16} color="#2563eb" style={{ marginRight: 8 }} />
        <View>
          <Text style={styles.helpTitle}>Besoin d'aide?</Text>
          <Text style={styles.helpText}>
            Consultez notre FAQ ou contactez notre support technique via les Paramètres.
          </Text>
        </View>
      </View>
    </ScrollView>
  </>
};

const styles = StyleSheet.create({
  TitleStyleView : {
    marginLeft :5,
    display :'flex',
    flexDirection : 'row',
    justifyContent : 'center',
    alignItems : 'center',
    backgroundColor: 'white',
    padding: 8,
    borderRadius: 40,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    width : 100
  },
  backStyleView : {
    marginLeft : 20,
    display :'flex',
    flexDirection : 'row',
    justifyContent : 'center',
    alignItems : 'center',
    gap:3,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 40,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    width : 42
  },
  TitleStyle : {
    fontWeight : 'bold',
    color:'#16a34a',
    fontSize: 18
  },
  container: {
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
  },
  headerCard: {
    backgroundColor: '#16a34a',
    padding: 12,
    borderRadius: 10,
    marginBottom: 16,
  },
  headerTitle: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  headerDescription: {
    color: 'white',
    fontSize: 12,
    marginTop: 4,
  },
  card: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  stepCircle: {
    backgroundColor: '#bbf7d0',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  stepText: {
    color: '#16a34a',
    fontWeight: 'bold',
  },
  stepTitle: {
    fontWeight: '600',
    fontSize: 14,
  },
  stepDesc: {
    marginLeft: 40,
    fontSize: 12,
    color: '#4b5563',
  },
  tipBox: {
    backgroundColor: '#ecfdf5',
    padding: 8,
    borderRadius: 6,
    marginTop: 6,
    marginLeft: 40,
  },
  tipText: {
    fontSize: 12,
    color: '#4b5563',
  },
  helpBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#eff6ff',
    borderColor: '#bfdbfe',
    borderWidth: 1,
    padding: 12,
    borderRadius: 10,
    marginTop: 16,
  },
  helpTitle: {
    color: '#1d4ed8',
    fontWeight: '600',
    fontSize: 14,
    marginBottom: 4,
  },
  helpText: {
    fontSize: 12,
    color: '#2563eb',
  },
});

export default GuideScreen;
