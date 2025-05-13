import { useRouter } from 'expo-router';
import React from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { height: screenHeight, width: screenWidth } = Dimensions.get('window');
const router = useRouter();

export default function giftcards() {
  return (
    <View style={style.container}>
      <Text style={[style.containerLabel, {marginTop: 240}]}>Amazon</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={style.scrollContainer}
      >
        <TouchableOpacity onPress={() => router.push('/(tabs)/giftcards')}>
          <View style={[style.card, { backgroundColor: '#D4D4F7' }]}>
            <View style={[style.cardLabel, { backgroundColor: '#4e4e91' }]}>
              <Text style={style.cardLabelText}>5$</Text>
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/(tabs)/tickets')}>
          <View style={[style.card, { backgroundColor: '#D4D4F7' }]}>
            <View style={[style.cardLabel, { backgroundColor: '#4e4e91' }]}>
              <Text style={style.cardLabelText}>10$</Text>
            </View>
          </View>
        </TouchableOpacity>
      </ScrollView>

      <Text style={style.containerLabel}>Starbucks</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={style.scrollContainer}
      >
        <TouchableOpacity onPress={() => router.push('/(tabs)/giftcards')}>
          <View style={[style.card, { backgroundColor: '#D4D4F7' }]}>
            <View style={[style.cardLabel, { backgroundColor: '#4e4e91' }]}>
              <Text style={style.cardLabelText}>5$</Text>
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/(tabs)/tickets')}>
          <View style={[style.card, { backgroundColor: '#D4D4F7' }]}>
            <View style={[style.cardLabel, { backgroundColor: '#4e4e91' }]}>
              <Text style={style.cardLabelText}>10$</Text>
            </View>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    paddingHorizontal: '5%',
    paddingVertical: '23%',
  },
  containerLabel: {
    fontSize: 22,
    fontWeight: '900',
    color: 'white',
    marginBottom: '3%',
  },
  scrollContainer: {
    flexDirection: 'row',
    marginBottom: 1,
  },
  card: {
    borderRadius: 24,
    marginHorizontal: 12,
    width: screenWidth * 0.3,
    height: screenWidth * 0.3,
    //justifyContent: 'center',
    //alignItems: 'center',
  },
  cardLabel: {
    position: 'absolute',
    top: '5%',
    left: '5%',
    borderRadius: 12,
    width: '40%',
    height: '20%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardLabelText: {
    fontSize: 18,
    fontWeight: '900',
    color: 'white',
  },
});
