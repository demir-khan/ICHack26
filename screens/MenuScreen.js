import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av'; // Audio Player
import * as FileSystem from 'expo-file-system'; // To save audio file
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { generateMenuStory } from '../services/api';
import { COLORS, globalStyles } from '../styles/theme';
import MenuItem from './MenuItem';

const MenuScreen = ({ menuItems = [] }) => {
  const [basket, setBasket] = useState({});
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioLoading, setAudioLoading] = useState(false);
  const [sound, setSound] = useState();

  // Clean up sound on unmount
  useEffect(() => {
    return sound ? () => { sound.unloadAsync(); } : undefined;
  }, [sound]);

  // --- AUDIO LOGIC ---
  const handlePlayNarration = async () => {
    if (isPlaying) {
      sound?.stopAsync();
      setIsPlaying(false);
      return;
    }

    setAudioLoading(true);
    try {
      // 1. Get Story Text
      console.log("Generating Story...");
      const storyText = await generateMenuStory(menuItems);
      
      // 2. Get Audio from ElevenLabs (Returns Blob/Buffer)
      console.log("Fetching Audio...");
      // NOTE: For React Native, passing Blob to Sound is hard. 
      // Strategy: We will use the ElevenLabs API to return a DIRECT STREAM if possible, 
      // or we use a temporary workaround for the hackathon by downloading the file.
      
      // -- HACKATHON SHORTCUT FOR AUDIO -- 
      // Instead of the complex API.js blob logic, we will use the URI method directly here
      // This is often more stable for Expo.
      const VOICE_ID = 'pFZP5JQG7iQjIQuC4Bku';
      // Assume you added ELEVEN_LABS_API_KEY to your env
      const uri = `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}/stream`; // /stream endpoint
      
      // We download the stream to a local file
      const fileUri = FileSystem.documentDirectory + 'narration.mp3';
      const downloadRes = await FileSystem.downloadAsync(
        uri,
        fileUri,
        {
          headers: {
            'xi-api-key': process.env.ELEVEN_LABS_API_KEY, // Access env directly or import it
            'Content-Type': 'application/json',
          },
          httpMethod: 'POST',
          body: JSON.stringify({
             text: storyText,
             model_id: "eleven_monolingual_v1"
          })
        }
      );

      // 3. Play the file
      const { sound: newSound } = await Audio.Sound.createAsync({ uri: downloadRes.uri });
      setSound(newSound);
      await newSound.playAsync();
      setIsPlaying(true);
      
      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) setIsPlaying(false);
      });

    } catch (error) {
      console.error("Audio Failed:", error);
      alert("Could not narrate menu.");
    } finally {
      setAudioLoading(false);
    }
  };

  return (
    <SafeAreaView style={globalStyles.screenContainer}>
      <View style={{ padding: 16, flex: 1 }}>
        
        {/* Header with Play Button */}
        <View style={styles.headerRow}>
          <Text style={globalStyles.h1}>Menulator</Text>
          <TouchableOpacity 
            style={styles.playButton} 
            onPress={handlePlayNarration}
            disabled={audioLoading}
          >
            {audioLoading ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <Ionicons name={isPlaying ? "stop" : "play"} size={20} color="white" />
            )}
            <Text style={styles.playText}>
              {audioLoading ? " Loading..." : (isPlaying ? " Stop" : " Narrate")}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Progress Bar (Fake or Real) */}
        {audioLoading && (
          <View style={{ height: 4, backgroundColor: '#E5E5EA', borderRadius: 2, marginBottom: 15 }}>
            <View style={{ width: '50%', height: '100%', backgroundColor: COLORS.loading }} />
          </View>
        )}

        {/* Menu List */}
        <FlatList
          data={menuItems}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <MenuItem item={item} quantity={basket[item.id] || 0} onUpdateQuantity={() => {}} />
          )}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  playButton: {
    flexDirection: 'row',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    alignItems: 'center',
    gap: 6
  },
  playText: { color: 'white', fontWeight: 'bold', fontSize: 14 }
});

export default MenuScreen;