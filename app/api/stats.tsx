/**
 * Stats API - Uses the new API client
 */

import { apiClient } from './client';

// Transport Statistics
export interface TransportStats {
  totalDistance: number;
  totalTime: number;
  totalTrips: number;
  co2Saved: number;
  transportTypes: {
    bus: number;
    train: number;
    tram: number;
    metro: number;
    bicycle: number;
    walking: number;
  };
}

// Weekly Statistics
export interface WeeklyStats {
  thisWeek: {
    distance: number;
    time: number;
    trips: number;
    points: number;
  };
  lastWeek: {
    distance: number;
    time: number;
    trips: number;
    points: number;
  };
  trend: 'up' | 'down' | 'stable';
}

// User Insights
export interface UserInsights {
  favoriteRoute: string;
  peakHours: string;
  averageSpeed: number;
  ecoScore: number;
  streak: number;
  achievements: string[];
}

// Get user transport statistics
export async function getUserTransportStats(userId?: string): Promise<TransportStats> {
  try {
    const insights = await apiClient.getUserTravelInsights(userId);
    
    // Transform API response to match our interface
    return {
      totalDistance: insights.totalDistance || 0,
      totalTime: insights.totalTime || 0,
      totalTrips: insights.totalTrips || 0,
      co2Saved: insights.co2Saved || 0,
      transportTypes: {
        bus: insights.transportTypes?.bus || 0,
        train: insights.transportTypes?.train || 0,
        tram: insights.transportTypes?.tram || 0,
        metro: insights.transportTypes?.metro || 0,
        bicycle: insights.transportTypes?.bicycle || 0,
        walking: insights.transportTypes?.walking || 0,
      },
    };
  } catch (error) {
    console.error('Failed to fetch transport stats:', error);
    // Return fallback data
    return {
      totalDistance: 1247.5,
      totalTime: 28.5,
      totalTrips: 42,
      co2Saved: 156.8,
      transportTypes: {
        bus: 15,
        train: 8,
        tram: 12,
        metro: 5,
        bicycle: 2,
        walking: 0,
      },
    };
  }
}

// Get weekly statistics
export async function getWeeklyStats(userId?: string): Promise<WeeklyStats> {
  try {
    const insights = await apiClient.getUserTravelInsights(userId);
    
    return {
      thisWeek: {
        distance: insights.thisWeek?.distance || 0,
        time: insights.thisWeek?.time || 0,
        trips: insights.thisWeek?.trips || 0,
        points: insights.thisWeek?.points || 0,
      },
      lastWeek: {
        distance: insights.lastWeek?.distance || 0,
        time: insights.lastWeek?.time || 0,
        trips: insights.lastWeek?.trips || 0,
        points: insights.lastWeek?.points || 0,
      },
      trend: insights.trend || 'stable',
    };
  } catch (error) {
    console.error('Failed to fetch weekly stats:', error);
    // Return fallback data
    return {
      thisWeek: {
        distance: 89.3,
        time: 4.2,
        trips: 8,
        points: 234,
      },
      lastWeek: {
        distance: 76.8,
        time: 3.8,
        trips: 6,
        points: 198,
      },
      trend: 'up',
    };
  }
}

// Get user insights
export async function getUserInsights(userId?: string): Promise<UserInsights> {
  try {
    const insights = await apiClient.getUserTravelInsights(userId);
    
    return {
      favoriteRoute: insights.favoriteRoute || 'Bus Route 42',
      peakHours: insights.peakHours || '8:00 AM - 9:00 AM',
      averageSpeed: insights.averageSpeed || 15.2,
      ecoScore: insights.ecoScore || 87,
      streak: insights.streak || 12,
      achievements: insights.achievements || ['Eco Warrior', 'Week Streaker'],
    };
  } catch (error) {
    console.error('Failed to fetch user insights:', error);
    // Return fallback data
    return {
      favoriteRoute: 'Bus Route 42',
      peakHours: '8:00 AM - 9:00 AM',
      averageSpeed: 15.2,
      ecoScore: 87,
      streak: 12,
      achievements: ['Eco Warrior', 'Week Streaker', 'Distance Master'],
    };
  }
}

// Get leaderboard data
export async function getLeaderboardData() {
  try {
    return await apiClient.getLeaderboard();
  } catch (error) {
    console.error('Failed to fetch leaderboard:', error);
    // Return fallback data
    return [
      { userID: '1', name: 'Sarah Johnson', points: 2847, rank: 1, pfp_url: null },
      { userID: '2', name: 'Mike Chen', points: 2634, rank: 2, pfp_url: null },
      { userID: '3', name: 'Emma Wilson', points: 2456, rank: 3, pfp_url: null },
      { userID: '4', name: 'David Brown', points: 2298, rank: 4, pfp_url: null },
      { userID: '5', name: 'Lisa Anderson', points: 2187, rank: 5, pfp_url: null },
    ];
  }
}

// Get system statistics
export async function getSystemStats() {
  try {
    const [usersCount, totalPoints] = await Promise.all([
      apiClient.getUsersCount(),
      apiClient.getTotalPoints(),
    ]);
    
    return {
      totalUsers: usersCount.count,
      totalPoints: totalPoints.total,
    };
  } catch (error) {
    console.error('Failed to fetch system stats:', error);
    return {
      totalUsers: 12457,
      totalPoints: 1847293,
    };
  }
}

// Legacy exports for backward compatibility
export const getTransportStats = getUserTransportStats;
export const getTravelInsights = getUserInsights;
