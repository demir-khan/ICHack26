// screens/CartScreen.js
import { Alert, FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useCart } from '../context/CartContext';

export default function CartScreen() {
  const { cart, removeFromCart, getTotalPrice } = useCart();

  const handleCheckout = () => {
    Alert.alert("Order Sent!", "Kitchen is preparing your food.");
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.headerTitle}>Your Basket</Text>
      
      {cart.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Your basket is empty.</Text>
        </View>
      ) : (
        <>
          <FlatList
            data={cart}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => (
              <View style={styles.row}>
                <View style={{flex: 1}}>
                  <Text style={styles.name}>{item.name}</Text>
                  <Text style={styles.desc}>{item.description}</Text>
                </View>
                <View style={{alignItems: 'flex-end'}}>
                  <Text style={styles.price}>£{item.price.toFixed(2)}</Text>
                  <TouchableOpacity onPress={() => removeFromCart(index)}>
                    <Text style={styles.removeText}>Remove</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
          
          <View style={styles.footer}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total:</Text>
              <Text style={styles.totalAmount}>£{getTotalPrice().toFixed(2)}</Text>
            </View>
            <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
              <Text style={styles.checkoutText}>Checkout</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  headerTitle: { fontSize: 28, fontWeight: '800', margin: 20 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { fontSize: 18, color: '#888' },
  row: { 
    flexDirection: 'row', padding: 15, borderBottomWidth: 1, borderBottomColor: '#eee',
    justifyContent: 'space-between', alignItems: 'center'
  },
  name: { fontSize: 16, fontWeight: '600' },
  desc: { fontSize: 12, color: '#888', marginTop: 4 },
  price: { fontSize: 16, fontWeight: '600' },
  removeText: { color: 'red', fontSize: 12, marginTop: 4 },
  footer: { padding: 20, borderTopWidth: 1, borderTopColor: '#eee' },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  totalLabel: { fontSize: 20, fontWeight: 'bold' },
  totalAmount: { fontSize: 20, fontWeight: 'bold', color: '#007AFF' },
  checkoutButton: { backgroundColor: '#000', padding: 18, borderRadius: 12, alignItems: 'center' },
  checkoutText: { color: '#fff', fontSize: 18, fontWeight: 'bold' }
});