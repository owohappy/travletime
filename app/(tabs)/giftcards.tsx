import { useRouter } from 'expo-router';
import React from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

const giftcardData = [
  {
    brand: 'Amazon',
    cards: [
      { amount: 5, route: '/(tabs)/giftcards' },
      { amount: 10, route: '/(tabs)/tickets' },
      { amount: 15, route: '/(tabs)/tickets' },
      { amount: 20, route: '/(tabs)/tickets' },
    ],
  },
  {
    brand: 'Starbucks',
    cards: [
      { amount: 5, route: '/(tabs)/giftcards' },
      { amount: 10, route: '/(tabs)/tickets' },
    ],
  },
];

export default function Giftcards() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {giftcardData.map((brand, idx) => (
        <View key={brand.brand}>
          <Text style={[styles.containerLabel, idx === 0 && { marginTop: 120 }]}>{brand.brand}</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.scrollContainer}
          >
            {brand.cards.map((card, i) => (
              <TouchableOpacity
                key={card.amount}
                onPress={() => router.push(card.route)}
                activeOpacity={0.8}
              >
                <View style={[styles.card, { backgroundColor: '#D4D4F7' }]}>
                  <View style={[styles.cardLabel, { backgroundColor: '#4e4e91' }]}>
                    <Text style={styles.cardLabelText}>${card.amount}</Text>
                  </View>
                  <View style={styles.cardContent}>
                    <Text style={styles.cardBrandText}>{brand.brand}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    paddingHorizontal: '5%',
    paddingTop: 60,
  },
  containerLabel: {
    fontSize: 22,
    fontWeight: '900',
    color: 'white',
    marginBottom: 16,
    marginTop: 32,
  },
  scrollContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  card: {
    borderRadius: 24,
    marginHorizontal: 12,
    width: screenWidth * 0.36,
    height: screenWidth * 0.36,
    backgroundColor: '#D4D4F7',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  cardLabel: {
    position: 'absolute',
    top: 12,
    left: 12,
    borderRadius: 12,
    width: 48,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4e4e91',
    zIndex: 2,
  },
  cardLabelText: {
    fontSize: 16,
    fontWeight: '900',
    color: 'white',
  },
  cardContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardBrandText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#4e4e91',
    marginTop: 24,
  },
});
