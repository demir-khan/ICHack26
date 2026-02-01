import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useState } from 'react';
import {
    ActivityIndicator, Alert,
    FlatList,
    KeyboardAvoidingView,
    Linking,
    Platform,
    SafeAreaView,
    Text, TextInput, TouchableOpacity,
    View
} from 'react-native';
import { findLocalFood } from '../services/api';
import { COLORS, globalStyles } from '../styles/theme';
import RestaurantCard from './RestaurantCard';

export default function LocalFoodScreen() {
  const [preferences, setPreferences] = useState('');
  const [locationInput, setLocationInput] = useState('');
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(false);

  // Helper to parse distance for sorting
  const parseDistance = (distStr) => {
    if (!distStr) return 99999;
    // Extract number from "1.2 km"
    const num = parseFloat(distStr.replace(/[^\d.]/g, ''));
    return isNaN(num) ? 99999 : num;
  };

  const handleFindFood = async () => {
    if (!locationInput) return Alert.alert("Location Missing", "Press GPS or type a location.");
    
    setLoading(true);
    try {
      const query = preferences || "Best food"; 
      const results = await findLocalFood(query, locationInput);
      
      // SORT BY DISTANCE
      const sorted = results.sort((a, b) => {
        return parseDistance(a.distance) - parseDistance(b.distance);
      });

      setRestaurants(sorted);
    } catch (error) {
      Alert.alert("Error", "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleGetLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') return Alert.alert("Permission Denied");

    setLoading(true);
    try {
      let location = await Location.getCurrentPositionAsync({});
      // Ensure no spaces to keep Google API happy
      const locString = `${location.coords.latitude},${location.coords.longitude}`;
      setLocationInput(locString);
    } catch (error) {
      Alert.alert("Error", "Could not fetch location.");
    } finally {
      setLoading(false);
    }
  };

  const openMap = (name, address) => {
    const query = encodeURIComponent(`${name} ${address}`);
    Linking.openURL(Platform.select({ ios: `maps:0,0?q=${query}`, android: `geo:0,0?q=${query}` }));
  };

  return (
    <SafeAreaView style={globalStyles.screenContainer}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1, paddingHorizontal: 16 }}>
        
        {/* INPUT FORM */}
        <View style={{ marginTop: 20 }}>
          <Text style={styles.label}>WHAT ARE YOU CRAVING?</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Italian, Sushi, Cheap Eats..."
            placeholderTextColor={COLORS.textDim}
            value={preferences}
            onChangeText={setPreferences}
          />

          <Text style={styles.label}>NEAR WHERE?</Text>
          <View style={{ flexDirection: 'row', gap: 10, marginBottom: 20 }}>
            <TextInput
              style={[styles.input, { flex: 1, marginBottom: 0 }]}
              placeholder="Postcode or GPS"
              placeholderTextColor={COLORS.textDim}
              value={locationInput}
              onChangeText={setLocationInput}
            />
            <TouchableOpacity onPress={handleGetLocation} style={styles.gpsBtn}>
              <Ionicons name="navigate" size={24} color="white" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={globalStyles.primaryButton} onPress={handleFindFood} disabled={loading}>
            {loading ? <ActivityIndicator color="white" /> : <Text style={globalStyles.buttonText}>FIND RESTAURANTS</Text>}
          </TouchableOpacity>
        </View>

        {/* RESULTS LIST */}
        <View style={{ marginTop: 20, flex: 1 }}>
          <FlatList
            data={restaurants}
            keyExtractor={(item) => item.place_id || item.id}
            contentContainerStyle={{ paddingBottom: 50 }}
            renderItem={({ item }) => (
              <RestaurantCard 
                restaurant={item} 
                onPress={() => openMap(item.name, item.vicinity || item.address)} 
              />
            )}
            ListEmptyComponent={
              !loading && (
                <View style={{ alignItems: 'center', marginTop: 40, opacity: 0.5 }}>
                  <Ionicons name="fast-food-outline" size={60} color={COLORS.textDim} />
                  <Text style={{ marginTop: 10, color: COLORS.textDim }}>Ready to search.</Text>
                </View>
              )
            }
          />
        </View>

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = {
  label: { fontSize: 12, fontWeight: '800', color: COLORS.textDim, marginBottom: 6, marginLeft: 4 },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: COLORS.text, // Ensures text is visible (Black)
    marginBottom: 16,
  },
  gpsBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    width: 54,
    alignItems: 'center',
    justifyContent: 'center',
  },
};