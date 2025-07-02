import { AntDesign } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { Alert, Dimensions, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { getAvailableGames, startGame, type Game } from '../api/games'
import SimpleDrawer from '../drawer'

const { width, height } = Dimensions.get('window')

// sample, apiendpoint isnt even made yet lol
const gamesData = [
  {
    id: '1',
    title: 'Commute Quiz',
    description: 'Test your knowledge about public transportation',
    points: 50,
    color: '#4CAF50',
    icon: 'questioncircle'
  },
  {
    id: '2', 
    title: 'Route Master',
    description: 'Find the most efficient routes in your city',
    points: 75,
    color: '#2196F3',
    icon: 'enviromento'
  },
  {
    id: '3',
    title: 'Eco Challenge',
    description: 'Complete eco-friendly transport challenges',
    points: 100,
    color: '#FF9800',
    icon: 'earth'
  },
  {
    id: '4',
    title: 'Speed Transit',
    description: 'Quick reaction game for transit timing',
    points: 25,
    color: '#9C27B0',
    icon: 'clockcircle'
  }
]

export default function Games() {
  const router = useRouter()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [games, setGames] = useState<Game[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadGames()
  }, [])

  const loadGames = async () => {
    try {
      const availableGames = await getAvailableGames()
      setGames(availableGames)
    } catch (error) {
      console.error('Error loading games:', error)
      // Fall back to sample data
      setGames(gamesData.map(game => ({
        ...game,
        difficulty: 'easy' as const,
        category: 'quiz' as const,
        unlocked: true,
        completed: false
      })))
    } finally {
      setLoading(false)
    }
  }

  const toggleDrawer = () => {
    setDrawerOpen(prev => !prev)
  }

  const playGame = async (game: Game) => {
    if (!game.unlocked) {
      Alert.alert('Game Locked', 'Complete more travel hours to unlock this game!')
      return
    }

    if (game.category === 'quiz') {
      Alert.alert(
        game.title,
        `Ready to test your knowledge? This ${game.difficulty} quiz has ${game.points} points up for grabs!`,
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Start Game', 
            onPress: async () => {
              try {
                const session = await startGame(game.id)
                Alert.alert('Game Started!', 'Quiz functionality will be available in the next update!')
              } catch (error) {
                Alert.alert('Error', 'Failed to start game. Please try again.')
              }
            }
          }
        ]
      )
    } else {
      Alert.alert('Coming Soon', `${game.title} will be available in a future update!`)
    }
  }

  const renderGameCard = ({ item }: { item: Game }) => (
    <TouchableOpacity 
      style={[styles.gameCard, { borderLeftColor: item.color, opacity: item.unlocked ? 1 : 0.6 }]}
      onPress={() => playGame(item)}
    >
      <View style={styles.gameContent}>
        <View style={[styles.iconContainer, { backgroundColor: item.color }]}>
          <AntDesign name={item.icon as any} size={24} color="white" />
        </View>
        <View style={styles.gameInfo}>
          <Text style={styles.gameTitle}>{item.title}</Text>
          <Text style={styles.gameDescription}>{item.description}</Text>
          <View style={styles.pointsContainer}>
            <AntDesign name="star" size={14} color="#FFD700" />
            <Text style={styles.pointsText}>{item.points} points</Text>
            {item.completed && (
              <AntDesign name="checkcircle" size={14} color="#4CAF50" style={{ marginLeft: 8 }} />
            )}
          </View>
        </View>
        <AntDesign name="right" size={16} color="#666" />
      </View>
    </TouchableOpacity>
  )

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={toggleDrawer}>
          <AntDesign name="menu-fold" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Games & Challenges</Text>
      </View>

      {/* Points Summary */}
      <View style={styles.pointsSummary}>
        <Text style={styles.summaryTitle}>Available Games</Text>
        <Text style={styles.summarySubtitle}>Earn points while having fun!</Text>
      </View>

      {/* Games List */}
      <FlatList
        data={games.length > 0 ? games : gamesData.map(game => ({
          ...game,
          difficulty: 'easy' as const,
          category: 'quiz' as const,
          unlocked: true,
          completed: false
        }))}
        renderItem={renderGameCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.gamesList}
        showsVerticalScrollIndicator={false}
      />

      {/* Coming Soon Notice */}
      <View style={styles.comingSoon}>
        <AntDesign name="rocket1" size={32} color="#38828f" />
        <Text style={styles.comingSoonText}>More games coming soon!</Text>
        <Text style={styles.comingSoonSubtext}>Check back regularly for new challenges</Text>
      </View>

      <SimpleDrawer
        isOpen={drawerOpen}
        toggleDrawer={toggleDrawer}
        onTask={() => {}}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 15,
  },
  pointsSummary: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  summaryTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: '900',
    marginBottom: 5,
  },
  summarySubtitle: {
    color: '#888',
    fontSize: 16,
  },
  gamesList: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  gameCard: {
    backgroundColor: '#222',
    borderRadius: 12,
    marginBottom: 15,
    borderLeftWidth: 4,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  gameContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  gameInfo: {
    flex: 1,
  },
  gameTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  gameDescription: {
    color: '#aaa',
    fontSize: 14,
    marginBottom: 8,
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pointsText: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  comingSoon: {
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  comingSoonText: {
    color: '#38828f',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
  },
  comingSoonSubtext: {
    color: '#666',
    fontSize: 14,
    textAlign: 'center',
  },
})