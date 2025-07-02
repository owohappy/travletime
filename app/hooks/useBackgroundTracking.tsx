import { useEffect } from 'react';
import { getUserData } from '../api';
import { startLocationTracking, stopLocationTracking } from '../services/LocationService';

export const useBackgroundTracking = () => {
  useEffect(() => {
    const initializeTracking = async () => {
      try {
        const userData = await getUserData();
        if (userData) {
          await startLocationTracking();
          console.log('Background location tracking initialized');
        }
      } catch (error) {
        console.error('Failed to initialize background tracking:', error);
      }
    };

    initializeTracking();

    // Cleanup on unmount
    return () => {
      stopLocationTracking();
    };
  }, []);
};
