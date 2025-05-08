import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Alert, TouchableOpacity, RefreshControl, Modal } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/services/api';
import Button from '@/components/Button';
import Input from '@/components/Input';
import ReportCard from '@/components/ReportCard';
import SavedRouteCard from '@/components/SavedRouteCard';
import { LogOut, User, X } from 'lucide-react-native';

export default function ProfileScreen() {
  const { state: authState, signOut, updateUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [reports, setReports] = useState<any[]>([]);
  const [savedRoutes, setSavedRoutes] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [activeTab, setActiveTab] = useState('reports');

  useEffect(() => {
    if (authState.user) {
      setFirstName(authState.user.firstName || '');
      setLastName(authState.user.lastName || '');
      setEmail(authState.user.email || '');
    }
    fetchUserData();
  }, [authState.user]);

  const fetchUserData = async () => {
    try {
      setIsLoading(true);

      // Fetch user reports
      const reportsResponse = await api.get('/api/reports/get-all-by-user');
      if (reportsResponse.data.data) {
        setReports(reportsResponse.data.data);
      }

      // Fetch user saved routes
      const routesResponse = await api.get('/api/traffic/user');
      if (routesResponse.data.data) {
        setSavedRoutes(routesResponse.data.data);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      Alert.alert('Erreur', 'Impossible de charger vos données');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchUserData();
  };

  const handleUpdateProfile = async () => {
    try {
      setIsLoading(true);

      await updateUser({
        firstName,
        lastName,
        email,
      });

      setShowEditModal(false);
      Alert.alert('Succès', 'Profil mis à jour avec succès');
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Erreur', 'Impossible de mettre à jour votre profil');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = () => {
    Alert.alert(
      'Déconnexion',
      'Êtes-vous sûr de vouloir vous déconnecter?',
      [
        {
          text: 'Annuler',
          style: 'cancel'
        },
        {
          text: 'Déconnexion',
          style: 'destructive',
          onPress: signOut
        }
      ]
    );
  };

  const handleDeleteReport = async (id: number) => {
    try {
      const response = await api.delete(`/api/reports/${id}/delete-definitive`);
      if (response.status === 200) {
        setReports(reports.filter(report => report.id !== id));
        Alert.alert('Succès', 'Signalement supprimé avec succès');
      }
    } catch (error) {
      console.error('Error deleting report:', error);
      Alert.alert('Erreur', 'Impossible de supprimer le signalement');
    }
  };

  const handleDeleteRoute = async (id: number) => {
    try {
      const response = await api.delete(`/api/traffic/${id}/delete-for-an-user`);
      if (response.status === 200) {
        setSavedRoutes(savedRoutes.filter(route => route.id !== id));
        Alert.alert('Succès', 'Itinéraire supprimé avec succès');
      }
    } catch (error) {
      console.error('Error deleting route:', error);
      Alert.alert('Erreur', 'Impossible de supprimer l\'itinéraire');
    }
  };

  const handleSelectRoute = (id: number) => {
    // Logic to select and view route on map
    Alert.alert('Information', 'Fonctionnalité de visualisation de l\'itinéraire en développement');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <View style={styles.avatar}>
            <User size={32} color="#fff" />
          </View>
          <View style={styles.userDetails}>
            <Text style={styles.userName}>
              {authState.user?.firstName} {authState.user?.lastName}
            </Text>
            <Text style={styles.userEmail}>{authState.user?.email}</Text>
          </View>
        </View>

        <View style={styles.actions}>
          <Button
            title="Modifier"
            variant="outline"
            onPress={() => setShowEditModal(true)}
            style={styles.editButton}
          />
          <TouchableOpacity style={styles.logoutButton} onPress={handleSignOut}>
            <LogOut size={20} color="#e74c3c" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'reports' && styles.activeTabButton,
          ]}
          onPress={() => setActiveTab('reports')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'reports' && styles.activeTabText,
            ]}
          >
            Mes signalements
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'routes' && styles.activeTabButton,
          ]}
          onPress={() => setActiveTab('routes')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'routes' && styles.activeTabText,
            ]}
          >
            Mes itinéraires
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.contentContainer}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {isLoading && !refreshing ? (
          <ActivityIndicator size="large" color="#3498db" style={styles.loader} />
        ) : (
          <>
            {activeTab === 'reports' && (
              <>
                {reports.length > 0 ? (
                  reports.map((report) => (
                    <ReportCard
                      key={report.id}
                      id={report.id}
                      type={report.type}
                      address={report.address || 'Adresse non disponible'}
                      likeCount={report.likeCount}
                      dislikeCount={report.dislikeCount}
                      createdAt={report.createDate}
                      onLike={() => {}}
                      onDislike={() => {}}
                    />
                  ))
                ) : (
                  <View style={styles.emptyState}>
                    <Text style={styles.emptyStateText}>
                      Vous n'avez pas encore de signalements.
                    </Text>
                  </View>
                )}
              </>
            )}

            {activeTab === 'routes' && (
              <>
                {savedRoutes.length > 0 ? (
                  savedRoutes.map((route) => (
                    <SavedRouteCard
                      key={route.id}
                      id={route.id}
                      startAddress={route.address_start || 'Départ non spécifié'}
                      endAddress={route.address_end || 'Destination non spécifiée'}
                      mode={route.mode}
                      createdAt={route.createDate}
                      hasToll={route.peage}
                      onDelete={handleDeleteRoute}
                      onSelect={handleSelectRoute}
                    />
                  ))
                ) : (
                  <View style={styles.emptyState}>
                    <Text style={styles.emptyStateText}>
                      Vous n'avez pas encore d'itinéraires enregistrés.
                    </Text>
                  </View>
                )}
              </>
            )}
          </>
        )}
      </ScrollView>
      <View style={styles.logoutContainer}>
        <Button
          title="Déconnexion"
          variant="danger"
          onPress={handleSignOut}
          style={styles.logoutFullButton}
          icon={<LogOut size={20} color="#fff" />}
        />
      </View>

      <Modal
        visible={showEditModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowEditModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Modifier le profil</Text>
              <TouchableOpacity
                onPress={() => setShowEditModal(false)}
              >
                <X size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <Input
              label="Prénom"
              value={firstName}
              onChangeText={setFirstName}
              placeholder="Votre prénom"
            />

            <Input
              label="Nom"
              value={lastName}
              onChangeText={setLastName}
              placeholder="Votre nom"
            />

            <Input
              label="Email"
              value={email}
              onChangeText={setEmail}
              placeholder="Votre email"
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <View style={styles.modalActions}>
              <Button
                title="Annuler"
                variant="outline"
                onPress={() => setShowEditModal(false)}
                style={styles.modalButton}
              />
              <Button
                title="Enregistrer"
                onPress={handleUpdateProfile}
                loading={isLoading}
                disabled={isLoading}
                style={styles.modalButton}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 16,
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#3498db',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  userDetails: {
    justifyContent: 'center',
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    fontFamily: 'Inter-Bold',
  },
  userEmail: {
    fontSize: 14,
    color: '#777',
    fontFamily: 'Inter-Regular',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editButton: {
    marginRight: 12,
  },
  logoutButton: {
    padding: 8,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
  },
  activeTabButton: {
    borderBottomWidth: 2,
    borderBottomColor: '#3498db',
  },
  tabText: {
    fontSize: 16,
    color: '#777',
    fontFamily: 'Inter-Medium',
  },
  activeTabText: {
    color: '#3498db',
    fontWeight: '600',
  },
  contentContainer: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 80,
  },
  loader: {
    marginTop: 20,
  },
  emptyState: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    color: '#777',
    textAlign: 'center',
    fontFamily: 'Inter-Regular',
  },
  logoutContainer: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
  },
  logoutFullButton: {
    backgroundColor: '#e74c3c',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 16,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
    width: '100%',
    maxWidth: 500,
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
    color: '#333',
    fontFamily: 'Inter-Bold',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  modalButton: {
    flex: 1,
    marginHorizontal: 8,
  },
});