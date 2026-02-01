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

  // --- 1. Map Navigation Logic ---
  const openMap = (name, address) => {
    // Create a query like "Neon Burger 123 Cyber Lane"
    const query = encodeURIComponent(`${name} ${address}`);
    const url = Platform.select({
      ios: `maps:0,0?q=${query}`,
      android: `geo:0,0?q=${query}`,
    });
    Linking.openURL(url).catch(() => {
      Alert.alert("Error", "Could not open maps.");
    });
  };

  const handleGetLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') return Alert.alert("Permission Denied");

    setLoading(true);
    try {
      let location = await Location.getCurrentPositionAsync({});
      const locString = `${location.coords.latitude}, ${location.coords.longitude}`;
      setLocationInput(locString);
    } catch (error) {
      Alert.alert("Error", "Could not fetch location.");
    } finally {
      setLoading(false);
    }
  };

  const handleFindFood = async () => {
    if (!locationInput) return Alert.alert("Location Missing", "Please enter a location.");
    
    setLoading(true);
    try {
      const results = await findLocalFood(preferences, locationInput);
      setRestaurants(results);
    } catch (error) {
      Alert.alert("Error", "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={globalStyles.screenContainer}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1, paddingHorizontal: 16 }}>
        
        {/* Header */}
        <View style={{ marginTop: 20, marginBottom: 20 }}>
          <Text style={globalStyles.h1}>Fork<Text style={{ color: COLORS.primary }}>Cast</Text></Text>
          <Text style={globalStyles.body}>Find the vibe. Navigate there.</Text>
        </View>

        {/* Input Card */}
        <View style={[globalStyles.card, { padding: 20 }]}>
          <Text style={{ color: COLORS.primary, fontWeight: '800', fontSize: 12, marginBottom: 8, letterSpacing: 1 }}>CRAVINGS</Text>
          <TextInput
            style={{ backgroundColor: COLORS.bg, borderRadius: 8, padding: 12, color: 'white', marginBottom: 16, borderWidth: 1, borderColor: COLORS.border }}
            placeholder="e.g. Late night spicy..."
            placeholderTextColor={COLORS.textDim}
            value={preferences}
            onChangeText={setPreferences}
          />

          <Text style={{ color: COLORS.primary, fontWeight: '800', fontSize: 12, marginBottom: 8, letterSpacing: 1 }}>LOCATION</Text>
          <View style={{ flexDirection: 'row', gap: 10, marginBottom: 20 }}>
            <TextInput
              style={{ flex: 1, backgroundColor: COLORS.bg, borderRadius: 8, padding: 12, color: 'white', borderWidth: 1, borderColor: COLORS.border }}
              placeholder="Postcode or Area"
              placeholderTextColor={COLORS.textDim}
              value={locationInput}
              onChangeText={setLocationInput}
            />
            <TouchableOpacity onPress={handleGetLocation} style={{ backgroundColor: COLORS.border, width: 50, borderRadius: 8, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontSize: 20 }}>📍</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={globalStyles.primaryButton} onPress={handleFindFood} disabled={loading}>
            {loading ? <ActivityIndicator color="black" /> : <Text style={globalStyles.buttonText}>Find Food</Text>}
          </TouchableOpacity>
        </View>

        {/* Results */}
        <FlatList
          data={restaurants}
          keyExtractor={(item) => item.place_id || item.id}
          contentContainerStyle={{ paddingBottom: 40 }}
          renderItem={({ item }) => (
            // PASS THE MAP FUNCTION HERE
            <RestaurantCard 
              restaurant={item} 
              onPress={() => openMap(item.name, item.vicinity || item.address)} 
            />
          )}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}