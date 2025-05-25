import { View, Text, TouchableOpacity, Switch, StyleSheet } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import React from 'react';
export default function SettingsScreen() {
  return <>
    <Stack.Screen options={{ headerShown:false}} />
    <View style={{marginTop:40,flexDirection:'row', alignItems:'center', display:'flex'}}>
      <TouchableOpacity onPress={()=>router.replace('/(tabs)')} style={styles.backStyleView} >
        <Ionicons name='home' size={21} color='#16a34a' onPress={() => router.replace('/(tabs)')} />
      </TouchableOpacity>
      <View style={styles.TitleStyleView} >
        <Text style={styles.TitleStyle}>Paramètres</Text>
      </View>
    </View>
        <View style={styles.card}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>GÉNÉRAL</Text>

          <TouchableOpacity style={styles.item}>
            <View style={styles.itemLeft}>
              <Feather name="user" size={18} color="#6B7280" />
              <Text style={styles.itemText}>Langue</Text>
            </View>
            <View style={styles.itemRight}>
              <Text style={styles.itemRightText}>Français</Text>
              <Feather name="chevron-right" size={16} color="#9CA3AF" />
            </View>
          </TouchableOpacity>

          <View style={styles.item}>
            <View style={styles.itemLeft}>
              <Feather name="moon" size={18} color="#6B7280" />
              <Text style={styles.itemText}>Mode sombre</Text>
            </View>
            <Switch value={false} />
          </View>

          <TouchableOpacity style={styles.item}>
            <View style={styles.itemLeft}>
              <Feather name="image" size={18} color="#6B7280" />
              <Text style={styles.itemText}>Qualité des images</Text>
            </View>
            <View style={styles.itemRight}>
              <Text style={styles.itemRightText}>Haute</Text>
              <Feather name="chevron-right" size={16} color="#9CA3AF" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Application */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>APPLICATION</Text>
          <TouchableOpacity style={styles.item}>
            <View style={styles.itemLeft}>
              <Feather name="trash-2" size={18} color="#6B7280" />
              <Text style={styles.itemText}>Vider le cache</Text>
            </View>
            <Feather name="chevron-right" size={16} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.item}>
            <View style={styles.itemLeft}>
              <Feather name="info" size={18} color="#6B7280" />
              <Text style={styles.itemText}>À propos</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.item}>
            <View style={styles.itemLeft}>
              <Feather name="help-circle" size={18} color="#6B7280" />
              <Text style={styles.itemText}>Aide et support</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.item}>
            <View style={styles.itemLeft}>
              <Feather name="lock" size={18} color="#6B7280" />
              <Text style={styles.itemText}>Confidentialité</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Diagnostics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>DIAGNOSTICS</Text>

          <TouchableOpacity style={styles.item}>
            <View style={styles.itemLeft}>
              <Feather name="activity" size={18} color="#6B7280" />
              <Text style={styles.itemText}>Précision du diagnostic</Text>
            </View>
            <View style={styles.itemRight}>
              <Text style={styles.itemRightText}>Standard</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Version */}
        <Text style={styles.versionText}>Version 1.0.2</Text>
    </View>
    </>
}

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
    width : 150
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
    marginBottom: 48,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  card: {
    paddingHorizontal:20,
    marginTop:15,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    paddingVertical: 8,
  },
  sectionTitle: {
    fontSize: 10,
    color: '#6B7280',
    fontWeight: '500',
    paddingHorizontal: 16,
    paddingBottom: 4,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemText: {
    fontSize: 14,
    marginLeft: 12,
  },
  itemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemRightText: {
    fontSize: 12,
    color: '#6B7280',
    marginRight: 4,
  },
  tag: {
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 20,
  },
  tagText: {
    fontSize: 12,
    color: '#059669',
  },
  versionText: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 16,
  },
});
