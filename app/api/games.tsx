// Game API implementation
import axios from 'axios';
import { getUserData } from '../api';

const API_BASE = 'https://tt.owohappy.com:8080';

export interface Game {
  id: string;
  title: string;
  description: string;
  points: number;
  color: string;
  icon: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: 'quiz' | 'challenge' | 'route';
  unlocked: boolean;
  completed: boolean;
}

export interface GameProgress {
  gameId: string;
  score: number;
  completed: boolean;
  attempts: number;
  bestTime?: number;
}

// Get available games
export const getAvailableGames = async (): Promise<Game[]> => {
  try {
    const userData = await getUserData();
    const response = await axios.get(`${API_BASE}/games/available`, {
      params: {
        access_token: userData.access_token,
        userID: userData.id
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Failed to fetch games:', error);
    // Return enhanced sample data
    return [
      {
        id: '1',
        title: 'Transit Trivia',
        description: 'Test your knowledge about public transportation systems worldwide',
        points: 50,
        color: '#4CAF50',
        icon: 'questioncircle',
        difficulty: 'easy',
        category: 'quiz',
        unlocked: true,
        completed: false
      },
      {
        id: '2', 
        title: 'Route Optimizer',
        description: 'Find the most efficient routes in your city under time pressure',
        points: 75,
        color: '#2196F3',
        icon: 'enviromento',
        difficulty: 'medium',
        category: 'route',
        unlocked: true,
        completed: false
      },
      {
        id: '3',
        title: 'Eco Champion',
        description: 'Complete weekly eco-friendly transport challenges',
        points: 100,
        color: '#FF9800',
        icon: 'Trophy',
        difficulty: 'hard',
        category: 'challenge',
        unlocked: true,
        completed: false
      },
      {
        id: '4',
        title: 'Speed Commuter',
        description: 'Plan the fastest route between random locations',
        points: 60,
        color: '#9C27B0',
        icon: 'clockcircle',
        difficulty: 'medium',
        category: 'route',
        unlocked: false,
        completed: false
      }
    ];
  }
};

// Start a game session
export const startGame = async (gameId: string) => {
  try {
    const userData = await getUserData();
    const response = await axios.post(`${API_BASE}/games/${gameId}/start`, {
      userID: userData.id
    }, {
      params: {
        access_token: userData.access_token
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Failed to start game:', error);
    // Return sample game session
    return {
      sessionId: `session_${Date.now()}`,
      gameId: gameId,
      questions: [
        {
          id: 1,
          question: "Which city has the oldest subway system in the world?",
          options: ["London", "New York", "Paris", "Tokyo"],
          correct: 0
        },
        {
          id: 2,
          question: "What does 'BRT' stand for in public transport?",
          options: ["Bus Rapid Transit", "Basic Rail Transport", "Big Route Terminal", "Better Road Traffic"],
          correct: 0
        }
      ],
      timeLimit: 120
    };
  }
};

// Submit game results
export const submitGameResult = async (gameId: string, sessionId: string, score: number, timeSpent: number) => {
  try {
    const userData = await getUserData();
    const response = await axios.post(`${API_BASE}/games/${gameId}/complete`, {
      sessionId,
      score,
      timeSpent,
      userID: userData.id
    }, {
      params: {
        access_token: userData.access_token
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Failed to submit game result:', error);
    return {
      success: true,
      pointsEarned: score * 10,
      newLevel: false,
      achievement: null
    };
  }
};

// Get user's game progress
export const getGameProgress = async (): Promise<GameProgress[]> => {
  try {
    const userData = await getUserData();
    const response = await axios.get(`${API_BASE}/games/progress`, {
      params: {
        access_token: userData.access_token,
        userID: userData.id
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Failed to fetch game progress:', error);
    return [];
  }
};
