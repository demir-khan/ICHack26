import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS, globalStyles } from '../styles/theme';

const RestaurantCard = ({ restaurant, onPress }) => {
  return (
    <TouchableOpacity 
      activeOpacity={0.7} 
      style={globalStyles.card} 
      onPress={onPress}
    >
      {/* Image with Gradient Overlay Effect (simulated via background) */}
      <View style={styles.imageWrapper}>
        <Image 
          source={{ uri: restaurant.photoUrl || 'https://via.placeholder.com/400' }} 
          style={styles.image} 
          resizeMode="cover"
        />
        {/* Open Badge */}
        {restaurant.isOpen && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>OPEN</Text>
          </View>
        )}
      </View>

      <View style={styles.content}>
        <View style={{ flex: 1 }}>
          <Text style={globalStyles.h2} numberOfLines={1}>{restaurant.name}</Text>
          <Text style={globalStyles.body} numberOfLines={1}>
            {restaurant.vicinity || restaurant.address}
          </Text>
        </View>
        
        {/* Rating Block */}
        <View style={styles.ratingBlock}>
          <Text style={styles.ratingScore}>{restaurant.rating}</Text>
          <Text style={styles.ratingStar}>★</Text>
        </View>
      </View>

      {/* Footer Info */}
      <View style={styles.footer}>
        <View style={styles.pill}>
          <Text style={styles.pillText}>📍 {restaurant.distance || 'Unknown'}</Text>
        </View>
        <View style={styles.pill}>
          <Text style={styles.pillText}>🚗 {restaurant.travelTime || 'N/A'}</Text>
        </View>
        {/* Call to Action hint */}
        <Text style={{ marginLeft: 'auto', color: COLORS.primary, fontSize: 12, fontWeight: 'bold' }}>
          TAP TO MAP →
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  imageWrapper: {
    height: 140,
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
    backgroundColor: '#000', // Placeholder bg
  },
  image: { width: '100%', height: '100%', opacity: 0.9 }, // Slight dim for vibe
  badge: {
    position: 'absolute',
    top: 8, left: 8,
    backgroundColor: COLORS.success,
    paddingHorizontal: 8, paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: { color: 'black', fontWeight: 'bold', fontSize: 10 },
  content: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  ratingBlock: { 
    flexDirection: 'row', 
    backgroundColor: 'rgba(255,255,255,0.1)', 
    padding: 6, 
    borderRadius: 8,
    alignItems: 'center',
    gap: 4
  },
  ratingScore: { color: COLORS.text, fontWeight: 'bold', fontSize: 14 },
  ratingStar: { color: COLORS.primary, fontSize: 12 },
  footer: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  pill: { 
    backgroundColor: 'rgba(255,255,255,0.05)', 
    paddingHorizontal: 8, 
    paddingVertical: 4, 
    borderRadius: 6 
  },
  pillText: { color: COLORS.textDim, fontSize: 12 }
});

export default RestaurantCard;