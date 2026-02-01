import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system/legacy';
import * as ImagePicker from 'expo-image-picker';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator, Alert,
    FlatList,
    Image,
    SafeAreaView, StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

// Internal Imports
import { fetchItemImage, generateMenuStory, parseMenuFromImage } from '../services/api'; // Added fetchItemImage
import { COLORS, globalStyles } from '../styles/theme';
import MenuItem from './MenuItem';

const MenuScreen = ({ route, navigation }) => {
  const [menuItems, setMenuItems] = useState([]); 
  const [loading, setLoading] = useState(false);  
  const [basket, setBasket] = useState({});       

  // Audio States
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioLoading, setAudioLoading] = useState(false);
  const [sound, setSound] = useState();

  // --- AUTO-LAUNCH LOGIC ---
  useEffect(() => {
    if (route.params?.mode === 'camera') {
      takePhoto();
      navigation.setParams({ mode: null });
    } else if (route.params?.mode === 'gallery') {
      pickFromGallery();
      navigation.setParams({ mode: null });
    }
  }, [route.params?.mode]);

  useEffect(() => {
    return sound ? () => { sound.unloadAsync(); } : undefined;
  }, [sound]);

  // --- BASKET TOTAL CALCULATION ---
  const totalPrice = menuItems.reduce((sum, item) => {
    const qty = basket[item.id] || 0;
    return sum + (item.price * qty);
  }, 0);

  const totalItems = Object.values(basket).reduce((a, b) => a + b, 0);

  // --- 1. IMAGE & SCANNING ---
  const handleScan = async (base64) => {
    setLoading(true);
    try {
      // 1. Get Text from GPT
      const items = await parseMenuFromImage(base64);
      
      if (!items || items.length === 0) {
        Alert.alert("No Text Found", "Try a clearer photo.");
        setLoading(false);
        return;
      }

      // 2. Fetch Images for each item (Parallel)
      // This restores the "Photos Element"
      const itemsWithImages = await Promise.all(
        items.map(async (item) => {
          const imageUrl = await fetchItemImage(item.name);
          return { ...item, image: imageUrl };
        })
      );

      setMenuItems(itemsWithImages);

    } catch (error) {
      Alert.alert("Error", "Scanning failed.");
    } finally {
      setLoading(false);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') return Alert.alert("Permission Denied");
    let result = await ImagePicker.launchCameraAsync({ allowsEditing: true, quality: 0.5, base64: true });
    if (!result.canceled) handleScan(result.assets[0].base64);
  };

  const pickFromGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') return Alert.alert("Permission Denied");
    let result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, quality: 0.5, base64: true });
    if (!result.canceled) handleScan(result.assets[0].base64);
  };

  // --- 2. AUDIO LOGIC ---
  const handlePlayNarration = async () => {
    if (isPlaying) { sound?.stopAsync(); setIsPlaying(false); return; }
    setAudioLoading(true);
    try {
      if (menuItems.length === 0) return;
      const storyText = await generateMenuStory(menuItems);
      const uri = `https://api.elevenlabs.io/v1/text-to-speech/pFZP5JQG7iQjIQuC4Bku/stream`;
      const fileUri = FileSystem.documentDirectory + 'narration.mp3';
      const apiKey = process.env.ELEVEN_LABS_API_KEY; 

      const downloadRes = await FileSystem.downloadAsync(uri, fileUri, {
        headers: { 'xi-api-key': apiKey, 'Content-Type': 'application/json' },
        httpMethod: 'POST',
        body: JSON.stringify({ text: storyText, model_id: "eleven_monolingual_v1" })
      });

      if (downloadRes.status !== 200) throw new Error("API Failed");

      const { sound: newSound } = await Audio.Sound.createAsync({ uri: fileUri });
      setSound(newSound);
      await newSound.playAsync();
      setIsPlaying(true);
      newSound.setOnPlaybackStatusUpdate((s) => { if (s.didJustFinish) setIsPlaying(false); });
    } catch (error) {
      Alert.alert("Narration Error", "Could not play audio.");
    } finally {
      setAudioLoading(false);
    }
  };

  const updateQuantity = (id, change) => {
    setBasket(prev => ({ ...prev, [id]: Math.max(0, (prev[id] || 0) + change) }));
  };

  // --- RENDER ---
  return (
    <SafeAreaView style={globalStyles.screenContainer}>
      <View style={{ padding: 16, flex: 1 }}>

        {/* HEADER */}
        <View style={styles.headerRow}>
          <Text style={globalStyles.h1}>Scanner</Text>
          {menuItems.length > 0 && (
            <TouchableOpacity style={styles.playButton} onPress={handlePlayNarration} disabled={audioLoading}>
              {audioLoading ? <ActivityIndicator color="white" size="small" /> : <Ionicons name={isPlaying ? "stop" : "play"} size={20} color="white" />}
              <Text style={styles.playText}>{audioLoading ? " Loading..." : (isPlaying ? " Stop" : " Narrate")}</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* LOADING */}
        {loading && (
          <View style={styles.centerBox}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={{ marginTop: 16, color: COLORS.textDim }}>Analysing Menu & Finding Photos...</Text>
          </View>
        )}

        {/* EMPTY STATE */}
        {!loading && menuItems.length === 0 && (
          <View style={styles.centerBox}>
            <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/512/1042/1042390.png' }} style={styles.placeholderImg} />
            <Text style={globalStyles.h2}>Scan a Menu</Text>
            <Text style={styles.hintText}>Take a photo to translate & see dish images.</Text>
            <View style={{ width: '100%', gap: 16, marginTop: 20 }}>
              <TouchableOpacity style={styles.actionBtn} onPress={takePhoto}>
                <Ionicons name="camera" size={24} color="white" />
                <Text style={globalStyles.buttonText}>TAKE PHOTO</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionBtn, { backgroundColor: COLORS.text }]} onPress={pickFromGallery}>
                <Ionicons name="images" size={24} color="white" />
                <Text style={globalStyles.buttonText}>PICK FROM GALLERY</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* LIST */}
        {!loading && menuItems.length > 0 && (
          <FlatList
            data={menuItems}
            keyExtractor={(item) => item.id ? item.id.toString() : Math.random().toString()}
            renderItem={({ item }) => (
              <MenuItem 
                item={item} 
                quantity={basket[item.id] || 0} 
                onUpdateQuantity={updateQuantity} 
              />
            )}
            contentContainerStyle={{ paddingBottom: 100 }} // Space for floating bar
          />
        )}

        {/* FLOATING BASKET SUMMARY (Restored!) */}
        {totalItems > 0 && (
          <View style={styles.floatBar}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <View style={styles.badge}><Text style={styles.badgeText}>{totalItems}</Text></View>
              <Text style={styles.floatText}>Basket Total</Text>
            </View>
            <Text style={styles.floatPrice}>£{totalPrice.toFixed(2)}</Text>
          </View>
        )}

      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  playButton: { flexDirection: 'row', backgroundColor: COLORS.primary, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, alignItems: 'center', gap: 6 },
  playText: { color: 'white', fontWeight: 'bold', fontSize: 14 },
  centerBox: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 },
  placeholderImg: { width: 120, height: 120, marginBottom: 30, opacity: 0.5, tintColor: COLORS.textDim },
  hintText: { textAlign: 'center', color: COLORS.textDim, marginBottom: 20 },
  actionBtn: { flexDirection: 'row', gap: 10, backgroundColor: COLORS.primary, borderRadius: 12, padding: 16, alignItems: 'center', justifyContent: 'center' },
  
  // Floating Bar Styles
  floatBar: {
    position: 'absolute', bottom: 20, left: 20, right: 20,
    backgroundColor: COLORS.primary, // Black
    borderRadius: 16, padding: 16,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 10, elevation: 10,
  },
  floatText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  floatPrice: { color: 'white', fontWeight: '900', fontSize: 18 },
  badge: { backgroundColor: '#FFD700', borderRadius: 10, width: 24, height: 24, alignItems: 'center', justifyContent: 'center' },
  badgeText: { fontWeight: 'bold', fontSize: 12, color: 'black' },
});

export default MenuScreen;