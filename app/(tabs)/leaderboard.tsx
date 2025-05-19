import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, FlatList, StyleSheet, Text, View } from 'react-native';

const screenHeight = Dimensions.get('window').height;

type LeaderboardUser = {
    id: string;
    name: string;
    points: number;
};

export default function Leaderboard() {
    const [users, setUsers] = useState<LeaderboardUser[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            setLoading(true);
            try {
                const response = await fetch('http://87.106.70.51:8080/stats/leaderboard');
                if (!response.ok) throw new Error('Network response was not ok');
                const data = await response.json();
                setUsers(data);
            } catch (error) {
                console.error('Failed to fetch leaderboard:', error);
                setUsers([]);
            } finally {
                setLoading(false);
            }
        };
        fetchLeaderboard();
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Leaderboard</Text>
            <View style={styles.leaderboardBox}>
                {loading ? (
                    <ActivityIndicator size="large" color="#38828f" />
                ) : (
                    <FlatList
                        data={users}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item, index }) => (
                            <View style={[styles.row, index < 3 && styles.topRow]}>
                                <Text style={[styles.rank, index < 3 && styles.topRank]}>{index + 1}</Text>
                                <Text style={[styles.name, index < 3 && styles.topName]}>{item.name}</Text>
                                <Text style={[styles.points, index < 3 && styles.topPoints]}>{item.points} hr</Text>
                            </View>
                        )}
                    />
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212',
        paddingTop: 48,
        paddingHorizontal: 0,
        alignItems: 'center',
    },
    title: {
        color: '#fff',
        fontSize: 28,
        fontWeight: '900',
        marginBottom: 24,
        alignSelf: 'center',
        letterSpacing: 1,
    },
    leaderboardBox: {
        width: '92%',
        backgroundColor: '#222',
        borderRadius: 18,
        paddingVertical: 12,
        paddingHorizontal: 0,
        minHeight: screenHeight ,//add calc of height to seem to go thru bottom
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.18,
        shadowRadius: 8,
        elevation: 6,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 18,
        borderBottomWidth: 1,
        borderBottomColor: '#333',
    },
    rank: {
        width: 32,
        fontSize: 18,
        fontWeight: 'bold',
        color: '#38828f',
        textAlign: 'center',
    },
    name: {
        flex: 1,
        fontSize: 18,
        color: '#fff',
        fontWeight: '600',
        marginLeft: 8,
    },
    points: {
        fontSize: 16,
        color: '#b0b0b0',
        fontWeight: '600',
    },
    // Highlight top 3
    topRow: {
        backgroundColor: '#1e2a2f',
        borderRadius: 8,
    },
    topRank: {
        color: '#d4af37',
        fontSize: 22,
    },
    topName: {
        color: '#fff',
        fontWeight: 'bold',
    },
    topPoints: {
        color: '#38828f',
        fontWeight: 'bold',
    },
});