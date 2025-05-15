import { AntDesign } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Dimensions, StyleSheet, TouchableOpacity, View } from 'react-native';
import Svg, { Circle, Line } from 'react-native-svg';

const { width } = Dimensions.get('window');
const CLOCK_SIZE = width * 0.8;
const CENTER = CLOCK_SIZE / 2;
const RADIUS = CENTER - 10;



export default function Tracking() {
  // set to 00:00:00
  const [time, setTime] = useState(new Date(0,0,0,0,0,0));

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const getAngle = (value: number, max: number) => (360 * value) / max - 90;
  const toRad = (angle: number) => (angle * Math.PI) / 180;

  const hour = time.getHours() % 12;
  const minute = time.getMinutes();
  const second = time.getSeconds();

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

  function toggleDrawer(): void {
    throw new Error('Function not implemented.');
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            // Handle back to dashboard
            router.push('/(tabs)/dashboard');
          }}>
          <AntDesign name="arrowleft" size={24} color="white" />
        </TouchableOpacity>

        <TouchableOpacity  onPress={toggleDrawer} style={{ marginLeft: 'auto' }}>
        <AntDesign name="menu-fold" size={24} color="white" />
        </TouchableOpacity>


        

      </View>
      <View style={styles.clockView}>

      <Svg height={CLOCK_SIZE} width={CLOCK_SIZE}>
        {/* Outer Circle */}
        <Circle cx={CENTER} cy={CENTER} r={RADIUS} stroke="#333" strokeWidth="4" fill="#fff" />

        {/* Hour Marks */}
        {[...Array(12)].map((_, i) => {
          const angle = toRad((360 * i) / 12 - 90);
          const x1 = CENTER + Math.cos(angle) * (RADIUS - 10);
          const y1 = CENTER + Math.sin(angle) * (RADIUS - 10);
          const x2 = CENTER + Math.cos(angle) * (RADIUS - 2);
          const y2 = CENTER + Math.sin(angle) * (RADIUS - 2);
          return <Line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#333" strokeWidth="2" />;
        })}

        {/* Hands */}
        <Line x1={CENTER} y1={CENTER} x2={hourHand.x} y2={hourHand.y} stroke="#000" strokeWidth="6" />
        <Line x1={CENTER} y1={CENTER} x2={minuteHand.x} y2={minuteHand.y} stroke="#555" strokeWidth="4" />
        <Line x1={CENTER} y1={CENTER} x2={secondHand.x} y2={secondHand.y} stroke="#f00" strokeWidth="2" />

        {/* Center Dot */}
        <Circle cx={CENTER} cy={CENTER} r={4} fill="#000" />
      </Svg>
    </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    marginTop: 20,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  clockView: {
    flex: 1,
    backgroundColor: '#121212',
    paddingHorizontal: '5%',
    paddingTop: 60,
    alignItems: 'center',
  },
  clockText: {
    fontSize: 32,
    color: '#fff',
    fontWeight: 'bold',
    marginTop: 20,
  },
  clockFace: {
    backgroundColor: '#222',
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    position: 'relative',
  },
  clockBorder: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 100,
    borderWidth: 4,
    borderColor: '#fff',
  },
  secondHand: {
    position: 'absolute',
    width: 4,
    backgroundColor: '#e53935',
    borderRadius: 2,
  },
  centerDot: {
    position: 'absolute',
    width: 12,
    height: 12,
    backgroundColor: '#fff',
    borderRadius: 6,
    zIndex: 1,
  },
});