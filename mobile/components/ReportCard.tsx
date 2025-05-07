import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ThumbsUp, ThumbsDown } from 'lucide-react-native';

interface ReportCardProps {
  id: number;
  type: string;
  address: string;
  likeCount: number;
  dislikeCount: number;
  createdAt: string;
  onLike: (id: number) => void;
  onDislike: (id: number) => void;
}

const ReportCard: React.FC<ReportCardProps> = ({
  id,
  type,
  address,
  likeCount,
  dislikeCount,
  createdAt,
  onLike,
  onDislike,
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getReportTypeText = (type: string) => {
    switch (type) {
      case 'ACCIDENTS':
        return 'Accident';
      case 'TRAFFIC':
        return 'Trafic';
      case 'ROADS_CLOSED':
        return 'Route fermée';
      case 'POLICE_CHECKS':
        return 'Contrôle policier';
      case 'OBSTACLES':
        return 'Obstacle';
      default:
        return type;
    }
  };

  const getReportTypeColor = (type: string) => {
    switch (type) {
      case 'ACCIDENTS':
        return '#e74c3c';
      case 'TRAFFIC':
        return '#f39c12';
      case 'ROADS_CLOSED':
        return '#e67e22';
      case 'POLICE_CHECKS':
        return '#3498db';
      case 'OBSTACLES':
        return '#27ae60';
      default:
        return '#95a5a6';
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View
          style={[
            styles.typeIndicator,
            { backgroundColor: getReportTypeColor(type) },
          ]}
        >
          <Text style={styles.typeText}>{getReportTypeText(type)}</Text>
        </View>
        <Text style={styles.dateText}>{formatDate(createdAt)}</Text>
      </View>

      <Text style={styles.addressText}>{address}</Text>

      <View style={styles.actionContainer}>
        <TouchableOpacity 
          style={styles.actionButton} 
          onPress={() => onLike(id)}
        >
          <ThumbsUp size={18} color="#555" />
          <Text style={styles.actionText}>{likeCount}</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionButton} 
          onPress={() => onDislike(id)}
        >
          <ThumbsDown size={18} color="#555" />
          <Text style={styles.actionText}>{dislikeCount}</Text>
        </TouchableOpacity>
      </View>
    </View>
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
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  typeIndicator: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  typeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'Inter-Medium',
  },
  dateText: {
    fontSize: 12,
    color: '#777',
    fontFamily: 'Inter-Regular',
  },
  addressText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 12,
    fontFamily: 'Inter-Regular',
    lineHeight: 20,
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  actionText: {
    marginLeft: 6,
    fontSize: 14,
    color: '#555',
    fontFamily: 'Inter-Regular',
  },
});

export default ReportCard;