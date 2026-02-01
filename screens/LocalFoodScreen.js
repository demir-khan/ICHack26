import * as Location from 'expo-location';
import { useState } from 'react';
import {
    ActivityIndicator, Alert,
    FlatList,
    KeyboardAvoidingView,
    Linking,
    Platform,
    SafeAreaView,
    StyleSheet,
    Text, TextInput, TouchableOpacity,
    View
} from 'react-native';
import { findLocalFood } from '../services/api';

export default function LocalFoodScreen() {
  const [preferences, setPreferences] = useState('');
  const [locationInput, setLocationInput] = useState('');
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);

  // 1. Get Current Location
  const handleGetLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert("Permission Denied", "Allow location access to find nearby food.");
      return;
    }

    setLoading(true);
    try {
      let location = await Location.getCurrentPositionAsync({});
      // We convert coords to a string so GPT understands it
      const locString = `${location.coords.latitude}, ${location.coords.longitude}`;
      setLocationInput(locString); 
      Alert.alert("Location Found", "Coordinates added! Now press 'Find Food'.");
    } catch (error) {
      Alert.alert("Error", "Could not fetch location.");
    } finally {
      setLoading(false);
    }
  };

  // 2. Ask AI for Recommendations
  const handleFindFood = async () => {
    if (!locationInput) {
      Alert.alert("Missing Info", "Please enter a postcode or use the location button.");
      return;
    }
    
    setLoading(true);
    try {
      const results = await findLocalFood(preferences || "Any good food", locationInput);
      setRecommendations(results);
      if (results.length === 0) Alert.alert("No Results", "The AI couldn't find anything. Try a broader location.");
    } catch (error) {
      Alert.alert("Error", "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  // 3. Open in Maps (Google or Apple)
  const openMap = (address) => {
    const query = encodeURIComponent(address);
    const url = Platform.select({
      ios: `maps:0,0?q=${query}`,
      android: `geo:0,0?q=${query}`,
    });
    Linking.openURL(url);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{flex:1}}>
        <View style={styles.header}>
          <Text style={styles.title}>📍 Local Food Gem</Text>
          <Text style={styles.subtitle}>Find authentic eats near you.</Text>
        </View>

        {/* INPUT SECTION */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>What are you craving?</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Spicy Noodles, Cheap Tacos..."
            value={preferences}
            onChangeText={setPreferences}
          />

          <Text style={styles.label}>Where are you?</Text>
          <View style={styles.locationRow}>
            <TextInput
              style={[styles.input, { flex: 1, marginBottom: 0 }]}
              placeholder="Postcode or Area"
              value={locationInput}
              onChangeText={setLocationInput}
            />
            <TouchableOpacity style={styles.gpsButton} onPress={handleGetLocation}>
              <Text style={styles.gpsIcon}>📍</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.searchButton} onPress={handleFindFood} disabled={loading}>
            {loading ? <ActivityIndicator color="#000" /> : <Text style={styles.searchText}>Find Food</Text>}
          </TouchableOpacity>
        </View>

        {/* RESULTS LIST */}
        <FlatList
          data={recommendations}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={{ padding: 20 }}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.card} onPress={() => openMap(item.name + " " + item.address)}>
              <View>
                <Text style={styles.placeName}>{item.name}</Text>
                <Text style={styles.cuisine}>{item.cuisine}</Text>
                <Text style={styles.desc}>{item.description}</Text>
                <Text style={styles.address}>📍 {item.address}</Text>
              </View>
              <Text style={styles.arrow}>→</Text>
            </TouchableOpacity>
          )}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F2F2F7' },
  header: { padding: 20, paddingTop: 10 },
  title: { fontSize: 28, fontWeight: '800', color: '#333' },
  subtitle: { fontSize: 16, color: '#666', marginTop: 5 },
  inputContainer: { backgroundColor: '#fff', margin: 20, padding: 20, borderRadius: 16, marginTop: 0 },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 8, color: '#333' },
  input: { backgroundColor: '#F0F0F5', padding: 12, borderRadius: 10, fontSize: 16, marginBottom: 15 },
  locationRow: { flexDirection: 'row', gap: 10, marginBottom: 15 },
  gpsButton: { backgroundColor: '#E1E1EA', width: 50, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  gpsIcon: { fontSize: 20 },
  searchButton: { backgroundColor: '#FFD700', padding: 15, borderRadius: 12, alignItems: 'center' },
  searchText: { fontSize: 18, fontWeight: 'bold', color: '#000' },
  card: { 
    backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 12, flexDirection: 'row', 
    alignItems: 'center', justifyContent: 'space-between',
    shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4, elevation: 2
  },
  placeName: { fontSize: 18, fontWeight: '700' },
  cuisine: { fontSize: 14, color: '#007AFF', fontWeight: '600', marginBottom: 4 },
  desc: { fontSize: 14, color: '#555', marginBottom: 8 },
  address: { fontSize: 12, color: '#888' },
  arrow: { fontSize: 24, color: '#ccc', marginLeft: 10 }
});