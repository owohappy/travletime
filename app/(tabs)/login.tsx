import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Dimensions, Pressable, StyleSheet, Text, TextInput, View } from 'react-native'; // Updated imports
import { login as apiLogin } from '../api';

const screenHeight = Dimensions.get('window').height;

export default function Login() { // Changed to PascalCase
  const router = useRouter(); // Moved router hook inside component
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Validation Error', 'Please enter both email and password.');
      return;
    }
    try {
      // Assuming apiLogin stores the token internally using SecureStore
      // and throws an error if login fails.
      await apiLogin({ email, password });
      // If apiLogin completes without an error, navigate to the dashboard.
      router.push('/(tabs)/dashboard');
    } catch (error: any) {
      Alert.alert('Login Failed', error.message || 'An unexpected error occurred. Please try again.');
    }
  };

  return (
    <View style={style.container}>
      <View style={[style.boxForground, { backgroundColor: '#ffffff' }]}>
        <Text style={style.welcomeText}>Welcome back 👋</Text>
        <Text style={style.underText}>Login with your traveltime account</Text>

        <TextInput
          style={style.email}
          placeholder="E-Mail"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />

        <TextInput
          style={style.password}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
          autoCorrect={false}
        />

        <Pressable style={style.loginButton} onPress={handleLogin}>
          <Text style={style.loginButtonText}>Login</Text>
        </Pressable>
        
        <Text style={style.registerTextButton} onPress={() => router.push('/(tabs)/register')}>
          Register now!
        </Text>
      </View>
    </View>
  );
}

const style = StyleSheet.create({
  boxForground: {
    width: '100%',
    height: screenHeight / 1.3,
    zIndex: 0,
    bottom: 0,
    position: 'absolute',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    alignItems: 'center', // Center children
    paddingTop: screenHeight / 15, // Adjust padding for content
  },
  container: {
    flex: 1,
    backgroundColor: '#38828f',
  },
  welcomeText: {
    color: 'black',
    fontSize: 24,
    fontWeight: '900',
    marginBottom: 8,
  },
  underText: {
    color: 'black',
    fontSize: 12,
    fontWeight: '200',
    marginBottom: screenHeight / 15, // Increased margin
  },
  email: {
    height: 45, // Slightly increased height
    width: '85%', // Increased width
    marginBottom: 20, // Increased margin
    borderWidth: 1,
    color: 'black',
    paddingHorizontal: 15, // Increased padding
    borderRadius: 12,
  },
  password: {
    height: 45, // Slightly increased height
    width: '85%', // Increased width
    marginBottom: 30, // Increased margin
    borderWidth: 1,
    color: 'black',
    paddingHorizontal: 15, // Increased padding
    borderRadius: 12,
  },
  loginButton: {
    backgroundColor: '#38828f', // Example button color
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 12,
    width: '85%',
    alignItems: 'center', // Center text inside button
    marginBottom: 18,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  registerTextButton: {
    color: 'black',
    marginTop: 18, // Keep or adjust as needed
    fontWeight: '900',
  },
});