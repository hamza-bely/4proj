import { Modal, View, Text, TouchableOpacity, Image, StyleSheet, FlatList } from 'react-native';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';

const data = [
    { id: '1', title: 'Embouteillage', icon: require('@/assets/images/traffic.png') },
    { id: '2', title: 'Police', icon: require('@/assets/images/police.png') },
    { id: '3', title: 'Accident', icon: require('@/assets/images/crash.png') },
    { id: '4', title: 'Danger', icon: require('@/assets/images/danger.png') },
    { id: '5', title: 'Route fermée', icon: require('@/assets/images/roads_closed.png') },
    { id: '6', title: 'Bugs', icon: require('@/assets/images/maperror.png') },
    { id: '7', title: 'Météo', icon: require('@/assets/images/weather.png') },
    { id: '8', title: 'Station', icon: require('@/assets/images/fuel.png') },
    { id: '8', title: 'Voie bloquée', icon: require('@/assets/images/cone.png') },
];

export default function ReportModal({ visible, onClose }: { visible: boolean; onClose: () => void; }) {
    return (
        <Modal visible={visible} transparent animationType="slide">
        <View style={styles.overlay}>
            <View style={styles.modal}>

            <View style={styles.dragger} />

            <View style={styles.topStyles}>
            <Text style={styles.title}>Que voyez-vous ?</Text>
                <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                    <Ionicons name="close" size={24} color="black" />
                </TouchableOpacity>
            </View>


            <FlatList
                data={data}
                keyExtractor={(item) => item.id}
                numColumns={3}
                renderItem={({ item }) => (
                <TouchableOpacity style={styles.item}>
                    <Image source={item.icon} style={styles.icon} />
                    <Text style={styles.itemText}>{item.title}</Text>
                </TouchableOpacity>
                )}
                contentContainerStyle={styles.list}
            />
            </View>
        </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: { flex: 1, justifyContent: 'flex-end' },
    modal: {
        backgroundColor: 'white',
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 40,
        minHeight: '50%',
    },
    dragger: {
        width: 40,
        height: 5,
        backgroundColor: '#ccc',
        borderRadius: 3,
        alignSelf: 'center',
        marginBottom: 10,
    },
    topStyles: {flexDirection: 'row',justifyContent: 'space-between', alignItems: 'center', marginBottom: 30,},
    closeButton: {},
    title: { textAlign: 'center', fontSize: 22, fontWeight: 'bold',},
    list: { alignItems: 'center' },
    item: { alignItems: 'center', margin: 10, width: 80 },
    icon: { width: 60, height: 60, marginBottom: 5 },
    itemText: { textAlign: 'center', fontSize: 12 },
});
