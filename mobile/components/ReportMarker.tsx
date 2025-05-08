import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Marker } from 'react-native-maps';

interface ReportMarkerProps {
  coordinate: {
    latitude: number;
    longitude: number;
  };
  type: 'ACCIDENTS' | 'TRAFFIC' | 'ROADS_CLOSED' | 'POLICE_CHECKS' | 'OBSTACLES';
  id: number;
  onPress: (id: number) => void;
}

const ReportMarker: React.FC<ReportMarkerProps> = ({ coordinate, type, id, onPress }) => {
  const getMarkerImage = () => {
    switch (type) {
      case 'ACCIDENTS':
        return require('@/assets/icons/accidents.png');
      case 'TRAFFIC':
        return require('@/assets/icons/traffic.png');
      case 'ROADS_CLOSED':
        return require('@/assets/icons/roads_closed.png');
      case 'POLICE_CHECKS':
        return require('@/assets/icons/police.png');
      case 'OBSTACLES':
      default:
        return require('@/assets/icons/obstacles.png');
    }
  };

  return (
    <Marker
      coordinate={coordinate}
      onPress={() => onPress(id)}
    >
      <View style={styles.markerContainer}>
        <Image
          style={[styles.markerImage, { width: 52, height: 52 }]}
          source={getMarkerImage()}  />
      </View>
    </Marker>
  );
};

const styles = StyleSheet.create({
  markerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
  },
  markerImage: {
    width: 36,
    height: 36,
    resizeMode: 'contain',
  },
});

export default ReportMarker;