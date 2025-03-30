import { useState } from "react";
import { View, Text, StyleSheet, ImageBackground,Pressable } from 'react-native';
import { supabase } from "@core/services/supabase";
import { useRouter, Link } from "expo-router";

export default function StartScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");



  return (
    <ImageBackground
    source={require('@/assets/images/start.png')}
    style={styles.background}
    resizeMode="cover"
  >
    <View style={styles.overlay}>
      <View style={styles.content}>
        <Text style={styles.title}>Concluez vos <Text style={styles.spanTitle}>Deals</Text> sans aucun risque de perte.   </Text>
      </View>
      <Link href="/" asChild style={styles.button}>
        <Pressable><Text style={styles.buttonText}>Commencer</Text></Pressable>
      </Link>
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
  title: {
    position:'absolute',
    top:95,
    textAlign:'left',
    paddingRight:20,
    marginRight:30,
    fontWeight:'bold',
    fontSize: 40,
    color: 'white',
    fontFamily: 'LexendBold',
  },
  button: {
    position: 'absolute',
    bottom: 50,
    backgroundColor: '#D3AF77',
    paddingVertical: 12,
    paddingHorizontal: 110,
    borderRadius: 15,
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