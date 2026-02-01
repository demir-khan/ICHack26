import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';

// Context
import { FavoritesProvider } from './src/context/FavoritesContext';

// Screens
import FavoritesScreen from './src/screens/FavoritesScreen'; // "Favorites"
import LocalFoodScreen from './src/screens/LocalFoodScreen'; // "Find Food"
import MenuScreen from './src/screens/MenuScreen'; // "Menulator" (Scanner)

// Theme
import { COLORS } from './src/styles/theme';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <FavoritesProvider>
      <NavigationContainer>
        {/* Status Bar: Dark text for Light Mode */}
        <StatusBar style="dark" />
        
        <Tab.Navigator
          screenOptions={({ route }) => ({
            headerShown: false, // We use our own custom headers in screens
            tabBarStyle: {
              backgroundColor: COLORS.bg,
              borderTopColor: COLORS.border,
              height: 60,
              paddingBottom: 8,
              paddingTop: 8,
            },
            tabBarActiveTintColor: COLORS.primary, // Black (Modern)
            tabBarInactiveTintColor: COLORS.textDim, // Grey
            tabBarLabelStyle: {
              fontSize: 12,
              fontWeight: '600',
            },
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;

              if (route.name === 'Find Food') {
                iconName = focused ? 'search' : 'search-outline';
              } else if (route.name === 'Menulator') {
                iconName = focused ? 'scan-circle' : 'scan-outline';
              } else if (route.name === 'Favorites') {
                iconName = focused ? 'heart' : 'heart-outline';
              }

              // Special "Big Icon" for the Scanner in the middle
              if (route.name === 'Menulator') {
                return <Ionicons name={iconName} size={32} color={color} />;
              }
              
              return <Ionicons name={iconName} size={size} color={color} />;
            },
          })}
        >
          <Tab.Screen 
            name="Find Food" 
            component={LocalFoodScreen} 
            options={{ title: 'Explore' }}
          />
          
          <Tab.Screen 
            name="Menulator" 
            component={MenuScreen} 
            options={{ title: 'Scan Menu' }}
          />
          
          <Tab.Screen 
            name="Favorites" 
            component={FavoritesScreen} 
            options={{ title: 'Saved' }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </FavoritesProvider>
  );
}