import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS } from '../styles/theme';

const MenuItem = ({ item, quantity, onUpdateQuantity }) => {
  
  const handleInc = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onUpdateQuantity(item.id, 1);
  };

  const handleDec = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onUpdateQuantity(item.id, -1);
  };

  return (
    <View style={styles.card}>
      {/* 1. FOOD IMAGE (Restored) */}
      <View style={styles.imageContainer}>
        <Image 
          source={{ uri: item.image || 'https://via.placeholder.com/150' }} 
          style={styles.image} 
          resizeMode="cover"
        />
      </View>

      {/* 2. TEXT INFO */}
      <View style={styles.infoContainer}>
        <Text style={styles.name} numberOfLines={2}>{item.name}</Text>
        <Text style={styles.desc} numberOfLines={2}>
          {item.description || "Deliciously prepared."}
        </Text>
        <Text style={styles.price}>
          {item.price > 0 ? `£${item.price.toFixed(2)}` : ''}
        </Text>
      </View>

      {/* 3. AMAZON QUANTITY SELECTOR */}
      <View style={styles.actionContainer}>
        {quantity === 0 ? (
          <TouchableOpacity style={styles.addButton} onPress={handleInc}>
            <Ionicons name="add" size={20} color="white" />
          </TouchableOpacity>
        ) : (
          <View style={styles.qtyWrapper}>
            <TouchableOpacity onPress={handleDec} style={styles.qtyBtn}>
              <Text style={styles.qtyText}>-</Text>
            </TouchableOpacity>
            
            <Text style={styles.qtyVal}>{quantity}</Text>
            
            <TouchableOpacity onPress={handleInc} style={styles.qtyBtn}>
              <Text style={styles.qtyText}>+</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 12,
    padding: 10,
    alignItems: 'center',
    // Shadow
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5, elevation: 2,
    borderWidth: 1, borderColor: '#F2F2F7',
  },
  imageContainer: {
    width: 70, height: 70, borderRadius: 8, overflow: 'hidden', marginRight: 12,
    backgroundColor: '#F2F2F7',
  },
  image: { width: '100%', height: '100%' },
  infoContainer: { flex: 1, marginRight: 8 },
  name: { fontWeight: '700', fontSize: 15, color: COLORS.text, marginBottom: 2 },
  desc: { fontSize: 12, color: COLORS.textDim, marginBottom: 4 },
  price: { fontWeight: '800', fontSize: 14, color: COLORS.text },
  
  actionContainer: { alignItems: 'flex-end', justifyContent: 'center' },
  addButton: {
    backgroundColor: COLORS.primary, // Black
    width: 36, height: 36, borderRadius: 18,
    alignItems: 'center', justifyContent: 'center',
  },
  qtyWrapper: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#F2F2F7', borderRadius: 20, padding: 2
  },
  qtyBtn: {
    width: 28, height: 28, alignItems: 'center', justifyContent: 'center',
  },
  qtyText: { fontSize: 18, fontWeight: 'bold', color: COLORS.text },
  qtyVal: { fontSize: 14, fontWeight: 'bold', marginHorizontal: 4, minWidth: 14, textAlign: 'center' },
});

export default MenuItem;