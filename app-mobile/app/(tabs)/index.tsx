import FeatchersCards from '@/components/home/FeatchersCards';
import RecentDiseases from '@/components/home/RecentDiseases';
import WelcomCard from '@/components/home/WelcomCard';
import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';

export default function HomeScreen() {
  return <>
    <SafeAreaView style={styles.container}>
      <WelcomCard />
      <FeatchersCards />
      <RecentDiseases />
    </SafeAreaView>
  </>
}
const styles = StyleSheet.create({
  container : {
    marginTop: 40,
    paddingHorizontal: 15
  }
});


