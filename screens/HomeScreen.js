import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS, globalStyles } from '../styles/theme';

const MenuButton = ({ title, subtitle, icon, color, onPress }) => (
  <TouchableOpacity 
    style={[styles.menuBtn, { borderLeftColor: color, borderLeftWidth: 4 }]} 
    onPress={onPress}
    activeOpacity={0.8}
  >
    <View style={[styles.iconBox, { backgroundColor: color }]}>
      <Ionicons name={icon} size={28} color="white" />
    </View>
    <View style={{ flex: 1 }}>
      <Text style={styles.btnTitle}>{title}</Text>
      <Text style={styles.btnSub}>{subtitle}</Text>
    </View>
    <Ionicons name="chevron-forward" size={24} color={COLORS.textDim} />
  </TouchableOpacity>
);

export default function HomeScreen({ navigation }) {
  return (
    <SafeAreaView style={globalStyles.screenContainer}>
      <View style={styles.container}>
        
        {/* HERO HEADER */}
        <View style={styles.header}>
          <Text style={styles.logo}>Menulator</Text>
          <Text style={styles.tagline}>Scan. Eat. Repeat.</Text>
        </View>

        {/* MENU OPTIONS */}
        <View style={styles.menuList}>
          
          <MenuButton 
            title="Take Photo of Menu"
            subtitle="Instant AI translation & narration"
            icon="camera"
            color="#FF4D4D" // Red Accent
            onPress={() => navigation.navigate('Menulator', { mode: 'camera' })}
          />

          <MenuButton 
            title="Open Gallery"
            subtitle="Import a menu screenshot"
            icon="images"
            color="#34C759" // Green Accent
            onPress={() => navigation.navigate('Menulator', { mode: 'gallery' })}
          />

          <MenuButton 
            title="Find Local Places"
            subtitle="Restaurants sorted by distance"
            icon="location"
            color="#007AFF" // Blue Accent
            onPress={() => navigation.navigate('Find Food')}
          />

          <MenuButton 
            title="Favourite Places"
            subtitle="Your saved spots"
            icon="heart"
            color="#FFD700" // Gold Accent
            onPress={() => navigation.navigate('Favorites')}
          />

        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: { marginTop: 40, marginBottom: 40 },
  logo: { fontSize: 42, fontWeight: '900', color: COLORS.text, letterSpacing: -1 },
  tagline: { fontSize: 18, color: COLORS.textDim, marginTop: 5 },
  menuList: { gap: 16 },
  
  // Button Styles
  menuBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 16,
    gap: 16,
    // Shadow
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  iconBox: {
    width: 50, height: 50,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnTitle: { fontSize: 18, fontWeight: '700', color: COLORS.text },
  btnSub: { fontSize: 13, color: COLORS.textDim, marginTop: 2 },
});