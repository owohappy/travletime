import { AntDesign } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Button, Image, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { getUserData } from '../api'; // Adjust the import path as necessary
import SimpleDrawer from '../drawer';
// Placeholder API call

const updateProfile = async (data: FormData, userid: string, imageUri: string | null = null) => {
    console.log('Updating profile with data:', userid);
    const access_token = await getUserData().then(data => data.access_token);
    
    // Update profile data
    try {
         if (imageUri) {
            const imageFormData = new FormData();
            const fileName = `profile_${Date.now()}.jpg`;
            
            // Create a Blob from the image URI
            const response = await fetch(imageUri);
            const blob = await response.blob();
            
            imageFormData.append('file', blob, fileName);
            
            const imageResponse = await fetch(`https://tt.owohappy.com:8080/user/${userid}/updatePicture?access_token=${access_token}`, {
                method: 'POST',
                // Don't set Content-Type manually for FormData
                // The fetch API will add the boundary parameter automatically
                body: imageFormData,
            });
            
            if (!imageResponse.ok) {
                throw new Error('Failed to upload profile image');
            }
            
            return imageResponse.json();
        }
        const response = await fetch(`https://tt.owohappy.com:8080/user/${userid}/updateData?access_token=${access_token}&userID=${userid}`, {
            method: 'POST',
            headers: {
                'field': 'name',
                'data': 'Lucas Roeder',
            },
            body: data,
        });
        
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        
        await response.json();
        
        // Update profile image if provided
       
        
        return { success: true };
    } catch (error) {
        console.error('Profile update error:', error);
        throw error;
    }
};

export default function Settings() {
    const [userData, setUserData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    
    React.useEffect(() => {
      getUserData().then(data => setUserData(data));
      setLoading(false);
    }, []);
    
    const { emailorg, id: userID, email_verified, nameorg, phonenumberorg, address, created_at, email_verified_at, mfa, pfp_url, points } = userData || {};
        
    const [name, setName] = useState('');
    const [phonenumber, setPhonenumber] = useState('');
    const [email, setEmail] = useState('');
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [image, setImage] = useState<string | null>(null);
    
    const toggleDrawer = () => {
        setDrawerOpen((prev: boolean) => !prev);
    };
    
    const handleUpdate = async () => {
        setLoading(true);
        
        try {
            const formData = new FormData();
            
            // Add profile data to formData if needed
            if (name) formData.append('name', name);
            if (phonenumber) formData.append('phonenumber', phonenumber);
            if (email) formData.append('email', email);
            
            // Call updateProfile with both data and image
            await updateProfile(formData, userID, image);
            
            Alert.alert('Success', 'Profile updated successfully!');
        } catch (error) {
            console.error('Update error:', error);
            Alert.alert('Error', 'Failed to update profile.');
        } finally {
            setLoading(false);
        }
    };
    
    const router = useRouter();

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
    profilePicButton: {
        width: 100,
        height: 100,
        borderRadius: 50,
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