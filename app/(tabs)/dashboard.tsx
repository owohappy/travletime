import { AntDesign } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { getUserData } from '../api';
import SimpleDrawer from '../drawer';

const router = useRouter();
const apiURL = 'http://localhost:8000'; // Replace with your actual API URL

// VARIABLES TO CHANGE FOR API
const pointsAmount = 1820;
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export default function Dashboard() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);


  React.useEffect(() => {
    getUserData().then(data => setUserData(data));
    setLoading(false);
  }, []);

  const { email, id: userID, email_verified, name, phonenumber, address, created_at, email_verified_at, mfa, pfp_url, hours } = userData || {};
  console.log('User data:', userData);
  console.log('User ID:', name);
  const toggleDrawer = () => {
    setDrawerOpen((prev: boolean) => !prev);
  };

  interface TaskHandler {
    (): void;
  }

  const handleTask: TaskHandler = () => {
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={{ color: 'white' }}>Loading...</Text>
      </View>
    );
  }

  return (



    <View style={styles.container}>

      
      
      {/* Header */}


      <View style={styles.header}>
        <TouchableOpacity onPress={toggleDrawer}>
        <AntDesign name="menu-fold" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Profile Section */}
      <View style={styles.profileSection}>
        <Image style={styles.profileImage} source={{ uri: pfp_url }} />
          <Text style={styles.username}>{name}</Text>
        <Text style={styles.pointsLabel}>Total hours</Text>
        <Text style={styles.points}>{hours}</Text>
      </View>

      {/* Explore Section */}
      <Text style={styles.sectionTitle}>Explore</Text>
      {/*Scrollview of rewards | TODO: Make this a function and fetch rewards types and Rewards from server*/}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        <TouchableOpacity onPress={() => router.push('/(tabs)/giftcards')}>       
        <View style={[styles.card, { backgroundColor: '#FFD6D6' }]}>
        <View style={[styles.cardLable, {backgroundColor: '#945050',}]}>
            <Text style={styles.cardLableText}>Overview</Text>
          </View>
        </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/(tabs)/leaderboard')}>       
        <View style={[styles.card, { backgroundColor: '#FFD6D6' }]}>
        <View style={[styles.cardLable, {backgroundColor: '#945050',}]}>
            <Text style={styles.cardLableText}>Leaderboard</Text>
          </View>
        </View>
        </TouchableOpacity>

      </ScrollView>


      <TouchableOpacity onPress={() => router.push('/(tabs)/tracking')}>
        <View style={styles.trackButton}>
          <AntDesign stlye={styles.buttonTrackIcon} name="arrowright" size={24} color="white" />
        </View>
      </TouchableOpacity>

          <SimpleDrawer
        isOpen={drawerOpen}
        toggleDrawer={toggleDrawer}
        onTask={handleTask}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    marginLeft: width * 0.05,
    marginTop: 20,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  profileSection: {
    alignItems: 'center',
    marginVertical: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#8c8c8c',
  },
  username: {
    marginTop: 10,
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  pointsLabel: {
    marginTop: 5,
    fontSize: 16,
    color: 'gray',
  },
  points: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  sectionTitle: {
    marginLeft: width * 0.05,
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  scrollContainer: {
    marginLeft: width * 0.05,
    flexDirection: 'row',
    //paddingVertical: 10,
    height: Dimensions.get('window').height * 0.36 + 20,
    right: 10,

  },
  card: {
    width: 300, //Dimensions.get('window').width * 0.8,
    height: Dimensions.get('window').height * 0.26,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  cardGiftcards: {
    backgroundColor: '#D4D4F7',
  },
  cardTickets: {
    backgroundColor: '#FFD6D6',
  },
  cardText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4e4e91',
  },
cardLable:{
  position: 'absolute',
  justifyContent: "center",
  left: 10,
  top: 10,
  borderRadius:25,
  width: 90,
  height: 40,
   
}, cardLableText: {
  alignSelf: 'center',
  justifyContent: "center",
  fontSize: 13,
  fontWeight: '900',
  color: 'white'
},
trackButton: {
  backgroundColor: '#945050',
  width: 50,
  height: 50,
  bottom: 30,
  borderRadius: 10,
  justifyContent: 'center',
  alignSelf: 'center',
  alignContent: 'center',
  alignItems: 'center',
  bottom: 60,
},
buttonTrackIcon: {
  position: 'absolute',
  alignSelf: 'center',
  justifyContent: 'center',
  marginTop: 5,
  left: 50,
  bottom: 40
}

});