// screens/MenuScreen.js
import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    FlatList,
    Image,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { useCart } from '../context/CartContext';
import { fetchItemImage } from '../services/api'; // We use your Pexels function

// --- COMPONENT FOR SINGLE MENU CARD ---
const MenuItemCard = ({ item }) => {
  const { addToCart } = useCart();
  const [imageUrl, setImageUrl] = useState(null);

  // Load Pexels image when this card appears
  useEffect(() => {
    const loadImage = async () => {
      const url = await fetchItemImage(item.name);
      setImageUrl(url);
    };
    loadImage();
  }, [item.name]);

  const handleAdd = () => {
    addToCart(item);
    Alert.alert("Added", `${item.name} is in your basket.`);
  };

  return (
    <View style={styles.card}>
      {/* Image Section */}
      <Image 
        source={{ uri: imageUrl || 'https://via.placeholder.com/150' }} 
        style={styles.foodImage} 
      />
      
      {/* Text Info */}
      <View style={styles.infoContainer}>
        <View style={styles.headerRow}>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.itemPrice}>£{item.price.toFixed(2)}</Text>
        </View>
        <Text style={styles.itemDescription} numberOfLines={2}>
          {item.description}
        </Text>
        
        {/* Add Button */}
        <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
          <Text style={styles.addButtonText}>Add to Basket</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// --- MAIN SCREEN ---
export default function MenuScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { cart } = useCart();
  const { menuItems } = route.params || {};

  // Header Button to view Basket
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity 
          style={{ marginRight: 15 }} 
          onPress={() => navigation.navigate('Cart')}
        >
          <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#007AFF' }}>
            Basket ({cart.length})
          </Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, cart]);

  if (!menuItems || menuItems.length === 0) {
    return (
      <View style={styles.center}>
        <Text>No items found.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={menuItems}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => <MenuItemCard item={item} />}
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
      />
      
      {/* Floating View Basket Button */}
      {cart.length > 0 && (
        <TouchableOpacity 
          style={styles.floatingButton}
          onPress={() => navigation.navigate('Cart')}
        >
          <Text style={styles.floatingButtonText}>View Basket ({cart.length})</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F2F2F7' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  card: {
    backgroundColor: '#fff', borderRadius: 16, marginBottom: 16, overflow: 'hidden',
    shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5, elevation: 3
  },
  foodImage: { width: '100%', height: 150 }, // Big preview image
  infoContainer: { padding: 16 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  itemName: { fontSize: 18, fontWeight: '700', flex: 1 },
  itemPrice: { fontSize: 18, fontWeight: '700', color: '#007AFF' },
  itemDescription: { fontSize: 14, color: '#666', marginBottom: 12 },
  addButton: {
    backgroundColor: '#007AFF', padding: 10, borderRadius: 8, alignItems: 'center'
  },
  addButtonText: { color: '#fff', fontWeight: '600' },
  floatingButton: {
    position: 'absolute', bottom: 30, left: 20, right: 20,
    backgroundColor: '#34C759', padding: 16, borderRadius: 50, alignItems: 'center',
    shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 5
  },
  floatingButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' }
});