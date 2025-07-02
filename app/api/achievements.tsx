// Achievement and notification system
import * as Notifications from 'expo-notifications';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  type: 'distance' | 'time' | 'eco' | 'streak' | 'social';
  unlocked: boolean;
  unlockedAt?: Date;
  progress: number;
  target: number;
}

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export const requestNotificationPermissions = async () => {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  
  return finalStatus === 'granted';
};

// Send local notifications for achievements
export const showAchievementNotification = async (achievement: Achievement) => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: '🏆 Achievement Unlocked!',
      body: `${achievement.title}: ${achievement.description}`,
      data: { achievementId: achievement.id },
    },
    trigger: null, // Show immediately
  });
};

// Send daily motivation
export const scheduleDailyMotivation = async () => {
  await Notifications.cancelAllScheduledNotificationsAsync();
  
  const motivationalMessages = [
    "Ready to make today's commute count? 🚌",
    "Every journey saves the planet! 🌍",
    "Track your travel and earn rewards! ⭐",
    "Your eco-friendly choices matter! 🌱",
    "Join thousands of eco-commuters today! 👥"
  ];
  
  // Schedule for next 7 days
  for (let i = 1; i <= 7; i++) {
    const triggerDate = new Date();
    triggerDate.setDate(triggerDate.getDate() + i);
    triggerDate.setHours(8, 0, 0, 0); // 8 AM
    
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'TravleTime 🚊',
        body: motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)],
      },
      trigger: { 
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: i * 24 * 60 * 60 
      }, // i days in seconds
    });
  }
};

// Sample achievements data
export const getSampleAchievements = (): Achievement[] => [
  {
    id: 'first_trip',
    title: 'First Journey',
    description: 'Complete your first tracked trip',
    icon: 'rocket1',
    type: 'distance',
    unlocked: true,
    unlockedAt: new Date(),
    progress: 1,
    target: 1
  },
  {
    id: 'eco_warrior',
    title: 'Eco Warrior',
    description: 'Save 50kg of CO2 through public transport',
    icon: 'Trophy',
    type: 'eco',
    unlocked: false,
    progress: 23.5,
    target: 50
  },
  {
    id: 'week_streak',
    title: 'Weekly Commuter',
    description: 'Use public transport for 7 consecutive days',
    icon: 'calendar',
    type: 'streak',
    unlocked: false,
    progress: 4,
    target: 7
  },
  {
    id: 'time_saver',
    title: 'Time Master',
    description: 'Accumulate 100 hours of travel time',
    icon: 'clockcircle',
    type: 'time',
    unlocked: false,
    progress: 42.3,
    target: 100
  },
  {
    id: 'social_butterfly',
    title: 'Community Leader',
    description: 'Reach top 10 on the leaderboard',
    icon: 'star',
    type: 'social',
    unlocked: false,
    progress: 25,
    target: 10
  }
];
