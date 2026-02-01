// App.js
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// --- IMPORT SCREENS ---
import CartScreen from './screens/CartScreen';
import HomeScreen from './screens/HomeScreen';
import LocalFoodScreen from './screens/LocalFoodScreen';
import MenuScreen from './screens/MenuScreen';

// --- IMPORT CONTEXT ---
import { CartProvider } from './context/CartContext';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    // 1. Wrap the whole app in CartProvider so the basket works everywhere
    <CartProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          
          {/* HOME SCREEN (Scanner & Main Menu) */}
          <Stack.Screen 
            name="Home" 
            component={HomeScreen} 
            options={{ headerShown: false }} 
          />

          {/* MENU SCREEN (The Digitized Menu) */}
          <Stack.Screen 
            name="Menu" 
            component={MenuScreen} 
            options={{ title: 'Digitized Menu' }} 
          />

          {/* CART SCREEN (Your Basket) */}
          <Stack.Screen 
            name="Cart" 
            component={CartScreen} 
            options={{ title: 'Your Basket' }} 
          />

          {/* LOCAL FOOD SCREEN (The New Golden Button Feature) */}
          <Stack.Screen 
            name="LocalFood" 
            component={LocalFoodScreen} 
            options={{ title: 'Find Authentic Food' }} 
          />

        </Stack.Navigator>
      </NavigationContainer>
    </CartProvider>
  );
}