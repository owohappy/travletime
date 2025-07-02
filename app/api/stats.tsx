// Sample stats API endpoints that need backend implementation
import axios from 'axios';
import { getUserData } from '../api';

const API_BASE = 'https://tt.owohappy.com:8080';

// Transport breakdown stats
export const getTransportStats = async () => {
  try {
    const userData = await getUserData();
    const response = await axios.get(`${API_BASE}/stats/transport-breakdown`, {
      params: {
        access_token: userData.access_token,
        userID: userData.id
      }
    });
    
    return response.data || {
      bus: 12.5,
      train: 8.3,
      subway: 5.2,
      tram: 2.1,
      ferry: 0.8
    };
  } catch (error) {
    console.error('Failed to fetch transport stats:', error);
    // Return sample data for now
    return {
      bus: 12.5,
      train: 8.3,
      subway: 5.2,
      tram: 2.1,
      ferry: 0.8
    };
  }
};

// Weekly travel patterns
export const getWeeklyStats = async () => {
  try {
    const userData = await getUserData();
    const response = await axios.get(`${API_BASE}/stats/weekly`, {
      params: {
        access_token: userData.access_token,
        userID: userData.id
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Failed to fetch weekly stats:', error);
    // Sample data
    return [
      { day: 'Mon', hours: 2.5 },
      { day: 'Tue', hours: 3.1 },
      { day: 'Wed', hours: 1.8 },
      { day: 'Thu', hours: 2.9 },
      { day: 'Fri', hours: 3.4 },
      { day: 'Sat', hours: 1.2 },
      { day: 'Sun', hours: 0.8 }
    ];
  }
};

// Travel insights and achievements
export const getTravelInsights = async () => {
  try {
    const userData = await getUserData();
    const response = await axios.get(`${API_BASE}/stats/insights`, {
      params: {
        access_token: userData.access_token,
        userID: userData.id
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Failed to fetch insights:', error);
    return {
      peakTravelDay: 'Friday',
      mostFrequentRoute: 'Central Station to Downtown',
      monthlyGrowth: 15,
      ecoRank: 85,
      streakDays: 12,
      co2Saved: 45.2
    };
  }
};
