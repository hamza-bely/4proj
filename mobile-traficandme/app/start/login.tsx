import React, { useEffect, useState } from 'react';
import { 
    StyleSheet, Text, View, TextInput, TouchableOpacity, Image, Pressable, Appearance, 
    KeyboardAvoidingView, ScrollView, Platform, TouchableWithoutFeedback, Keyboard 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Link, router } from "expo-router";
import { useColorScheme } from 'react-native';
import { supabase } from '@supabase';


export default function Login() {
    const colorScheme = useColorScheme();
    const [isDarkMode, setIsDarkMode] = useState(colorScheme === 'dark');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');


    useEffect(() => {
        const handleAppearanceChange = ({ colorScheme }: { colorScheme: any }) => {
            setIsDarkMode(colorScheme === 'dark');
        };

        const subscription = Appearance.addChangeListener(handleAppearanceChange);

        return () => {
            subscription.remove();
        };
    }, []);

    const toLog = async () => {
        // if (!email || !password) {
        //     alert("Veuillez remplir tous les champs.");
        //     return;
        // }
    
        // const { data, error } = await supabase.auth.signInWithPassword({
        //     email,
        //     password,
        // });
    
        // if (error) {
        //     console.error(error);
        //     alert("Email ou mot de passe incorrect.");
        // } else {
        //     alert("Connexion réussie !");
        //     router.push('/home')
        // }
        router.push('/home')
    };
    
    

    return (
        <KeyboardAvoidingView 
            behavior={Platform.OS === "ios" ? "padding" : "height"} 
            style={{ flex: 1 }}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={[styles.container, isDarkMode ? styles.darkContainer : styles.lightContainer]}>
                    <ScrollView 
                        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }} 
                        keyboardShouldPersistTaps="handled"
                    >
                        <View style={styles.inner}>
                            <View style={styles.logoContainer}>
                                <Image
                                    source={require('@assets/images/logo.png')}
                                    style={styles.image}
                                    resizeMode="cover"
                                />
                                <Text style={[styles.title, isDarkMode ? styles.darkText : styles.lightText]}>
                                    CONNEXION
                                </Text>
                            </View>
                            <View style={styles.inputContainer}>
                                <Text style={[styles.label, isDarkMode ? styles.darkText : styles.lightText]}>Email</Text>
                                <TextInput 
                                    style={[styles.input, isDarkMode ? styles.darkInput : styles.lightInput]} 
                                    placeholder="Email"
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    value={email}
                                    onChangeText={setEmail}
                                />
                                <Text style={[styles.label, isDarkMode ? styles.darkText : styles.lightText]}>Mot de passe</Text>
                                <TextInput 
                                    style={[styles.input, isDarkMode ? styles.darkInput : styles.lightInput]} 
                                    placeholder="Mot de passe" 
                                    secureTextEntry
                                    autoCapitalize="none"
                                    value={password}
                                    onChangeText={setPassword}
                                />
                            </View>
                            <View style={styles.registerContainer}>
                                <Link href="/start/register" asChild>
                                    <Pressable>
                                        <Text style={[styles.registerLinkText, isDarkMode ? styles.darkLink : styles.lightLink]}>
                                            Je ne suis pas encore inscrit
                                        </Text>
                                    </Pressable>
                                </Link>
                            </View>
                            <View style={styles.buttonContainer}>
                                <TouchableOpacity style={styles.socialButton}>
                                    <Ionicons name="logo-google" size={30} color="red" />
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.socialButton}>
                                    <Ionicons name="logo-facebook" size={30} color="blue" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </ScrollView>
                    
                    <View style={styles.footer}>
                        <TouchableOpacity style={styles.buttonLog} onPress={toLog} >
                            <Text style={styles.buttonText}>Se connecter</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    lightContainer: {
        backgroundColor: '#fff',
    },
    darkContainer: {
        backgroundColor: '#000',
    },
    inner: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    image: {
        width: 200,
        height: 200,
    },
    title: {
        fontSize: 30,
        marginTop: 10,
        marginBottom: 10,
        fontWeight: 'bold',
        fontFamily: 'redRoseBold',
    },
    lightText: {
        color: 'black',
    },
    darkText: {
        color: 'white',
    },
    inputContainer: {
        width: '80%',
        marginBottom: 20,
    },
    label: {
        marginBottom: 5,
    },
    input: {
        padding: 12,
        marginBottom: 20,
        borderRadius: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
    lightInput: {
        backgroundColor: 'white',
    },
    darkInput: {
        backgroundColor: '#555',
    },
    registerContainer: {
        width: '80%',
        marginBottom: 20,
        alignItems: 'center',
    },
    registerLinkText: {
        fontSize: 16,
        textDecorationLine: 'underline',
    },
    lightLink: {
        color: '#000',
    },
    darkLink: {
        color: '#fff',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '80%',
        marginBottom: 20,
    },
    socialButton: {
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 25,
        borderWidth: 1,
        borderColor: '#ddd',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
    footer: {
        position: 'absolute',
        bottom: 20,
        width: '100%',
        alignItems: 'center',
    },
    buttonLog: {
        backgroundColor: '#ffbc2e',
        paddingVertical: 12,
        paddingHorizontal: 110,
        marginBottom:10,
        borderRadius: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
    buttonText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
        fontFamily: 'Lexend',
        textAlign: 'center',
    },
});
