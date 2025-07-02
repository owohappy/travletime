import { Button } from '@react-navigation/elements'
import { Stack, useRouter } from 'expo-router'
import React, { useState } from 'react'
import { Dimensions, StyleSheet, Text, View } from 'react-native'
import { TextInput } from 'react-native-gesture-handler'

const screenHeight = Dimensions.get('window').height;

export default function Register() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <View style={styles.container}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <View style={[styles.boxForground, { backgroundColor: '#ffffff' }]}>
        <Text style={styles.welcomeText}>
          Welcome 👋
        </Text>
        
        <Text style={styles.underText}>
          Register at travletime
        </Text>

        <TextInput 
          style={styles.inputField}
          placeholder='E-Mail'
          value={email}
          placeholderTextColor="#000"
          onChangeText={setEmail}
        />

        <TextInput 
          style={styles.inputField}
          placeholder='Password'
          secureTextEntry
          placeholderTextColor="#000"
          value={password}
          onChangeText={setPassword}
        />

        <View style={styles.buttonContainer}>
          <Button
            onPress={() => router.push({ pathname: '/(tabs)/register_2', params: { email, password } })}
          >
            Continue
          </Button>
        </View>
        
        <Text style={styles.registerTextButton} onPress={() => router.push('/(tabs)/login')}> 
          Already got an account?
        </Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  boxForground: {
    color: 'white',
    width: '100%',
    height: screenHeight / 1.3,
    zIndex: 0,
    bottom: 0,
    position: 'absolute',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
  },
  container: {
    flex: 1, 
    flexDirection: 'column',
    color: 'white',
    backgroundColor: '#38828f',
    justifyContent: 'flex-start'
  },
  welcomeText: {
    color: 'black',
    alignSelf: 'center',
    paddingTop: screenHeight / 7,
    fontSize: 24,
    fontWeight: '900'
  },
  underText: {
    color: 'black',
    alignSelf: 'center',
    fontSize: 12,
    fontWeight: '200',
    marginBottom: 40
  },
  inputField: {
    height: 50,
    marginHorizontal: 30,
    marginVertical: 10,
    borderWidth: 1, 
    borderColor: 'dimgray',
    color: 'black',
    padding: 12,
    borderRadius: 12
  },
  buttonContainer: {
    alignSelf: 'center',
    marginTop: 20,
  },
  registerTextButton: {
    color: 'black',
    alignSelf: 'center',
    marginTop: 18,
    fontWeight: '900'
  }
})
