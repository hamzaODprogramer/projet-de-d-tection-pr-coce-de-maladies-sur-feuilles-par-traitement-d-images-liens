import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { router } from 'expo-router';
import HistoricCard from '@/components/historic/HistoricCard';
import { getDetections } from '@/utils/database';

interface Detection {
  id: number;
  image_uri: string;
  disease_name: string;
  confidence: number;
  timestamp: string;
  status: string;
}

export default function HistoriqueScreen() {
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

  // Group detections by date
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
    <>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={()=>router.replace('/(tabs)')} style={styles.iconButton}>
            <Feather name="home" size={18} color="#4B5563" />
          </TouchableOpacity>
          <View style={styles.headerRight2}>
            <TouchableOpacity style={styles.iconButton}>
              <Feather name="search" size={18} color="#4B5563" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <Feather name="filter" size={18} color="#4B5563" />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {loading ? (
            <Text style={styles.loadingText}>Loading...</Text>
          ) : error ? (
            <Text style={styles.errorText}>{error}</Text>
          ) : Object.entries(groupedDetections).length === 0 ? (
            <Text style={styles.emptyText}>No detection history found</Text>
          ) : (
            Object.entries(groupedDetections).map(([date, detections]) => (
              <View key={date} style={styles.section}>
                <Text style={styles.sectionTitle}>{date}</Text>
                {detections.map((detection) => (
                  <HistoricCard
                    key={detection.id}
                    imageUri={detection.image_uri}
                    diseaseName={detection.disease_name}
                    confidence={detection.confidence}
                    status={detection.status}
                    timestamp={detection.timestamp}
                  />
                ))}
              </View>
            ))
          )}
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  headerRight2: {
    display: 'flex',
    flexDirection: 'row',
    gap: 8, 
  },
  container: {
    paddingHorizontal: 20,
    marginTop: 40,
    flex: 1, 
    maxHeight:'84%'
  },
  scrollContent: {
    paddingBottom: 20, 
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  card: {
    borderWidth: 2,
    borderColor: '#D1D5DB',
    borderRadius: 16,
    padding: 16,
    width: 288,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  iconButton: {
    backgroundColor: '#E5E7EB',
    padding: 8,
    borderRadius: 999,
  },
  iconMargin: {
    marginRight: 8,
  },
  toggleButtons: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
  },
  toggleActive: {
    backgroundColor: '#2563EB',
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },
  toggleInactive: {
    backgroundColor: '#E5E7EB',
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  },
  toggleActiveText: {
    color: 'white',
    fontSize: 12,
  },
  toggleInactiveText: {
    color: '#374151',
    fontSize: 12,
  },
  section: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: '500',
    color: '#6B7280',
    marginBottom: 8,
  },
  item: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  imagePlaceholder: {
    width: 48,
    height: 48,
    backgroundColor: '#E5E7EB',
    borderRadius: 8,
    marginRight: 12,
  },
  itemTitle: {
    fontWeight: '500',
    fontSize: 14,
  },
  itemSubtitle: {
    fontSize: 10,
    color: '#6B7280',
  },
  time: {
    fontSize: 10,
    color: '#6B7280',
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  status: {
    fontSize: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  severeStatus: {
    backgroundColor: '#FEE2E2',
    color: '#DC2626',
  },
  moderateStatus: {
    backgroundColor: '#FEF9C3',
    color: '#CA8A04',
  },
  healthyStatus: {
    backgroundColor: '#D1FAE5',
    color: '#059669',
  },
  actionButtons: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 4,
    backgroundColor: '#F3F4F6',
    borderRadius: 4,
    marginLeft: 8,
  },
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
    width : 140
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
  loadingText: {
    textAlign: 'center',
    color: '#6B7280',
    marginTop: 20,
  },
  errorText: {
    textAlign: 'center',
    color: '#DC2626',
    marginTop: 20,
  },
  emptyText: {
    textAlign: 'center',
    color: '#6B7280',
    marginTop: 20,
  },
});