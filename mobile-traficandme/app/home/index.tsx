import { ScrollView , StyleSheet, useColorScheme, Text, View, TouchableOpacity } from 'react-native';
import React from 'react';
import { FontAwesome } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { HelloWave } from '@/components/HelloWave';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { router } from 'expo-router';
import { BlurView } from 'expo-blur';
import ParallaxScrollView from '@/components/ParallaxScrollView';

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const textColor = colorScheme === 'dark' ? Colors.dark.text : Colors.light.text;

  const navigateToSettings = () => {
    // router.push();
  };

  return (
    <>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <ThemedText type="title">Bienvenue! <HelloWave /></ThemedText>
          <TouchableOpacity onPress={navigateToSettings}>
            <FontAwesome name="gear" size={25} color="white" style={{ marginLeft: 10 }} />
          </TouchableOpacity>
        </View>
        <BlurView intensity={60} style={styles.glassContainer}>
          <Text style={[styles.text]}>Montant verrouillé</Text>
          <FontAwesome5 name="lock" size={24} color="gold" />
        </BlurView>
        <View>
          <Text style={[styles.amount , { color: '#fff' }]}>35.000f</Text>
        </View>
        <View style={[styles.transaccontainer]}>
            <View style={[styles.btnsell]}><Text style={[styles.btntext]} >Vendre</Text></View>
            <View style={[styles.btnbuy]}><Text style={[styles.btntext]}>Acheter</Text></View>
        </View>
      </View>

      <ScrollView>
          <Text style={[styles.titleTransaction, { color: textColor }]}>Transaction</Text>
          <Text style={[styles.ZeroTransac, { color: textColor }]}>Vous n'avez aucune transaction</Text>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 15,
    paddingVertical: 60,
    height: '35%',
    backgroundColor: '#D3AF77',
    borderTopRightRadius: 0,
    borderTopLeftRadius: 0,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  titleContainer: {
    backgroundColor: '#e5e3e300',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  recentText: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
  },
  titleTransaction: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
  },
  ZeroTransac: {
    margin: 'auto',
    fontSize: 19,
    marginTop: 120,
    marginBottom: 120,
  },
  amount:{
    fontFamily:'Lexend',
    fontSize:50,
    fontWeight:'bold',
    textAlign:'center',
  },
  glassContainer:{
    width:'60%',
    backgroundColor:'',
    marginTop:10,
    borderRadius:30,
    paddingVertical:2,
    overflow:'hidden',
    alignSelf:'center',
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center',
    gap:20,
  },
  transaccontainer:{
    flexDirection:'row',
    alignItems:'center',
    width:'100%',
    justifyContent:'center',
    gap:50,
  },
  text:{
    color: '#fff',
    fontSize:17,
    textAlign:'center',
  },
  btntext:{
    color: '#000',
    fontSize:18,
  },
  btnsell:{
    flexDirection:'row',
    padding:5,
    width:130,
    backgroundColor:'#fff',
    borderRadius:30,
    justifyContent:'center',

  },
  btnbuy:{
    flexDirection:'row',
    padding:5,
    width:130,
    backgroundColor:'#fff',
    borderRadius:30,
    justifyContent:'center',
  }
});