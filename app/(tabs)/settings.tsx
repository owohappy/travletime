import { AntDesign } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Button, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import SimpleDrawer from '../drawer';

// Placeholder API call
const updateProfile = async (data: { name: string; phonenumber: string; email: string }) => {
    return new Promise((resolve) => setTimeout(() => resolve(true), 1000));
};

export default function Settings() {
    const [name, setName] = useState('');
    const [phonenumber, setPhonenumber] = useState('');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(false);
    
    const toggleDrawer = () => {
        setDrawerOpen((prev: boolean) => !prev);
            };

    const handleUpdate = async () => {
        setLoading(true);
        try {
            await updateProfile({ name, phonenumber, email });
            Alert.alert('Success', 'Profile updated!');
        } catch {
            Alert.alert('Error', 'Failed to update profile.');
        } finally {
            setLoading(false);
        }
    };

    const router = useRouter();
    

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <View style={styles.header}>
                      <View style={styles.headerbutton}>
        <TouchableOpacity onPress={toggleDrawer}>
        <AntDesign name="menu-fold" size={24} color="white" />
        </TouchableOpacity>
      </View>

                <Text style={styles.headerText}>Settings</Text>
            </View>
            <View style={styles.form}>
                <TextInput
                    style={styles.input}
                    placeholder="Name"
                    placeholderTextColor="#aaa"
                    value={name}
                    onChangeText={setName}
                    autoCapitalize="words"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Phone Number"
                    placeholderTextColor="#aaa"
                    value={phonenumber}
                    onChangeText={setPhonenumber}
                    keyboardType="phone-pad"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    placeholderTextColor="#aaa"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
                <View style={styles.buttonContainer}>
                    <Button
                        title={loading ? 'Updating...' : 'Update'}
                        onPress={handleUpdate}
                        disabled={loading}
                        color="#38828f"
                    />
                </View>

            </View>
                                      <SimpleDrawer
                        isOpen={drawerOpen}
                        toggleDrawer={toggleDrawer}
                        onTask={() => {}}
                      />
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#121212' },
    header: { padding: 24, alignItems: 'center', backgroundColor: '#222' },
    headerText: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
    form: { padding: 24 },
    input: {
        borderWidth: 1,
        borderColor: '#333',
        borderRadius: 10,
        padding: 12,
        marginBottom: 16,
        fontSize: 16,
        backgroundColor: '#222',
        color: '#fff',
    },
    buttonContainer: {
        marginTop: 8,
        borderRadius: 10,
        overflow: 'hidden',
    },
    headerbutton: {
        position: 'absolute',
        top: 25,
        left: 30,
        alignSelf: 'flex-start'
    },
});