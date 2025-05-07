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
        return require('@/assets/icons/accidents.jpg');
      case 'TRAFFIC':
        return require('@/assets/icons/traffic.jpg');
      case 'ROADS_CLOSED':
        return require('@/assets/icons/roads_closed.jpg');
      case 'POLICE_CHECKS':
        return require('@/assets/icons/police.jpg');
      case 'OBSTACLES':
      default:
        return require('@/assets/icons/obstacles.jpg');
    }
  };

  return (
    <Marker
      coordinate={coordinate}
      onPress={() => onPress(id)}
    >
      <View style={styles.markerContainer}>
        <Image source={getMarkerImage()} style={styles.markerImage} />
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