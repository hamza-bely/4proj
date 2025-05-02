import { Modal, View, Text, TouchableOpacity, Image, StyleSheet, FlatList, Alert  } from 'react-native';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { createReport } from '@services/apiService';
import { ReportType, ReportStatus } from '@core/types';
import ReportData from '@interfaces/ReportData';

const data: { id: string; title: string; icon: any; type: ReportType }[] = [
    { id: '1', title: 'Embouteillage', icon: require('@/assets/images/traffic.png'), type: 'TRAFFIC' },
    { id: '2', title: 'Police', icon: require('@/assets/images/police.png'), type: 'POLICE_CHECKS' },
    { id: '3', title: 'Accident', icon: require('@/assets/images/crash.png'), type: 'ACCIDENTS' },
    { id: '4', title: 'Danger', icon: require('@/assets/images/danger.png'), type: 'OBSTACLES' },
    { id: '5', title: 'Route fermée', icon: require('@/assets/images/roads_closed.png'), type: 'ROADS_CLOSED' },
    { id: '6', title: 'Bugs', icon: require('@/assets/images/maperror.png'), type: 'OBSTACLES' },
];

export default function ReportModal({ visible, onClose }: { visible: boolean; onClose: () => void; }) {

    const handleReport = async (reportType: ReportType) => {
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();

            if (status !== 'granted') {
                Alert.alert('Permission refusée', 'La permission de localisation est requise pour faire un report.');
                return;
            }
    
            const location = await Location.getCurrentPositionAsync({});
            const reportData: ReportData = {
                type: reportType,
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                status: 'AVAILABLE',
                address: 'AVAILABLE',
            };
            console.log('Report data:', reportData);
            await createReport(reportData);
            Alert.alert('Succès', 'Votre report a été envoyé.');
            onClose();
        } catch (error) {
            console.error('Erreur lors de la création du report', error);
            Alert.alert('Erreur', 'Impossible de créer le report.');
        }
        
    };

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

                    <FlatList  data={data} keyExtractor={(item) => item.id} numColumns={3} renderItem={
                        ({ item }) => (
                            <TouchableOpacity style={styles.item} onPress={() => handleReport(item.type as ReportType)}>
                                <Image source={item.icon} style={styles.icon} />
                                <Text style={styles.itemText}>{item.title}</Text>
                            </TouchableOpacity>
                        )}contentContainerStyle={styles.list}
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
    list: { alignItems: 'center',justifyContent: 'center',},
    item: { alignItems: 'center', margin: 10, width: 80,paddingTop:20, },
    icon: { width: 75, height: 75, marginBottom: 5 },
    itemText: { textAlign: 'center', fontSize: 12 },
});
