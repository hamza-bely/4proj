import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Navigation, MapPin, Trash2 } from 'lucide-react-native';

interface SavedRouteCardProps {
  id: number;
  startAddress: string;
  endAddress: string;
  mode: string;
  createdAt: string;
  hasToll: boolean;
  onDelete: (id: number) => void;
  onSelect: (id: number) => void;
}

const SavedRouteCard: React.FC<SavedRouteCardProps> = ({
  id,
  startAddress,
  endAddress,
  mode,
  createdAt,
  hasToll,
  onDelete,
  onSelect,
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <TouchableOpacity style={styles.card} onPress={() => onSelect(id)}>
      <View style={styles.cardHeader}>
        <View style={styles.titleContainer}>
          <Navigation size={18} color="#3498db" />
          <Text style={styles.titleText}>
            Itinéraire {mode === 'Rapide' ? 'rapide' : 'court'}
            {hasToll ? '' : ' (sans péage)'}
          </Text>
        </View>
        <Text style={styles.dateText}>{formatDate(createdAt)}</Text>
      </View>

      <View style={styles.addressContainer}>
        <View style={styles.addressRow}>
          <MapPin size={16} color="#3498db" />
          <Text style={styles.addressText} numberOfLines={1}>
            {startAddress}
          </Text>
        </View>
        
        <View style={styles.addressRow}>
          <MapPin size={16} color="#e74c3c" />
          <Text style={styles.addressText} numberOfLines={1}>
            {endAddress}
          </Text>
        </View>
      </View>

      <TouchableOpacity 
        style={styles.deleteButton} 
        onPress={() => onDelete(id)}
      >
        <Trash2 size={18} color="#e74c3c" />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    position: 'relative',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginLeft: 8,
    fontFamily: 'Inter-Medium',
  },
  dateText: {
    fontSize: 12,
    color: '#777',
    fontFamily: 'Inter-Regular',
  },
  addressContainer: {
    marginBottom: 8,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  addressText: {
    fontSize: 14,
    color: '#444',
    marginLeft: 8,
    flex: 1,
    fontFamily: 'Inter-Regular',
  },
  deleteButton: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    padding: 4,
  },
});

export default SavedRouteCard;