// api.tsx - Legacy API functions (kept for backward compatibility)
// New code should use the apiClient from './api/client.ts'

import { apiClient } from './api/client';

// Export the new API client functions for backward compatibility
export const login = apiClient.login.bind(apiClient);
export const register = apiClient.register.bind(apiClient);
export const logout = apiClient.logout.bind(apiClient);
export const checkToken = apiClient.checkToken.bind(apiClient);
export const getUserData = apiClient.getUserProfile.bind(apiClient);

// Export the full API client for advanced usage
export { apiClient } from './api/client';
export type { LoginData, RegisterData, UserProfile, LocationPing, TravelSession, LeaderboardEntry } from './api/client';
