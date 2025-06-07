import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';

const LOCATION_TRACKING = 'location-tracking';
const SERVER_URL = 'https://87.106.70.51:8080/position/update';

// Define the background task
TaskManager.defineTask(LOCATION_TRACKING, async ({ data, error }) => {
  if (error) {
    console.error('Location tracking task error:', error);
    return;
  }
  
  if (data) {
    // Check if user is logged in
    const authToken = await AsyncStorage.getItem('authToken');
    if (!authToken) {
      console.log('User not logged in, skipping position update');
      return;
    }
    
    const { locations } = data as { locations: Location.LocationObject[] };
    const location = locations[0];
    
    if (location) {
      try {
        // Send location to your server
        await fetch(SERVER_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`,
          },
          body: JSON.stringify({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            timestamp: new Date().toISOString(),
            userId: await AsyncStorage.getItem('userId'),
          }),
        });
        console.log('Position sent to server successfully');
      } catch (err) {
        console.error('Failed to send location to server:', err);
      }
    }
  }
});

// Start tracking location
export const startLocationTracking = async () => {
  try {
    // Check if user is logged in before requesting permissions
    const authToken = await AsyncStorage.getItem('authToken');
    if (!authToken) {
      console.log('User not logged in, not starting location tracking');
      return false;
    }
    
    // Request permissions
    const { status: foregroundStatus } = await Location.requestForegroundPermissionsAsync();
    if (foregroundStatus !== 'granted') {
      console.log('Foreground location permission denied');
      return false;
    }
    
    const { status: backgroundStatus } = await Location.requestBackgroundPermissionsAsync();
    if (backgroundStatus !== 'granted') {
      console.log('Background location permission denied');
      return false;
    }
    
    // Check if task is already running
    const hasStarted = await Location.hasStartedLocationUpdatesAsync(LOCATION_TRACKING);
    if (hasStarted) {
      console.log('Location tracking is already running');
      return true;
    }
    
    // Start the location tracking
    await Location.startLocationUpdatesAsync(LOCATION_TRACKING, {
      accuracy: Location.Accuracy.Balanced,
      timeInterval: 15 * 60 * 1000, // 15 minutes
      distanceInterval: 100, // minimum distance in meters
      foregroundService: {
        notificationTitle: "TravleTime is tracking your location",
        notificationBody: "This helps calculate your work time accurately",
      },
      // For iOS
      activityType: Location.ActivityType.Other,
      showsBackgroundLocationIndicator: true,
    });
    
    console.log('Location tracking started');
    return true;
  } catch (err) {
    console.error('Error starting location tracking:', err);
    return false;
  }
};

// Stop tracking location
export const stopLocationTracking = async () => {
  try {
    const hasStarted = await Location.hasStartedLocationUpdatesAsync(LOCATION_TRACKING);
    if (hasStarted) {
      await Location.stopLocationUpdatesAsync(LOCATION_TRACKING);
      console.log('Location tracking stopped');
    }
    return true;
  } catch (err) {
    console.error('Error stopping location tracking:', err);
    return false;
  }
};