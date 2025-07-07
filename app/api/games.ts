/**
 * Games API - Uses the new API client for achievements and gamification
 */

import { apiClient } from './client';

// Game Types
export interface GameActivity {
  id: string;
  title: string;
  description: string;
  type: 'quiz' | 'challenge' | 'puzzle' | 'trivia';
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
  estimatedTime: number; // in minutes
  category: string;
  icon: string;
  isCompleted: boolean;
  isAvailable: boolean;
  requirements?: string[];
}

export interface GameSession {
  id: string;
  gameId: string;
  startTime: string;
  endTime?: string;
  score: number;
  maxScore: number;
  pointsEarned: number;
  completed: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  points: number;
  unlockedAt?: string;
  progress: number;
  maxProgress: number;
  category: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

// Sample game data (fallback)
const SAMPLE_GAMES: GameActivity[] = [
  {
    id: '1',
    title: 'Eco Transport Quiz',
    description: 'Test your knowledge about sustainable transportation',
    type: 'quiz',
    difficulty: 'easy',
    points: 50,
    estimatedTime: 5,
    category: 'Education',
    icon: '🌱',
    isCompleted: false,
    isAvailable: true,
  },
  {
    id: '2',
    title: 'Route Planning Challenge',
    description: 'Find the most efficient route using public transport',
    type: 'challenge',
    difficulty: 'medium',
    points: 100,
    estimatedTime: 10,
    category: 'Strategy',
    icon: '🗺️',
    isCompleted: false,
    isAvailable: true,
  },
  {
    id: '3',
    title: 'Carbon Footprint Calculator',
    description: 'Calculate and compare different transport options',
    type: 'puzzle',
    difficulty: 'medium',
    points: 75,
    estimatedTime: 8,
    category: 'Environment',
    icon: '🌍',
    isCompleted: true,
    isAvailable: true,
  },
  {
    id: '4',
    title: 'City Transit Trivia',
    description: 'Answer questions about public transportation systems',
    type: 'trivia',
    difficulty: 'hard',
    points: 150,
    estimatedTime: 15,
    category: 'Knowledge',
    icon: '🚇',
    isCompleted: false,
    isAvailable: false,
    requirements: ['Complete 5 other games'],
  },
];

const SAMPLE_ACHIEVEMENTS: Achievement[] = [
  {
    id: '1',
    title: 'Eco Warrior',
    description: 'Complete 10 eco-friendly trips',
    icon: '🌿',
    points: 100,
    unlockedAt: '2024-01-15T10:30:00Z',
    progress: 10,
    maxProgress: 10,
    category: 'Environment',
    rarity: 'common',
  },
  {
    id: '2',
    title: 'Week Streaker',
    description: 'Track your commute for 7 consecutive days',
    icon: '🔥',
    points: 200,
    unlockedAt: '2024-01-20T16:45:00Z',
    progress: 7,
    maxProgress: 7,
    category: 'Consistency',
    rarity: 'rare',
  },
  {
    id: '3',
    title: 'Distance Master',
    description: 'Travel 1000km using public transport',
    icon: '🏃‍♂️',
    points: 500,
    progress: 847,
    maxProgress: 1000,
    category: 'Distance',
    rarity: 'epic',
  },
  {
    id: '4',
    title: 'Transit Explorer',
    description: 'Use 5 different types of public transport',
    icon: '🚌',
    points: 300,
    progress: 3,
    maxProgress: 5,
    category: 'Exploration',
    rarity: 'rare',
  },
];

// Get available games
export async function getAvailableGames(userId?: string): Promise<GameActivity[]> {
  try {
    // Try to get games from analytics dashboard
    const dashboard = await apiClient.getAnalyticsDashboard();
    
    // Transform dashboard data to games format if available
    if (dashboard.games) {
      return dashboard.games.map((game: any) => ({
        id: game.id,
        title: game.title,
        description: game.description,
        type: game.type || 'quiz',
        difficulty: game.difficulty || 'medium',
        points: game.points || 50,
        estimatedTime: game.estimatedTime || 5,
        category: game.category || 'General',
        icon: game.icon || '🎮',
        isCompleted: game.isCompleted || false,
        isAvailable: game.isAvailable !== false,
        requirements: game.requirements,
      }));
    }
    
    return SAMPLE_GAMES;
  } catch (error) {
    console.error('Failed to fetch games:', error);
    return SAMPLE_GAMES;
  }
}

// Get user achievements
export async function getUserAchievements(userId?: string): Promise<Achievement[]> {
  try {
    const insights = await apiClient.getUserTravelInsights(userId);
    
    if (insights.achievements) {
      return insights.achievements.map((achievement: any) => ({
        id: achievement.id,
        title: achievement.title,
        description: achievement.description,
        icon: achievement.icon || '🏆',
        points: achievement.points || 0,
        unlockedAt: achievement.unlockedAt,
        progress: achievement.progress || 0,
        maxProgress: achievement.maxProgress || 1,
        category: achievement.category || 'General',
        rarity: achievement.rarity || 'common',
      }));
    }
    
    return SAMPLE_ACHIEVEMENTS;
  } catch (error) {
    console.error('Failed to fetch achievements:', error);
    return SAMPLE_ACHIEVEMENTS;
  }
}

// Start a game session
export async function startGameSession(gameId: string, userId?: string): Promise<GameSession> {
  try {
    // For now, create a local session
    // TODO: Implement backend game session management
    const session: GameSession = {
      id: `session_${Date.now()}`,
      gameId,
      startTime: new Date().toISOString(),
      score: 0,
      maxScore: 100,
      pointsEarned: 0,
      completed: false,
    };
    
    return session;
  } catch (error) {
    console.error('Failed to start game session:', error);
    throw error;
  }
}

// Complete a game session
export async function completeGameSession(
  sessionId: string,
  score: number,
  userId?: string
): Promise<GameSession> {
  try {
    // For now, simulate completion
    // TODO: Implement backend game completion
    const pointsEarned = Math.floor(score * 1.5); // Points based on score
    
    const session: GameSession = {
      id: sessionId,
      gameId: sessionId.split('_')[1], // Extract game ID from session
      startTime: new Date(Date.now() - 300000).toISOString(), // 5 minutes ago
      endTime: new Date().toISOString(),
      score,
      maxScore: 100,
      pointsEarned,
      completed: true,
    };
    
    return session;
  } catch (error) {
    console.error('Failed to complete game session:', error);
    throw error;
  }
}

// Get game statistics
export async function getGameStats(userId?: string): Promise<any> {
  try {
    const insights = await apiClient.getUserTravelInsights(userId);
    
    return {
      totalGamesPlayed: insights.totalGamesPlayed || 0,
      totalPointsEarned: insights.totalPointsEarned || 0,
      averageScore: insights.averageScore || 0,
      favoriteGameType: insights.favoriteGameType || 'quiz',
      streakDays: insights.streakDays || 0,
      achievements: insights.achievements?.length || 0,
    };
  } catch (error) {
    console.error('Failed to fetch game stats:', error);
    return {
      totalGamesPlayed: 15,
      totalPointsEarned: 1250,
      averageScore: 78,
      favoriteGameType: 'quiz',
      streakDays: 5,
      achievements: 4,
    };
  }
}

// Get daily challenges
export async function getDailyChallenges(userId?: string): Promise<GameActivity[]> {
  try {
    const dashboard = await apiClient.getAnalyticsDashboard();
    
    if (dashboard.dailyChallenges) {
      return dashboard.dailyChallenges;
    }
    
    // Return sample daily challenges
    return [
      {
        id: 'daily_1',
        title: 'Morning Commute Quiz',
        description: 'Answer 5 questions about your morning route',
        type: 'quiz',
        difficulty: 'easy',
        points: 25,
        estimatedTime: 3,
        category: 'Daily',
        icon: '🌅',
        isCompleted: false,
        isAvailable: true,
      },
      {
        id: 'daily_2',
        title: 'Eco Challenge',
        description: 'Use public transport for at least 2 trips today',
        type: 'challenge',
        difficulty: 'easy',
        points: 50,
        estimatedTime: 0, // Ongoing challenge
        category: 'Daily',
        icon: '🌱',
        isCompleted: false,
        isAvailable: true,
      },
    ];
  } catch (error) {
    console.error('Failed to fetch daily challenges:', error);
    return [];
  }
}

// Legacy exports for backward compatibility
export const getGames = getAvailableGames;
export const getAchievements = getUserAchievements;
