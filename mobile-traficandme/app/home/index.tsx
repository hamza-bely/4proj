import React from 'react';
import { StyleSheet, Text, View, useColorScheme } from 'react-native';
import { Colors } from '@/constants/Colors';
import TomTomMap from '@components/TomTomMaps';

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const textColor = colorScheme === 'dark' ? Colors.dark.text : Colors.light.text;

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: textColor }]}>Carte de Lyon 🗺️</Text>
      <View style={styles.mapContainer}>
        <TomTomMap />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 10,
  },
  mapContainer: {
    flex: 1,
  },
});
