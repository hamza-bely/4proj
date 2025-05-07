// Nouveau composant à ajouter
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Clock, DollarSign, Navigation } from 'lucide-react-native';

const RouteOptionsModal = ({ routes, onSelectRoute, onClose }) => {
  console.log("routes",routes[0].routes );
  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0) {
      return `${hours} h ${minutes} min`;
    } else {
      return `${minutes} min`;
    }
  };

  // Formatage de la distance en km
  const formatDistance = (meters) => {
    if (meters < 1000) {
      return `${meters} m`;
    } else {
      return `${(meters / 1000).toFixed(1)} km`;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Itinéraires disponibles</Text>
        <TouchableOpacity onPress={onClose}>
          <Text style={styles.closeButton}>Fermer</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.routesList}>
        {routes.map((route, index) => (
          <TouchableOpacity
            key={index}
            style={styles.routeItem}
            onPress={() => onSelectRoute(route)}
          >
            <View style={styles.routeHeader}>
              <View style={styles.routeType}>
                <Navigation size={20} color="#3498db" />
                <Text style={styles.routeTypeText}>
                  {route.hasTolls ? 'Avec péage' : 'Sans péage'}
                </Text>
              </View>
              {route.isRecommended && (
                <View style={styles.recommendedBadge}>
                  <Text style={styles.recommendedText}>Recommandé</Text>
                </View>
              )}
            </View>

            <View style={styles.routeDetails}>
              <View style={styles.detailItem}>
                <Clock size={16} color="#555" />
                <Text style={styles.detailText}>
                  {formatDuration(routes[0].routes[0].summary.travelTimeInSeconds)}
                </Text>
              </View>

              <View style={styles.detailItem}>
                <Navigation size={16} color="#555" />
                <Text style={styles.detailText}>
                  {formatDistance(routes[0].routes[0].summary.lengthInMeters)}
                </Text>
              </View>

              {route.hasTolls && (
                <View style={styles.detailItem}>
                  <DollarSign size={16} color="#555" />
                  <Text style={styles.detailText}>Péages</Text>
                </View>
              )}
            </View>

            {routes[0].routes[0].summary.trafficDelayInSeconds > 60 && (
              <View style={styles.trafficWarning}>
                <Text style={styles.trafficWarningText}>
                  +{formatDuration(routes[0].routes[0].summary.trafficDelayInSeconds)} de retard dû au trafic
                </Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    maxHeight: '80%',
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    color: '#3498db',
    fontSize: 16,
  },
  routesList: {
    marginTop: 12,
  },
  routeItem: {
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#3498db',
  },
  routeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  routeType: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  routeTypeText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  recommendedBadge: {
    backgroundColor: '#27ae60',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  recommendedText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  routeDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 8,
  },
  detailText: {
    marginLeft: 6,
    color: '#555',
    fontSize: 14,
  },
  trafficWarning: {
    marginTop: 8,
    backgroundColor: '#ffebee',
    padding: 8,
    borderRadius: 4,
  },
  trafficWarningText: {
    color: '#e53935',
    fontSize: 12,
  },
});

export default RouteOptionsModal;