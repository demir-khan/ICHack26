import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';

// Context
import { FavoritesProvider } from './context/FavoritesContext';

// Screens
import FavoritesScreen from './screens/FavoritesScreen';
import HomeScreen from './screens/HomeScreen';
import LocalFoodScreen from './screens/LocalFoodScreen';
import MenuScreen from './screens/MenuScreen';

// Theme
import { COLORS } from './styles/theme';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <FavoritesProvider>
      <NavigationContainer>
        <StatusBar style="dark" />
        <Stack.Navigator
          screenOptions={{
            headerStyle: { backgroundColor: COLORS.bg },
            headerTintColor: COLORS.text,
            headerTitleStyle: { fontWeight: '800', fontSize: 20 },
            headerShadowVisible: false, // Clean, flat look
            headerBackTitleVisible: false, // Just the arrow
          }}
        >
          {/* THE DASHBOARD */}
          <Stack.Screen 
            name="Home" 
            component={HomeScreen} 
            options={{ headerShown: false }} // Hide header for the "Splash" look
          />

          {/* OTHER SCREENS */}
          <Stack.Screen 
            name="Find Food" 
            component={LocalFoodScreen} 
            options={{ title: 'Find Food' }}
          />
          
          <Stack.Screen 
            name="Menulator" 
            component={MenuScreen} 
            options={{ title: 'Scanner' }}
          />
          
          <Stack.Screen 
            name="Favorites" 
            component={FavoritesScreen} 
            options={{ title: 'Favourites' }}
          />

        </Stack.Navigator>
      </NavigationContainer>
    </FavoritesProvider>
  );
}