import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, useColorScheme } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function Menu() {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const backgroundColor = colorScheme === 'dark' ? '#222' : '#fff';
  const isDark = colorScheme === 'dark';
  const textColor = isDark ? '#fff' : '#000';
  const menuItems = [
    { label: 'Partager un trajet', icon: require('@assets/images/erreur-96.png'), action: () => alert('Partager un trajet') },
    { label: 'Paramètres', icon: require('@assets/images/erreur-96.png'), action: () => alert('Paramètres') },
    { label: 'Historique', icon: require('@assets/images/erreur-96.png'), action: () => alert('Historique') },
    { label: 'Aide', icon: require('@assets/images/erreur-96.png'), action: () => alert('Aide') },
  ];

  return (
    <View style={[styles.container, { backgroundColor }]}>

      <View style={styles.topElement}>
        <Text style={[styles.title, { color:textColor }]}>Menu</Text>
        <TouchableOpacity style={styles.closeButton} onPress={() => navigation.goBack()}>
          <Image source={require('@assets/images/close.png')} style={styles.closeButtonIcon} />
        </TouchableOpacity>
      </View>

      <View style={styles.menuList}>
        {menuItems.map((item, index) => (
          <TouchableOpacity key={index} style={styles.menuItem} onPress={item.action}>
            <Image source={item.icon} style={styles.icon} />
            <Text style={styles.label}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
    flex: 1,
    justifyContent: 'space-between',
  },
  topElement: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  menuList: {
    flex: 1,
    justifyContent: 'center',
  },
  menuItem: {
    width: '100%',
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

    padding: 15,
    borderRadius: 100,
    alignItems: 'center',

  },
  closeButtonIcon: {
    width: 28,
    height: 28,
    tintColor: 'red',
  },
});
