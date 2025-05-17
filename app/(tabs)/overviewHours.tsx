import { AntDesign } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

// Sample data for transportation statistics
const transportStats = [
        { type: 'Bus', hours: 5.3, color: '#4CAF50' },
        { type: 'Train', hours: 12.7, color: '#2196F3' },
        { type: 'Subway', hours: 7.2, color: '#FF9800' },
        { type: 'Tram', hours: 3.8, color: '#9C27B0' },
        { type: 'Ferry', hours: 0.9, color: '#00BCD4' }
];

const totalHours = transportStats.reduce((sum, item) => sum + item.hours, 0);
const co2Saved = Math.round(totalHours * 2.3); // kg of CO2 saved (example calculation)

export default function OverviewHours() {
        const router = useRouter();

        return (
                <View style={styles.container}>
                    {/* Header */}
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
                                    <Text style={styles.statValue}>{co2Saved}</Text>
                                    <Text style={styles.statLabel}>kg CO2 Saved</Text>
                                </View>
                            </View>
                        </View>
                                {/* Transport Breakdown */}
                                <View style={styles.breakdownSection}>
                                        <Text style={styles.sectionTitle}>Transport Breakdown</Text>
                                        
                                        {transportStats.map((item, index) => {
                                                const percentage = (item.hours / totalHours) * 100;
                                                
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
                                                        <Text style={styles.statInfoText}>Peak travel day: Monday</Text>
                                                </View>
                                                
                                                <View style={styles.statRow}>
                                                        <AntDesign name="calendar" size={20} color="#38828f" />
                                                        <Text style={styles.statInfoText}>Most frequent: Train</Text>
                                                </View>
                                                
                                                <View style={styles.statRow}>
                                                        <AntDesign name="linechart" size={20} color="#38828f" />
                                                        <Text style={styles.statInfoText}>15% increase from last month</Text>
                                                </View>
                                                
                                                <View style={styles.statRow}>
                                                        <AntDesign name="star" size={20} color="#38828f" />
                                                        <Text style={styles.statInfoText}>Top 10% of eco-travelers</Text>
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
                marginTop: 10,
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
