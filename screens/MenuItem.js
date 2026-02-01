import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { triggerHaptic } from '../services/haptics'; // Ensure you created this service from the previous step
import { COLORS, globalStyles } from '../styles/theme';

const MenuItem = ({ item, quantity, onUpdateQuantity }) => {
  
  const handleInc = () => {
    triggerHaptic('light');
    onUpdateQuantity(item.id, 1);
  };

  const handleDec = () => {
    triggerHaptic('light');
    onUpdateQuantity(item.id, -1);
  };

  return (
    <View style={[globalStyles.forkCard, styles.container]}>
      
      {/* Text Info */}
      <View style={{ flex: 1, paddingRight: 10 }}>
        <Text style={[globalStyles.headerText, { fontSize: 18 }]}>{item.name}</Text>
        <Text style={[globalStyles.subText, { fontSize: 12, marginBottom: 8 }]}>
          {item.description || "Freshly prepared for you."}
        </Text>
        <Text style={{ color: COLORS.neon, fontWeight: 'bold', fontSize: 16 }}>
          £{item.price ? item.price.toFixed(2) : '0.00'}
        </Text>
      </View>

      {/* Quantity Selector */}
      <View style={styles.actionContainer}>
        {quantity === 0 ? (
          <TouchableOpacity 
            style={styles.addButton} 
            onPress={handleInc}
          >
            <Text style={styles.addButtonText}>ADD</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.qtyWrapper}>
            <TouchableOpacity onPress={handleDec} style={styles.qtyBtn}>
              <Text style={styles.qtyBtnText}>-</Text>
            </TouchableOpacity>
            
            <Text style={styles.qtyText}>{quantity}</Text>
            
            <TouchableOpacity onPress={handleInc} style={styles.qtyBtn}>
              <Text style={styles.qtyBtnText}>+</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12 },
  actionContainer: { alignItems: 'center', justifyContent: 'center' },
  addButton: {
    backgroundColor: '#fff',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  addButtonText: { color: '#000', fontWeight: 'bold', fontSize: 12 },
  qtyWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    padding: 2,
  },
  qtyBtn: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyBtnText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  qtyText: { color: COLORS.neon, fontSize: 16, fontWeight: 'bold', marginHorizontal: 4 }
});

export default MenuItem;