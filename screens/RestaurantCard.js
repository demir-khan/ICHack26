import { Ionicons } from '@expo/vector-icons'; // Heart Icon
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useFavorites } from '../context/FavoritesContext'; // Import Context
import { COLORS, globalStyles } from '../styles/theme';

const RestaurantCard = ({ restaurant, onPress }) => {
  const { toggleFavorite, isFavorite } = useFavorites();
  const liked = isFavorite(restaurant.place_id);

  return (
    <TouchableOpacity activeOpacity={0.9} style={globalStyles.card} onPress={onPress}>
      
      {/* Image Header */}
      <View style={styles.imageWrapper}>
        <Image 
          source={{ uri: restaurant.photoUrl || 'https://via.placeholder.com/400' }} 
          style={styles.image} 
          resizeMode="cover"
        />
        
        {/* === THE HEART BUTTON === */}
        <TouchableOpacity 
          style={styles.heartButton} 
          onPress={() => toggleFavorite(restaurant)}
        >
          <Ionicons 
            name={liked ? "heart" : "heart-outline"} 
            size={24} 
            color={liked ? COLORS.accent : "white"} 
          />
        </TouchableOpacity>

        {restaurant.isOpen && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>OPEN</Text>
          </View>
        )}
      </View>

      {/* Info Content */}
      <View style={styles.content}>
        <View style={{ flex: 1 }}>
          <Text style={globalStyles.h2} numberOfLines={1}>{restaurant.name}</Text>
          <Text style={globalStyles.body} numberOfLines={1}>
            {restaurant.vicinity || restaurant.address}
          </Text>
        </View>
        <View style={styles.ratingBlock}>
          <Text style={styles.ratingScore}>{restaurant.rating}</Text>
          <Text style={{ color: '#FFD700', fontSize: 12 }}>★</Text>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.pill}><Text style={styles.pillText}>{restaurant.distance}</Text></View>
        <View style={styles.pill}><Text style={styles.pillText}>{restaurant.travelTime}</Text></View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  imageWrapper: {
    height: 150,
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#F2F2F7',
  },
  image: { width: '100%', height: '100%' },
  // Heart Button Style
  heartButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  badge: {
    position: 'absolute',
    top: 10, left: 10,
    backgroundColor: COLORS.success,
    paddingHorizontal: 8, paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: { color: 'white', fontWeight: 'bold', fontSize: 10 },
  content: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  ratingBlock: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  ratingScore: { fontWeight: 'bold', fontSize: 14, color: COLORS.text },
  footer: { flexDirection: 'row', gap: 8 },
  pill: { backgroundColor: '#F2F2F7', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  pillText: { color: COLORS.textDim, fontSize: 12, fontWeight: '500' }
});

export default RestaurantCard;