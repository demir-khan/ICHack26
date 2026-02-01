// screens/HomeScreen.js
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { parseMenuFromImage } from '../services/api'; // Make sure this path is correct

export default function HomeScreen() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);

  // 1. Function to Pick Image from Gallery
  const pickImage = async () => {
    // Request permission (optional but good practice)
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert("Permission Required", "You need to allow access to photos to scan menus.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true, // Lets you crop the menu
      aspect: [4, 3],
      quality: 0.2,        // <--- THE MAGIC FIX: Reduces size to prevent crashes
      base64: true,        // <--- REQUIRED: API needs this string
    });

    if (!result.canceled) {
      handleImageScanned(result.assets[0].base64);
    }
  };

  // 2. Function to Take Photo with Camera
  const takePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert("Permission Required", "You need to allow camera access.");
      return;
    }

    // In screens/HomeScreen.js

    const result = await ImagePicker.launchCameraAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [4, 3],
    quality: 0.2,          // <--- REDUCED to 0.2 (20% quality)
    base64: true,          // <--- Kept this
    });

    if (!result.canceled) {
      handleImageScanned(result.assets[0].base64);
    }
  };

  // 3. Process the Image
  const handleImageScanned = async (base64) => {
    setLoading(true);
    try {
      // Call your API service
      const menuItems = await parseMenuFromImage(base64);

      if (menuItems && menuItems.length > 0) {
        // Success! Go to Menu Screen
        navigation.navigate('Menu', { menuItems });
      } else {
        Alert.alert("Scan Failed", "Could not read any items. Try a clearer photo.");
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong while scanning.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.title}>Menu Scanner</Text>
        <Text style={styles.subtitle}>Take a photo of any menu to digitize it.</Text>
      </View>

      {/* Main Action Area */}
      <View style={styles.actionContainer}>
        {loading ? (
          <View style={styles.loadingBox}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={styles.loadingText}>Reading Menu...</Text>
            <Text style={styles.loadingSubtext}>(This uses AI, give it a few seconds)</Text>
          </View>
        ) : (
          <>
            <TouchableOpacity style={styles.buttonMain} onPress={takePhoto}>
              <Text style={styles.buttonText}>📸 Take Photo</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.buttonSecondary} onPress={pickImage}>
              <Text style={styles.buttonTextSecondary}>Upload from Gallery</Text>
            </TouchableOpacity>

            <TouchableOpacity 
                style={styles.buttonGold} 
                onPress={() => navigation.navigate('LocalFood')}
                >
                <Text style={styles.buttonTextGold}>✨ Local Recommended Food</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      {/* Footer Info */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Powered by GPT-4o & Pexels</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7', // iOS Light Gray
    padding: 20,
  },
  header: {
    marginTop: 60,
    marginBottom: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#000',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  actionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },
  buttonMain: {
    backgroundColor: '#007AFF', // iOS Blue
    paddingVertical: 18,
    paddingHorizontal: 40,
    borderRadius: 16,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonSecondary: {
    backgroundColor: '#fff',
    paddingVertical: 18,
    paddingHorizontal: 40,
    borderRadius: 16,
    width: '100%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  // Add this to styles:
  buttonGold: {
    backgroundColor: '#FFD700', // Gold
    paddingVertical: 18,
    paddingHorizontal: 40,
    borderRadius: 16,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 5,
    marginTop: 10, // Spacing from the other buttons
  },
  buttonTextGold: {
    color: '#000', // Black text looks best on Gold
    fontSize: 18,
    fontWeight: '700',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  buttonTextSecondary: {
    color: '#007AFF',
    fontSize: 18,
    fontWeight: '600',
  },
  loadingBox: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 20,
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  loadingSubtext: {
    marginTop: 8,
    fontSize: 14,
    color: '#888',
  },
  footer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  footerText: {
    color: '#aaa',
    fontSize: 12,
  },
});