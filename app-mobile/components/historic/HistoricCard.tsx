import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface HistoricCardProps {
  imageUri: string;
  diseaseName: string;
  confidence: number;
  status: string;
  timestamp: string;
}

const HistoricCard: React.FC<HistoricCardProps> = ({
  imageUri,
  diseaseName,
  confidence,
  status,
  timestamp
}) => {
  const getStatusStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case 'severe':
        return styles.severeStatus;
      case 'moderate':
        return styles.moderateStatus;
      case 'healthy':
        return styles.healthyStatus;
      default:
        return styles.healthyStatus;
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <View style={styles.card}>
      <View style={styles.itemHeader}>
        <View style={styles.itemLeft}>
          <Image source={{ uri: imageUri }} style={styles.image} />
          <View>
            <Text style={styles.itemTitle}>{diseaseName}</Text>
            <Text style={styles.itemSubtitle}>{Math.round(confidence * 100)}% confidence</Text>
          </View>
        </View>
        <Text style={styles.time}>{formatTime(timestamp)}</Text>
      </View>
      
      <View style={styles.itemFooter}>
        <Text style={[styles.status, getStatusStyle(status)]}>
          {status}
        </Text>
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.actionButton}>
            <Feather name="share-2" size={14} color="#6B7280" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Feather name="trash-2" size={14} color="#6B7280" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
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
  image: {
    width: 48,
    height: 48,
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
});

export default HistoricCard;
