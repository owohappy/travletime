import { Button } from '@react-navigation/elements';
import { useRouter } from 'expo-router';
import React from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';

const screenHeight = Dimensions.get('window').height;
const router = useRouter();


export default function index() {
  return (
    <View style={style.container}>
      <View style={style.boxForground}> 
        <Text style={style.welcomeText}>Don't waste time</Text>
        <Text style={style.bottomText}>Earn points whilest being on any means of public transport </Text>
        <Button style={style.continueButton} onPress={() => router.push('/(tabs)/register')}> 
         a
        </Button>
      </View>

    </View>
  )
}


const style = StyleSheet.create({
  boxForground:{
    color: 'white',
    width: '100%',
    height: screenHeight / 2.3,
    zIndex: 0,
    bottom: 0,
    position: 'absolute',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor:  '#ffffff'
  },
  container: {
    flex: 1, 
    flexDirection: 'column',
    color: 'white',
    backgroundColor: '#121212',
    justifyContent: 'flex-start'
  },
  welcomeText:
  {
    color: 'black',
    alignSelf: 'auto',
    paddingTop: screenHeight / 14,
    marginRight: 28,
    marginLeft: 28,
    fontSize: 28,
    fontWeight: '900'
    
  },
  bottomText:
  {
    marginLeft: 28,
    marginRight: 28,
    color: 'gray',
    alignSelf: 'auto',
    fontSize: 14,
    fontWeight: '600'
    
  },
  continueButton: {
    width: 36 * 2,
    height: 48 * 1.5,
    borderTopRightRadius:18,
    borderTopLeftRadius:18,
    borderBottomLeftRadius:18,
    borderBottomRightRadius:18,
    position: 'absolute',
    alignSelf: 'center',
    top: screenHeight / 4,
    fontSize: 48
  },
  arrowButton: {
    fontSize: 120
  }
}
)