import { Button } from '@react-navigation/elements';
import { useRouter } from 'expo-router';
import React from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { checkToken } from '../api';

const screenHeight = Dimensions.get('window').height;
export default function Index() {
  const router = useRouter();
  
  React.useEffect(() => {
    const verifyToken = async () => {
      const tokenValid = await checkToken();
      if (tokenValid === true) {
        router.push('/(tabs)/dashboard');
      }
    };
    verifyToken();
  }, [router]);
  return (
    <View style={style.container}>
      <View style={style.boxForground}> 
        <Text style={style.welcomeText}>Don&apos;t waste time</Text>
        <Text style={style.bottomText}>Earn points whilest being on any means of public transport </Text>
        <Button style={style.continueButton} onPress={() => router.push('/(tabs)/register')}>
          Continue
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
    backgroundColor: '#38828f',
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
    alignSelf: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 16,
    left: '-50%',
    fontSize: 48,
    color: 'black'
  }
}
)