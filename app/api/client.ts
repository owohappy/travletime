/**
 * API Client
 * Comprehensive API client with all endpoints and proper error handling
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { router } from 'expo-router';
import { getItemAsync, setItemAsync } from 'expo-secure-store';
import { Platform } from 'react-native';
import { API_BASE_URL, API_CONFIG, API_ENDPOINTS } from '../config/api';

// Types
export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  phonenumber: string;
  address: string;
}

export interface LocationPing {
  latitude: number;
  longitude: number;
  accuracy?: number;
  altitude?: number;
  speed?: number;
  bearing?: number;
  timestamp: string;
}

export interface UserProfile {
  userID: string;
  email: string;
  name: string;
  phonenumber: string;
  address: string;
  points: number;
  pfp_url?: string;
  created_at: string;
  email_verified: boolean;
  email_verified_at?: string;
  mfa: boolean;
}

export interface TravelSession {
  sessionId: string;
  startTime: string;
  endTime?: string;
  distance: number;
  duration: number;
  transportType: string;
  route?: string;
  points: number;
}

export interface LeaderboardEntry {
  userID: string;
  name: string;
  points: number;
  rank: number;
  pfp_url?: string;
}

// API Client Class
class ApiClient {
  private api: AxiosInstance;
  private retryCount = 0;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      timeout: API_CONFIG.TIMEOUT,
      headers: API_CONFIG.DEFAULT_HEADERS,
    });

    // Add request interceptor for authentication
    this.api.interceptors.request.use(
      async (config) => {
        const token = await this.getStoredToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Add response interceptor for error handling
    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          await this.handleTokenExpiration();
        }
        return Promise.reject(error);
      }
    );
  }

  // Token Management
  private async getStoredToken(): Promise<string | null> {
    try {
      if (Platform.OS === 'web') {
        return await AsyncStorage.getItem('userToken');
      } else {
        const token = await getItemAsync('userToken');
        return token ? JSON.parse(token) : null;
      }
    } catch (error) {
      console.error('Error retrieving token:', error);
      return null;
    }
  }

  private async getStoredUserId(): Promise<string | null> {
    try {
      if (Platform.OS === 'web') {
        return await AsyncStorage.getItem('userID');
      } else {
        const userId = await getItemAsync('userID');
        return userId ? JSON.parse(userId) : null;
      }
    } catch (error) {
      console.error('Error retrieving user ID:', error);
      return null;
    }
  }

  private async storeToken(token: string): Promise<void> {
    try {
      if (Platform.OS === 'web') {
        await AsyncStorage.setItem('userToken', token);
      } else {
        await setItemAsync('userToken', JSON.stringify(token));
      }
    } catch (error) {
      console.error('Error storing token:', error);
    }
  }

  private async storeUserId(userId: string): Promise<void> {
    try {
      if (Platform.OS === 'web') {
        await AsyncStorage.setItem('userID', userId);
      } else {
        await setItemAsync('userID', JSON.stringify(userId));
      }
    } catch (error) {
      console.error('Error storing user ID:', error);
    }
  }

  private async clearStorage(): Promise<void> {
    try {
      if (Platform.OS === 'web') {
        await AsyncStorage.removeItem('userToken');
        await AsyncStorage.removeItem('userID');
      } else {
        await setItemAsync('userToken', '');
        await setItemAsync('userID', '');
      }
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  }

  private async handleTokenExpiration(): Promise<void> {
    console.log('Token expired, clearing storage and redirecting to login');
    await this.clearStorage();
    router.push('/(tabs)/login');
  }

  // Authentication APIs
  async login(data: LoginData): Promise<string> {
    try {
      const response = await this.api.post(API_ENDPOINTS.AUTH.LOGIN, data);
      
      if (response.status === 200) {
        const { access_token, userID } = response.data;
        await this.storeToken(access_token);
        await this.storeUserId(userID);
        return access_token;
      }
      
      throw new Error('Login failed');
    } catch (error: any) {
      console.error('Login error:', error.response?.data || error.message);
      throw error;
    }
  }

  async register(data: RegisterData): Promise<string> {
    try {
      const response = await this.api.post(API_ENDPOINTS.AUTH.REGISTER, data);
      
      if (response.status === 201) {
        const { access_token, userID } = response.data;
        await this.storeToken(access_token);
        await this.storeUserId(userID);
        return access_token;
      }
      
      throw new Error('Registration failed');
    } catch (error: any) {
      console.error('Registration error:', error.response?.data || error.message);
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      await this.api.post(API_ENDPOINTS.AUTH.LOGOUT);
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      await this.clearStorage();
    }
  }

  async refreshToken(): Promise<string> {
    try {
      const response = await this.api.post(API_ENDPOINTS.AUTH.REFRESH_TOKEN);
      const { access_token } = response.data;
      await this.storeToken(access_token);
      return access_token;
    } catch (error: any) {
      console.error('Token refresh error:', error.response?.data || error.message);
      throw error;
    }
  }

  async checkToken(): Promise<boolean> {
    try {
      const token = await this.getStoredToken();
      const userId = await this.getStoredUserId();
      
      if (!token || !userId) {
        return false;
      }

      const response = await this.api.post(
        API_ENDPOINTS.AUTH.CHECK_TOKEN,
        {},
        {
          params: {
            access_token: token,
            userID: userId,
          },
        }
      );

      return response.status === 200;
    } catch (error) {
      console.error('Token check error:', error);
      return false;
    }
  }

  // Password Reset APIs
  async initiatePasswordReset(email: string): Promise<void> {
    try {
      await this.api.post(API_ENDPOINTS.PASSWORD_RESET.INITIATE, { email });
    } catch (error: any) {
      console.error('Password reset initiation error:', error.response?.data || error.message);
      throw error;
    }
  }

  async confirmPasswordReset(token: string, newPassword: string): Promise<void> {
    try {
      await this.api.post(API_ENDPOINTS.PASSWORD_RESET.CONFIRM, {
        token,
        new_password: newPassword,
      });
    } catch (error: any) {
      console.error('Password reset confirmation error:', error.response?.data || error.message);
      throw error;
    }
  }

  // Email Verification API
  async verifyEmail(token: string): Promise<void> {
    try {
      await this.api.get(`${API_ENDPOINTS.EMAIL_VERIFICATION}/${token}`);
    } catch (error: any) {
      console.error('Email verification error:', error.response?.data || error.message);
      throw error;
    }
  }

  // Two-Factor Authentication APIs
  async enable2FA(): Promise<{ qr_code: string; secret: string }> {
    try {
      const response = await this.api.post(API_ENDPOINTS.TWO_FA.ENABLE);
      return response.data;
    } catch (error: any) {
      console.error('2FA enable error:', error.response?.data || error.message);
      throw error;
    }
  }

  async verify2FA(code: string): Promise<string> {
    try {
      const response = await this.api.post(API_ENDPOINTS.TWO_FA.VERIFY, { code });
      const { access_token } = response.data;
      await this.storeToken(access_token);
      return access_token;
    } catch (error: any) {
      console.error('2FA verification error:', error.response?.data || error.message);
      throw error;
    }
  }

  // User Profile APIs
  async getUserProfile(userId?: string): Promise<UserProfile> {
    try {
      const id = userId || await this.getStoredUserId();
      if (!id) throw new Error('User ID not found');
      
      const response = await this.api.get(API_ENDPOINTS.USER.GET_PROFILE(id));
      return response.data;
    } catch (error: any) {
      console.error('Get user profile error:', error.response?.data || error.message);
      throw error;
    }
  }

  async updateUserProfile(field: string, data: any, userId?: string): Promise<void> {
    try {
      const id = userId || await this.getStoredUserId();
      if (!id) throw new Error('User ID not found');
      
      await this.api.post(API_ENDPOINTS.USER.UPDATE_PROFILE(id), null, {
        headers: {
          field,
          data: JSON.stringify(data),
        },
      });
    } catch (error: any) {
      console.error('Update user profile error:', error.response?.data || error.message);
      throw error;
    }
  }

  async getUserPoints(userId?: string): Promise<{ points: number }> {
    try {
      const id = userId || await this.getStoredUserId();
      if (!id) throw new Error('User ID not found');
      
      const response = await this.api.get(API_ENDPOINTS.USER.GET_POINTS(id));
      return response.data;
    } catch (error: any) {
      console.error('Get user points error:', error.response?.data || error.message);
      throw error;
    }
  }

  // Travel Tracking APIs
  async trackLocation(locationData: LocationPing, userId?: string): Promise<any> {
    try {
      const id = userId || await this.getStoredUserId();
      if (!id) throw new Error('User ID not found');
      
      const response = await this.api.post(
        API_ENDPOINTS.TRAVEL.GPS_TRACK(id),
        locationData
      );
      return response.data;
    } catch (error: any) {
      console.error('Location tracking error:', error.response?.data || error.message);
      throw error;
    }
  }

  async getTrackingStatus(userId?: string): Promise<any> {
    try {
      const id = userId || await this.getStoredUserId();
      if (!id) throw new Error('User ID not found');
      
      const response = await this.api.get(API_ENDPOINTS.TRAVEL.GPS_STATUS(id));
      return response.data;
    } catch (error: any) {
      console.error('Get tracking status error:', error.response?.data || error.message);
      throw error;
    }
  }

  async getNearbyRoutes(
    latitude: number,
    longitude: number,
    radius: number = 1000
  ): Promise<any> {
    try {
      const response = await this.api.get(API_ENDPOINTS.TRAVEL.NEARBY_ROUTES, {
        params: { latitude, longitude, radius },
      });
      return response.data;
    } catch (error: any) {
      console.error('Get nearby routes error:', error.response?.data || error.message);
      throw error;
    }
  }

  async confirmTravel(travelId: string, userId?: string): Promise<void> {
    try {
      const id = userId || await this.getStoredUserId();
      if (!id) throw new Error('User ID not found');
      
      await this.api.post(API_ENDPOINTS.USER.CONFIRM_TRAVEL(id, travelId));
    } catch (error: any) {
      console.error('Confirm travel error:', error.response?.data || error.message);
      throw error;
    }
  }

  // Statistics APIs
  async getLeaderboard(): Promise<LeaderboardEntry[]> {
    try {
      const response = await this.api.get(API_ENDPOINTS.STATS.LEADERBOARD);
      return response.data;
    } catch (error: any) {
      console.error('Get leaderboard error:', error.response?.data || error.message);
      throw error;
    }
  }

  async getUsersCount(): Promise<{ count: number }> {
    try {
      const response = await this.api.get(API_ENDPOINTS.STATS.USERS_COUNT);
      return response.data;
    } catch (error: any) {
      console.error('Get users count error:', error.response?.data || error.message);
      throw error;
    }
  }

  async getTotalPoints(): Promise<{ total: number }> {
    try {
      const response = await this.api.get(API_ENDPOINTS.STATS.POINTS_TOTAL);
      return response.data;
    } catch (error: any) {
      console.error('Get total points error:', error.response?.data || error.message);
      throw error;
    }
  }

  // Analytics APIs
  async getPopularRoutes(limit: number = 10): Promise<any> {
    try {
      const response = await this.api.get(API_ENDPOINTS.ANALYTICS.POPULAR_ROUTES, {
        params: { limit },
      });
      return response.data;
    } catch (error: any) {
      console.error('Get popular routes error:', error.response?.data || error.message);
      throw error;
    }
  }

  async getOperatorStats(): Promise<any> {
    try {
      const response = await this.api.get(API_ENDPOINTS.ANALYTICS.OPERATOR_STATS);
      return response.data;
    } catch (error: any) {
      console.error('Get operator stats error:', error.response?.data || error.message);
      throw error;
    }
  }

  async getTransportPatterns(): Promise<any> {
    try {
      const response = await this.api.get(API_ENDPOINTS.ANALYTICS.TRANSPORT_PATTERNS);
      return response.data;
    } catch (error: any) {
      console.error('Get transport patterns error:', error.response?.data || error.message);
      throw error;
    }
  }

  async getUserTravelInsights(userId?: string): Promise<any> {
    try {
      const id = userId || await this.getStoredUserId();
      if (!id) throw new Error('User ID not found');
      
      const response = await this.api.get(API_ENDPOINTS.ANALYTICS.USER_TRAVEL_INSIGHTS(id));
      return response.data;
    } catch (error: any) {
      console.error('Get user travel insights error:', error.response?.data || error.message);
      throw error;
    }
  }

  async getAnalyticsDashboard(): Promise<any> {
    try {
      const response = await this.api.get(API_ENDPOINTS.ANALYTICS.DASHBOARD);
      return response.data;
    } catch (error: any) {
      console.error('Get analytics dashboard error:', error.response?.data || error.message);
      throw error;
    }
  }

  // Admin APIs
  async refreshRouteCache(): Promise<any> {
    try {
      const response = await this.api.post(API_ENDPOINTS.ADMIN.ROUTE_CACHE_REFRESH);
      return response.data;
    } catch (error: any) {
      console.error('Refresh route cache error:', error.response?.data || error.message);
      throw error;
    }
  }

  async getRouteCacheStatus(): Promise<any> {
    try {
      const response = await this.api.get(API_ENDPOINTS.ADMIN.ROUTE_CACHE_STATUS);
      return response.data;
    } catch (error: any) {
      console.error('Get route cache status error:', error.response?.data || error.message);
      throw error;
    }
  }

  // Health Check
  async ping(): Promise<{ status: string }> {
    try {
      const response = await this.api.get(API_ENDPOINTS.HEALTH);
      return response.data;
    } catch (error: any) {
      console.error('Ping error:', error.response?.data || error.message);
      throw error;
    }
  }
}

// Export singleton instance
export const apiClient = new ApiClient();

// Export for backward compatibility
export const login = apiClient.login.bind(apiClient);
export const register = apiClient.register.bind(apiClient);
export const logout = apiClient.logout.bind(apiClient);
export const checkToken = apiClient.checkToken.bind(apiClient);
export const getUserData = apiClient.getUserProfile.bind(apiClient);
