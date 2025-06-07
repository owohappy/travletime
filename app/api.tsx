// api.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { router } from 'expo-router';
import { getItemAsync, setItemAsync } from 'expo-secure-store'; // Changed import
import { Platform } from 'react-native';

const API = axios.create({
  baseURL: 'https://tt.owohappy.com:8080/',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});


// API Functions
export const login = async (data: {email: string; password: string}) => {
  console.log('Login attempt with data:', data.email);
  const response = await API.post(`/login`, data=data) 
    .then(async (axiosResponse) => {
      const responseJson = axiosResponse.data.access_token;
      console.log('Login response status from server:', axiosResponse.statusText);
      if (axiosResponse.status === 200 || axiosResponse.statusText === 'OK') {
        const { access_token, token_type, userID } = axiosResponse.data;
        console.log('Login successful, token received:', access_token);
        if (Platform.OS === 'web') {
          await AsyncStorage.setItem('userToken', access_token);
          await AsyncStorage.setItem('userID', userID);
    
        } else {
        console.log(axiosResponse.statusText)
        await setItemAsync('userToken', JSON.stringify(access_token));
        await setItemAsync('userID', JSON.stringify(userID)); 
        console.log('Token saved to SecureStore:', access_token);
        console.log('UserID (integer) saved to SecureStore:', userID);
    }
        return access_token;
      } else {
        console.error('Login failed with message from server:', axiosResponse.data);
        throw new Error(axiosResponse.data);
      }
    })
    .catch(error => {
      console.error('Login API call failed:', error.message);
      if (error.response) {
        console.error('Login API error response data:', error.response.data);
      }
      throw error; 
    });
  return response; 
};

export const logout = async () => {
  console.log('Logging out...');
  try {
    if (Platform.OS === 'web') {
      await AsyncStorage.removeItem('userToken');
    } else {
      await setItemAsync('userToken', ''); // Clear the token
    }
    console.log('Token removed successfully.');
  } catch (error) {
    console.error('Error during logout:', error);
  }
};

export const register = async (data: {email: string; password: string; name: string; phonenumber: string; address: string}) => {
  console.log('Registering user with data:', data.email);
  const response = await API.post(`/register`, data=data) 
    .then(async (axiosResponse) => {
      
      console.log('Register response status from server:', axiosResponse.status);
      if (axiosResponse.status === 201 || axiosResponse.statusText === 'Created') {
        const { access_token, token_type, userID } = axiosResponse.data;
        console.log('Register successful, token received:', access_token);
        if (Platform.OS === 'web') {
          await AsyncStorage.setItem('userToken', access_token);
          await AsyncStorage.setItem('userID', userID);
    
        } else {
        await setItemAsync('userToken', JSON.stringify(access_token));
        await setItemAsync('userID', JSON.stringify(userID)); 
        console.log('Token saved to SecureStore:', access_token);
    }      
    router.push('/(tabs)/dashboard');
    } else {
        console.error('Register failed with message from server:', axiosResponse.data);
        throw new Error(axiosResponse.data);
      }
    })
    .catch(error => {
      console.error('Register API call failed:', error.message);
      if (error.response) {
        console.error('Register API error response data:', error.response.data);
      }
      throw error; 
    });
  return response; 
};

export const getUserData = async () => {
  console.log('Fetching user name...');
  let token;
  let userID;
  try {
    if (Platform.OS === 'web') {
      token = await AsyncStorage.getItem('userToken');
      userID = await AsyncStorage.getItem('userID');
    } else {
      token = await getItemAsync('userToken');
      const userIDString = await getItemAsync('userID');
      userID = userIDString ? JSON.parse(userIDString) : null;
    }
    console.log('Token and userID retrieved:', token, userID);
    if (!token) {
      console.log('No token found.');
      return null; 
    }
    console.log('Token found, proceeding to fetch user name:', token);

    const response = await API.get(`/user/${userID}/getData`, {
  params: {
    access_token: token,
    userID: userID,
  },
});
    console.log('Get name API response status:', response.status);
    console.log('Get name API response data:', response.data);

    if (response.status === 200) {
      return response.data; 
    } else {
      console.error('Get name failed with status:', response.status);
      return null; // Return null if fetching name fails
    }
  } catch (error: any) {
    console.error('Error during fetching user name:', error.message);
    if (error.response) {
      console.error('Get name API error response status:', error.response.status);
      console.error('Get name API error response data:', error.response.data);
    }
    return null; // Return null in case of an error
  }
}

export const checkToken = async (): Promise<boolean> => {
  console.log('Checking token...');
  let token;
  let userid;
  try {
    if (Platform.OS === 'web') {
      token = await AsyncStorage.getItem('userToken');
      userid = await AsyncStorage.getItem('userID');
    } else {
      token = await getItemAsync('userToken');
      userid = await getItemAsync('userID');
    }

    if (!token) {
      console.log('No token found.');
      return false; // Return false if no token is found
    }
    console.log('Token found, proceeding to check with API:', token);

    // Note: The error "loc": ["query", "access_token"] indicates the backend
    // expects access_token as a query parameter, even for a POST request.
    const response = await API.post(
      `/check-token`,
      {}, // Sending null or an empty object as the body
      {
        params: {
          access_token: token,
          userID: userid // Sending access_token as a query parameter
        }
      }
    );

    console.log('Check token API response status:', response.status);
    console.log('Check token API response data:', response.data);

    if (response.status === 200) {
      console.log('Token is valid.');
      return true;
    } else {
      console.error('Token check failed with status:', response.status);
      return false; // Return false if token check fails (e.g., non-200 response)
    }
  } catch (error: any) {
    console.error('Error during token check:', error.message);
    if (error.response) {
      console.error('Token check API error response status:', error.response.status);
      console.error('Token check API error response data:', error.response.data);
    }
    // If the error is due to a 405 status or any other API call failure,
    // or any other exception during the process, return false.
    return false;
  }
};
