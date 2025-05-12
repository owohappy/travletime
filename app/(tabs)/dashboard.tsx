import { AntDesign } from '@expo/vector-icons'; // Expo-compatible icons
import { Button } from '@react-navigation/elements';
import { useRouter } from 'expo-router';
import React, { StrictMode } from 'react';
import { Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;
const router = useRouter();


// VARIABLES TO CHANGE FOR API
const username = "Lucas Röder"
const pointsAmount = 1820
const profileImage = "https://avatars.slack-edge.com/2025-05-11/8880680481714_f223ba614da331ba68cc_192.png"



export default function dashboard() {
  return (
    <StrictMode>
    <View style={style.container}>
      <AntDesign style={style.burgerMenu} name="menu-fold" size={24} color="white" />
      <View style={style.imageProfile}>
        <Image style={style.image} source={{
          uri: profileImage,
        }}
        ></Image>
      
      </View>
      <Text style={style.name}>{username}</Text>
      <Text style={style.pointsText}>Total Points</Text>
      <Text style={style.points}>{pointsAmount} pts.</Text>
      <Text style={style.featuredText}>Explore</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={style.scrollContainer}
      >
        <TouchableOpacity onPress={() => router.push('/(tabs)/giftcards')}>       
        <View style={[style.card, { backgroundColor: '#D4D4F7' }]}>
          <View style={[style.cardLable, {backgroundColor: '#4e4e91',}]}>
            <Text style={style.cardLableText}>Giftcards</Text>
          </View>
        </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/(tabs)/tickets')}>       
        <View style={[style.card, { backgroundColor: '#FFD6D6' }]}>
        <View style={[style.cardLable, {backgroundColor: '#945050',}]}>
            <Text style={style.cardLableText}>Tickets</Text>
          </View>
        </View>
        </TouchableOpacity>
      </ScrollView>


      <Button style={style.trackButton} ></Button>
  
  
    </View>
    </StrictMode>
  )
}

const style = StyleSheet.create({
  container: {
    flex: 1, 
    flexDirection: 'column',
    color: 'white',
    backgroundColor: '#121212',
    justifyContent: 'flex-start'
  },
burgerMenu: {
  position: 'absolute',
  marginTop: screenHeight / 11.6,
  marginLeft: screenWidth / 12,
  width:48,
  height:48,
  
},
bell:
{
  position: 'absolute',
  marginTop: screenHeight / 12,
  marginLeft: screenWidth / 1.15,
  width:56,
  height:56
},
imageProfile: {
  position: 'absolute',
  bottom: screenHeight / 1.45,
  alignSelf: 'center',
  height: 170,
  width: 170,
  borderRadius: 85, // Should be half of width/height
  borderColor: '#8c8c8c',
  borderWidth: 2,
  backgroundColor: '#8c8c8c',
  overflow: 'hidden', // Important: clip image to circle
  zIndex: 14,
},
image: {
  height: '100%',
  width: '100%',
  resizeMode: 'cover',
},
name: {
  position: 'absolute',
  bottom: screenHeight / 1.6,
  alignSelf: 'center',
  color: 'white',
  fontSize: 38,
  fontWeight: '900'
},
pointsText: {
  position: 'absolute',
  bottom: screenHeight / 1.73,
  alignSelf: 'center',
  color: 'gray',
  fontSize: 20,
  fontWeight: '500'
},
points: {
  position: 'absolute',
  bottom: screenHeight / 1.88,
  alignSelf: 'center',
  color: 'white',
  fontSize: 38,
  fontWeight: '900'
},
featuredText: {
  position: 'absolute',
  bottom: screenHeight / 2.1,
  alignSelf: 'auto',
  left: 30,
  color: 'white',
  fontSize: 22,
  fontWeight: '900'
},
scrollContainer: {
  left: 20,
  top: screenHeight / 1.85,
  height: screenHeight / 2.3 - screenHeight / 9 - 20
},
card: {
  borderRadius: 24,
  margin: 4,
  marginRight: 15,
  width: 200,
  height: 250
},
cardLable:{
  alignItems: 'center',
  justifyContent: "center",
  left: 10,
  top: 10,
  borderRadius:25,
  width: 90,
  height: 40,
   
}, 
trackButton: {
  width: 36 * 2,
  height: 48 * 1.5,
  borderTopRightRadius:18,
  borderTopLeftRadius:18,
  borderBottomLeftRadius:18,
  borderBottomRightRadius:18,
  position: 'absolute',
  alignSelf: 'center',
  bottom: 45,
  fontSize: 48
},
cardLableText: {
  alignSelf: 'center',
  justifyContent: "center",
  fontSize: 13,
  fontWeight: '900',
  color: 'white'
}

})