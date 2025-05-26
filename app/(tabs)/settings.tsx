import { AntDesign } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Button, Image, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import SimpleDrawer from '../drawer';
// Placeholder API call
const updateProfile = async (data: FormData) => {
    // Simulating API call with FormData that contains the image file
    // In a real app, you would use fetch or axios here
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
            // Create FormData object to handle the file upload
            const formData = new FormData();
            formData.append('name', name);
            formData.append('phonenumber', phonenumber);
            formData.append('email', email);
            
            // Add image file to FormData if it exists
            if (image) {
                // Get file info from the URI
                const fileInfo = await fetch(image).then(res => res.blob());
                
                // Create a file name (you may want to extract the actual extension)
                const fileName = `profile_${Date.now()}.jpg`;
                
                // Append file to form data
                formData.append('profileImage', {
                    uri: image,
                    name: fileName,
                    type: 'image/jpeg', // Adjust based on your image type
                } as any);
            }
            
            // Send the form data to the API
            await updateProfile(formData);
                    Alert.alert('Success', 'Profile updated with new image!');
                } catch (error) {
                    console.error('Update error:', error);
                    Alert.alert('Error', 'Failed to update profile.');
                } finally {
                    setLoading(false);
                }
            };

    const router = useRouter();
    
                    const [image, setImage] = useState<string | null>(null);

                const pickImage = async () => {
                    let result = await ImagePicker.launchImageLibraryAsync({
                        mediaTypes: ImagePicker.MediaTypeOptions.Images,
                        allowsEditing: true,
                        aspect: [1, 1],
                        quality: 0.8,
                    });

                    if (!result.canceled) {
                        setImage(result.assets[0].uri);
                    }
                };
                
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


                <View style={styles.profilePicContainer}>
                    <TouchableOpacity onPress={pickImage} style={styles.profilePicButton}>
                        {image ? (
                            <Image source={{ uri: image }} style={styles.profilePic} />
                        ) : (
                            <View style={styles.placeholderContainer}>
                                <AntDesign name="user" size={40} color="#888" />
                            </View>
                        )}
                    </TouchableOpacity>
                </View>

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
    header: {marginTop: 55 ,padding: 24, alignItems: 'center' },
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
    profilePicContainer: {
        alignItems: 'center',
        marginBottom: 16,
    },
    profilePic: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 2,
        borderColor: '#8c8c8c',
    },
    placeholderContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 2,
        borderColor: '#8c8c8c',
        backgroundColor: '#222',
    },

});