import { useEffect } from "react";
import { View, Text, StyleSheet, ImageBackground, ActivityIndicator, Image } from 'react-native';
import { useRouter } from 'expo-router';
import asyncStorage from '@services/localStorage';

export default function IndexScreen() {

    const router = useRouter();
    const { getToken } = asyncStorage();

    useEffect(() => {
        const checkSession = async () => {
            const token = await getToken();
            if (token) {
                router.replace('/home');
            } else {
                router.replace('/start'); 
            }
        };

        checkSession();
    }, []);

    return (
        <ImageBackground
            source={require('@/assets/images/start.png')}
            style={styles.background}
            resizeMode="cover">

            <View style={styles.overlay}>
                <View style={styles.content}>
                    <Image
                        source={require('@/assets/images/logo.png')}
                        style={styles.image}
                        resizeMode="cover"
                    />
                    <Text style={styles.caption}>Traffic&me</Text>
                </View>
                <ActivityIndicator 
                    size="large"
                    color="#ffbc2e"
                    style={styles.loading}
                />
            </View>
            
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: 200,
        height: 200,  
    },
    caption: {
        textAlign: 'center',
        fontSize: 26,
        color: '#ffbc2e',
        fontFamily: 'Lexend',
        fontWeight:'bold',
    },
    loading: {
        position: 'absolute',
        bottom: 50,
        paddingVertical: 12,
        paddingHorizontal: 110,
    },
    buttonText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
        fontFamily: 'Lexend',
    },
    textLogin: {
        bottom: 40,
        fontSize: 14,
        color: 'white',
    },
    spanTitle:{
        fontFamily:'redRoseBold',
        color:'#D3AF77'
    }
});