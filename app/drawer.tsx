// components/SimpleDrawer.js
import { useRouter } from 'expo-router';
import React from 'react';
import {
  Animated,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { logout } from './api';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const router = useRouter();

export default function SimpleDrawer({ isOpen, toggleDrawer, onTask }) {
  const drawerAnim = React.useRef(new Animated.Value(-SCREEN_WIDTH)).current;

  React.useEffect(() => {
    Animated.timing(drawerAnim, {
      toValue: isOpen ? 0 : -SCREEN_WIDTH,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isOpen]);

  return (
    <Animated.View
      style={[
        styles.drawer,
        {
          transform: [{ translateX: drawerAnim }],
        },
      ]}
    >
      <View style={styles.drawerContent}>
        <Text style={styles.drawerTitle}>traveltime</Text>

        <TouchableOpacity
          style={styles.drawerItem}
          onPress={() => router.push('/(tabs)/dashboard')}
        >
          <Text style={styles.drawerItemText}>Dashboard</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.drawerItem}
          onPress={() => router.push('/(tabs)/overviewHours')}
        >
          <Text style={styles.drawerItemText}>Overview</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.drawerItem}
          onPress={() => router.push('/(tabs)/leaderboard')}
        >
          <Text style={styles.drawerItemText}>Leaderboard</Text>
        </TouchableOpacity>

          <TouchableOpacity
          style={[styles.drawerItem, {position: 'absolute', top: SCREEN_HEIGHT - 220 , left: 0, right: 0}]}
          onPress={() => {
            router.push('/(tabs)/settings');
          }}
        >
          <Text style={[styles.drawerItemText]}>Settings</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.drawerItem, {position: 'absolute', top: SCREEN_HEIGHT - 150 , left: 0, right: 0}]}
          onPress={() => {
            logout();
            router.push('/(tabs)/login');
          }}
        >
          <Text style={[styles.drawerItemText]}>Logout</Text>
        </TouchableOpacity>

      </View>
      {isOpen && (
      <TouchableOpacity
        style={{ position: 'absolute', left: 300, width: SCREEN_WIDTH, height: '100%', top: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        onPress={toggleDrawer}
      />
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  drawer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    width: 300,
    backgroundColor: '#222',
    paddingTop: 80,
    paddingHorizontal: 20,
    zIndex: 10,
  },
  drawerContent: {},
  drawerTitle: {
    color: '#fff',
    fontSize: 22,
    marginBottom: 20,
    bottom: 40
  },
  drawerItem: {
    marginBottom: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#555',
  },
  drawerItemText: {
    color: '#fff',
    fontSize: 18,
  },
});
