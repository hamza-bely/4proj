import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Clock, DollarSign, MapPin, X } from 'lucide-react-native';
import Button from '@/components/Button';

const formatDuration = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours > 0) {
    return `${hours}h ${minutes}min`;
  }
  return `${minutes} min`;
};

const formatDistance = (meters) => {
  if (meters >= 1000) {
    return `${(meters / 1000).toFixed(1)} km`;
  }
  return `${meters} m`;
};

const RouteOptionsModal = ({ routes, onSelectRoute, onClose }) => {
  if (!routes || routes.length === 0) {
    return (
      <View style={styles.modalContent}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Options d'itinéraire</Text>
          <TouchableOpacity onPress={onClose}>
            <X size={24} color="#333" />
          </TouchableOpacity>
        </View>
        <Text style={styles.noRoutesText}>Aucun itinéraire disponible</Text>
        <Button title="Fermer" onPress={onClose} />
      </View>
    );
  }

  return (
    <View style={styles.modalContent}>
      <View style={styles.modalHeader}>
        <Text style={styles.modalTitle}>Options d'itinéraire</Text>
        <TouchableOpacity onPress={onClose}>
          <X size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.routesContainer}>
        {routes.map((route, index) => {
          const routeData = route.routes[0];
          const summary = routeData.summary;

          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.routeOption,
                route.isRecommended && styles.recommendedRoute
              ]}
              onPress={() => onSelectRoute(route)}
            >
              {route.isRecommended && (
                <View style={styles.recommendedBadge}>
                  <Text style={styles.recommendedText}>Recommandé</Text>
                </View>
              )}

              <View style={styles.routeHeader}>
                <Text style={styles.routeTitle}>
                  {index === 0 ? "Itinéraire" : "Alternative " + index}
                  {route.hasTolls ? " (avec péage)" : " (sans péage)"}
                </Text>
              </View>

              <View style={styles.routeDetails}>
                <View style={styles.routeDetail}>
                  <Clock size={16} color="#3498db" />
                  <Text style={styles.routeDetailText}>
                    {formatDuration(summary.travelTimeInSeconds)}
                  </Text>
                </View>

                <View style={styles.routeDetail}>
                  <MapPin size={16} color="#3498db" />
                  <Text style={styles.routeDetailText}>
                    {formatDistance(summary.lengthInMeters)}
                  </Text>
                </View>

                {route.hasTolls && (
                  <View style={styles.routeDetail}>
                    <DollarSign size={16} color="#3498db" />
                    <Text style={styles.routeDetailText}>Péages inclus</Text>
                  </View>
                )}
              </View>

              <Button
                title="Sélectionner cet itinéraire"
                onPress={() => onSelectRoute(route)}
                style={styles.selectButton}
              />
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <View style={styles.modalActions}>
        <Button
          title="Annuler"
          variant="outline"
          onPress={onClose}
          style={styles.modalButton}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
    width: '90%',
    maxWidth: 500,
    alignSelf: 'center',
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  routesContainer: {
    maxHeight: 400,
  },
  routeOption: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  recommendedRoute: {
    borderColor: '#3498db',
    borderWidth: 2,
  },
  recommendedBadge: {
    position: 'absolute',
    top: -10,
    right: 10,
    backgroundColor: '#3498db',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  recommendedText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  routeHeader: {
    marginBottom: 12,
  },
  routeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  routeDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  routeDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 8,
  },
  routeDetailText: {
    marginLeft: 6,
    color: '#555',
  },
  selectButton: {
    marginTop: 8,
  },
  modalActions: {
    marginTop: 16,
  },
  modalButton: {
    width: '100%',
  },
  noRoutesText: {
    textAlign: 'center',
    marginVertical: 24,
    color: '#555',
  },
});

export default RouteOptionsModal;