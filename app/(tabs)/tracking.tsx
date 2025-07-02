import { AntDesign } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Svg, { Circle, Line } from 'react-native-svg';
import SimpleDrawer from '../drawer';

const { width } = Dimensions.get('window');
const CLOCK_SIZE = width * 0.8;
const CENTER = CLOCK_SIZE / 2;
const RADIUS = CENTER - 10;

export default function Tracking() {
  const [isTracking, setIsTracking] = useState(false);
  const [trackingTime, setTrackingTime] = useState(0); // seconds
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<string>('Detecting...');
  const [locationCoords, setLocationCoords] = useState<Location.LocationObject | null>(null);

  useEffect(() => {
    const getCurrentLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setCurrentLocation('Location permission denied');
          return;
        }

        const location = await Location.getCurrentPositionAsync({});
        setLocationCoords(location);
        
        // Reverse geocoding to get readable address
        const address = await Location.reverseGeocodeAsync({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
        
        if (address.length > 0) {
          const addr = address[0];
          setCurrentLocation(`${addr.street || ''} ${addr.city || 'Unknown Location'}`);
        }
      } catch (error) {
        console.error('Error getting location:', error);
        setCurrentLocation('Location unavailable');
      }
    };

    getCurrentLocation();
  }, []);

  useEffect(() => {
    let interval: any;
    if (isTracking) {
      interval = setInterval(() => {
        setTrackingTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTracking]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getAngle = (value: number, max: number) => (360 * value) / max - 90;
  const toRad = (angle: number) => (angle * Math.PI) / 180;

  const hour = Math.floor(trackingTime / 3600) % 12;
  const minute = Math.floor((trackingTime % 3600) / 60);
  const second = trackingTime % 60;

  const hourAngle = getAngle(hour * 5 + minute / 12, 60);
  const minuteAngle = getAngle(minute, 60);
  const secondAngle = getAngle(second, 60);

  const getCoords = (angle: number, length: number) => {
    const rad = toRad(angle);
    return {
      x: CENTER + length * Math.cos(rad),
      y: CENTER + length * Math.sin(rad),
    };
  };

  const hourHand = getCoords(hourAngle, RADIUS * 0.5);
  const minuteHand = getCoords(minuteAngle, RADIUS * 0.7);
  const secondHand = getCoords(secondAngle, RADIUS * 0.9);

  const toggleTracking = () => {
    setIsTracking(!isTracking);
    if (!isTracking) {
      setTrackingTime(0); 
    }
  };

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  return (
    <View style={styles.container}>
      {}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/(tabs)/dashboard')}>
          <AntDesign name="arrowleft" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Journey Tracker</Text>
        <TouchableOpacity onPress={toggleDrawer}>
          <AntDesign name="menu-fold" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {}
      <View style={styles.statusContainer}>
        <View style={[styles.statusIndicator, { backgroundColor: isTracking ? '#4CAF50' : '#666' }]} />
        <Text style={styles.statusText}>
          {isTracking ? 'Currently tracking your journey' : 'Ready to track'}
        </Text>
      </View>

      {/* Location Info */}
      <View style={styles.locationContainer}>
        <AntDesign name="enviromento" size={20} color="#38828f" />
        <Text style={styles.locationText}>{currentLocation}</Text>
      </View>

      {/* Timer Display */}
      <View style={styles.timerContainer}>
        <Text style={styles.timerLabel}>Journey Time</Text>
        <Text style={styles.timerDisplay}>{formatTime(trackingTime)}</Text>
      </View>

      {/* Clock Visualization */}
      <View style={styles.clockContainer}>
        <Svg height={CLOCK_SIZE} width={CLOCK_SIZE}>
          {/* Outer Circle */}
          <Circle cx={CENTER} cy={CENTER} r={RADIUS} stroke="#333" strokeWidth="4" fill="none" />
          
          {/* Progress Circle for tracking */}
          {isTracking && (
            <Circle 
              cx={CENTER} 
              cy={CENTER} 
              r={RADIUS - 20} 
              stroke="#38828f" 
              strokeWidth="6" 
              fill="none"
              strokeDasharray={`${(trackingTime % 60) * 10} ${600 - (trackingTime % 60) * 10}`}
              transform={`rotate(-90 ${CENTER} ${CENTER})`}
            />
          )}

          {/* Hour Marks */}
          {[...Array(12)].map((_, i) => {
            const angle = toRad((360 * i) / 12 - 90);
            const x1 = CENTER + Math.cos(angle) * (RADIUS - 15);
            const y1 = CENTER + Math.sin(angle) * (RADIUS - 15);
            const x2 = CENTER + Math.cos(angle) * (RADIUS - 5);
            const y2 = CENTER + Math.sin(angle) * (RADIUS - 5);
            return <Line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#666" strokeWidth="3" />;
          })}

          {/* Clock Hands */}
          <Line x1={CENTER} y1={CENTER} x2={hourHand.x} y2={hourHand.y} stroke="#fff" strokeWidth="6" strokeLinecap="round" />
          <Line x1={CENTER} y1={CENTER} x2={minuteHand.x} y2={minuteHand.y} stroke="#ccc" strokeWidth="4" strokeLinecap="round" />
          <Line x1={CENTER} y1={CENTER} x2={secondHand.x} y2={secondHand.y} stroke="#38828f" strokeWidth="2" strokeLinecap="round" />

          {/* Center Dot */}
          <Circle cx={CENTER} cy={CENTER} r={8} fill="#38828f" />
        </Svg>
      </View>

      {/* Control Buttons */}
      <View style={styles.controlsContainer}>
        <TouchableOpacity 
          style={[styles.trackButton, { backgroundColor: isTracking ? '#f44336' : '#4CAF50' }]}
          onPress={toggleTracking}
        >
          <AntDesign 
            name={isTracking ? 'pause' : 'play'} 
            size={32} 
            color="white" 
          />
        </TouchableOpacity>
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{Math.floor(trackingTime / 60)}</Text>
          <Text style={styles.statLabel}>Minutes</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{isTracking ? '✓' : '○'}</Text>
          <Text style={styles.statLabel}>Active</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{Math.round(trackingTime / 60 * 5)}</Text>
          <Text style={styles.statLabel}>Points</Text>
        </View>
      </View>

      <SimpleDrawer
        isOpen={drawerOpen}
        toggleDrawer={toggleDrawer}
        onTask={() => {}}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  statusText: {
    color: '#ccc',
    fontSize: 16,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  locationText: {
    color: '#38828f',
    fontSize: 16,
    marginLeft: 8,
    fontWeight: '600',
  },
  timerContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  timerLabel: {
    color: '#888',
    fontSize: 14,
    marginBottom: 5,
  },
  timerDisplay: {
    color: 'white',
    fontSize: 48,
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },
  clockContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  controlsContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  trackButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 40,
    paddingVertical: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  statLabel: {
    color: '#888',
    fontSize: 12,
  },
});