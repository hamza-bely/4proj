import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function Menu() {
  const navigation = useNavigation();

  const menuItems = [
    { label: 'Signaler un incident', icon: require('@assets/images/erreur-96.png'), action: () => alert('Signaler un incident') },
    { label: 'Partager un trajet', icon: require('@assets/images/erreur-96.png'), action: () => alert('Partager un trajet') },
    { label: 'Paramètres', icon: require('@assets/images/erreur-96.png'), action: () => alert('Paramètres') },
    { label: 'Historique', icon: require('@assets/images/erreur-96.png'), action: () => alert('Historique') },
    { label: 'Aide', icon: require('@assets/images/erreur-96.png'), action: () => alert('Aide') },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Menu</Text>
      <View style={styles.menuList}>
        {menuItems.map((item, index) => (
          <TouchableOpacity key={index} style={styles.menuItem} onPress={item.action}>
            <Image source={item.icon} style={styles.icon} />
            <Text style={styles.label}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity style={styles.closeButton} onPress={() => navigation.goBack()}>
        <Text style={styles.closeButtonText}>Fermer</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  menuList: {
    flex: 1,
    justifyContent: 'center',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    marginVertical: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    elevation: 2,
  },
  icon: {
    width: 40,
    height: 40,
    marginRight: 15,
  },
  label: {
    fontSize: 18,
    fontWeight: '500',
  },
  closeButton: {
    backgroundColor: '#ff5c5c',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
