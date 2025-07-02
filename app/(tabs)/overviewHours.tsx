import { AntDesign } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
        Dimensions,
        ScrollView,
        StyleSheet,
        Text,
        TouchableOpacity,
        View
} from 'react-native';
import { getUserData } from '../api';
import { getTransportStats, getTravelInsights, getWeeklyStats } from '../api/stats';

import { StatusBar } from 'expo-status-bar';



const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

// Sample data for transportation statistics
const transportStats = [
        { type: 'Bus', hours: 0, color: '#4CAF50' },
        { type: 'Train', hours: 0, color: '#2196F3' },
        { type: 'Subway', hours: 0, color: '#FF9800' },
        { type: 'Tram', hours: 0, color: '#9C27B0' },
        { type: 'Ferry', hours: 0, color: '#00BCD4' }
];

export default function OverviewHours() {
        const router = useRouter();
        const [userData, setUserData] = useState<any>(null);
        const [transportStats, setTransportStats] = useState<any[]>([]);
        const [weeklyData, setWeeklyData] = useState<any[]>([]);
        const [insights, setInsights] = useState<any>(null);
        const [loading, setLoading] = useState(true);
        
        React.useEffect(() => {
          const loadData = async () => {
            try {
              const userDataResult = await getUserData();
              const transportStatsResult = await getTransportStats();
              const weeklyStatsResult = await getWeeklyStats();
              const insightsResult = await getTravelInsights();
              
              setUserData(userDataResult);
              
              const statsArray = [
                { type: 'Bus', hours: transportStatsResult.bus || 0, color: '#4CAF50' },
                { type: 'Train', hours: transportStatsResult.train || 0, color: '#2196F3' },
                { type: 'Subway', hours: transportStatsResult.subway || 0, color: '#FF9800' },
                { type: 'Tram', hours: transportStatsResult.tram || 0, color: '#9C27B0' },
                { type: 'Ferry', hours: transportStatsResult.ferry || 0, color: '#00BCD4' }
              ];
              setTransportStats(statsArray);
              setWeeklyData(weeklyStatsResult);
              setInsights(insightsResult);
            } catch (error) {
              console.error('Error loading overview data:', error);
              // fallback for like sample usage
              setTransportStats([
                { type: 'Bus', hours: 12.5, color: '#4CAF50' },
                { type: 'Train', hours: 8.3, color: '#2196F3' },
                { type: 'Subway', hours: 5.2, color: '#FF9800' },
                { type: 'Tram', hours: 2.1, color: '#9C27B0' },
                { type: 'Ferry', hours: 0.8, color: '#00BCD4' }
              ]);
            } finally {
              setLoading(false);
            }
          };
          
          loadData();
        }, []);
        
        const { email, id: userID, email_verified, name, phonenumber, address, created_at, email_verified_at, mfa, pfp_url, points } = userData || {};
        
        const totalHours = transportStats.reduce((sum, stat) => sum + stat.hours, 0);
        
        if (loading) {
          return (
            <View style={styles.container}>
              <Text style={{ color: 'white', textAlign: 'center', marginTop: 100 }}>Loading stats...</Text>
            </View>
          );
        }
        
        return (
                <View style={styles.container}>
                    {/* Header */}
                    <StatusBar style="light" />
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => router.back()}>
                            <AntDesign name="arrowleft" size={24} color="white" />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>stats owo :3</Text>
                    </View>
                    <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
                        {/* Summary Section */}
                        <View style={styles.summarySection}>
                            <Text style={styles.summaryTitle}>Your Travel Impact</Text>
                            <View style={styles.summaryStats}>
                                <View style={styles.statBox}>
                                    <Text style={styles.statValue}>{totalHours.toFixed(1)}</Text>
                                    <Text style={styles.statLabel}>Total Hours</Text>
                                </View>
                                <View style={styles.statBox}>
                                    <Text style={styles.statValue}>{(totalHours * 6).toFixed(1)}</Text>
                                    <Text style={styles.statLabel}>kg CO2 Saved</Text>
                                </View>
                            </View>
                        </View>
                                {/* Transport Breakdown */}
                                <View style={styles.breakdownSection}>
                                        <Text style={styles.sectionTitle}>Transport Breakdown</Text>
                                        
                                        {transportStats.map((item, index) => {
                                                const percentage = totalHours > 0 ? (item.hours / totalHours) * 100 : 0;
                                                
                                                return (
                                                        <View key={index} style={styles.transportRow}>
                                                                <View style={styles.transportLabelContainer}>
                                                                        <View style={[styles.colorDot, { backgroundColor: item.color }]} />
                                                                        <Text style={styles.transportLabel}>{item.type}</Text>
                                                                </View>
                                                                
                                                                <View style={styles.barContainer}>
                                                                        <View 
                                                                                style={[
                                                                                        styles.bar, 
                                                                                        { width: `${percentage}%`, backgroundColor: item.color }
                                                                                ]} 
                                                                        />
                                                                </View>
                                                                
                                                                <View style={styles.statsContainer}>
                                                                        <Text style={styles.hoursText}>{item.hours.toFixed(1)}h</Text>
                                                                        <Text style={styles.percentageText}>{percentage.toFixed(0)}%</Text>
                                                                </View>
                                                        </View>
                                                );
                                        })}
                                </View>

                                {/* Additional Stats */}
                                <View style={styles.additionalStatsSection}>
                                        <Text style={styles.sectionTitle}>Additional Insights</Text>
                                        
                                        <View style={styles.statsCard}>
                                                <View style={styles.statRow}>
                                                        <AntDesign name="clockcircle" size={20} color="#38828f" />
                                                        <Text style={styles.statInfoText}>Peak travel day: {insights?.peakTravelDay || 'Friday'}</Text>
                                                </View>
                                                
                                                <View style={styles.statRow}>
                                                        <AntDesign name="calendar" size={20} color="#38828f" />
                                                        <Text style={styles.statInfoText}>Most frequent: {insights?.mostFrequentRoute || 'Central Station'}</Text>
                                                </View>
                                                
                                                <View style={styles.statRow}>
                                                        <AntDesign name="linechart" size={20} color="#38828f" />
                                                        <Text style={styles.statInfoText}>{insights?.monthlyGrowth || 15}% increase from last month</Text>
                                                </View>
                                                
                                                <View style={styles.statRow}>
                                                        <AntDesign name="star" size={20} color="#38828f" />
                                                        <Text style={styles.statInfoText}>Top {insights?.ecoRank || 85}% of eco-travelers</Text>
                                                </View>
                                        </View>
                                </View>
                        </ScrollView>
                </View>
        );
}

const styles = StyleSheet.create({
        container: {
                flex: 1,
                backgroundColor: '#121212',
                paddingTop: 20,
        },
        header: {
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 20,
                paddingVertical: 15,
                marginTop: 30,
        },
        headerTitle: {
                color: 'white',
                fontSize: 20,
                fontWeight: 'bold',
                marginLeft: 15,
        },
        scrollView: {
                flex: 1,
                paddingHorizontal: 20,
        },
        summarySection: {
                marginTop: 15,
                marginBottom: 30,
        },
        summaryTitle: {
                color: 'white',
                fontSize: 24,
                fontWeight: 'bold',
                marginBottom: 15,
        },
        summaryStats: {
                flexDirection: 'row',
                justifyContent: 'space-around',
                marginTop: 10,
        },
        statBox: {
                backgroundColor: '#222',
                borderRadius: 12,
                padding: 20,
                minWidth: width * 0.4,
                alignItems: 'center',
        },
        statValue: {
                color: '#38828f',
                fontSize: 28,
                fontWeight: 'bold',
                marginBottom: 5,
        },
        statLabel: {
                color: '#999',
                fontSize: 14,
        },
        breakdownSection: {
                marginBottom: 30,
        },
        sectionTitle: {
                color: 'white',
                fontSize: 20,
                fontWeight: 'bold',
                marginBottom: 15,
        },
        transportRow: {
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 15,
        },
        transportLabelContainer: {
                flexDirection: 'row',
                alignItems: 'center',
                width: width * 0.2,
        },
        colorDot: {
                width: 12,
                height: 12,
                borderRadius: 6,
                marginRight: 8,
        },
        transportLabel: {
                color: 'white',
                fontSize: 14,
                fontWeight: '500',
        },
        barContainer: {
                flex: 1,
                height: 12,
                backgroundColor: '#333',
                borderRadius: 6,
                overflow: 'hidden',
                marginHorizontal: 10,
        },
        bar: {
                height: '100%',
                borderRadius: 6,
        },
        statsContainer: {
                flexDirection: 'row',
                width: width * 0.2,
                justifyContent: 'flex-end',
        },
        hoursText: {
                color: 'white',
                fontSize: 14,
                marginRight: 10,
        },
        percentageText: {
                color: '#999',
                fontSize: 14,
        },
        additionalStatsSection: {
                marginBottom: 30,
        },
        statsCard: {
                backgroundColor: '#222',
                borderRadius: 12,
                padding: 20,
        },
        statRow: {
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 15,
        },
        statInfoText: {
                color: 'white',
                fontSize: 14,
                marginLeft: 12,
        },
});
