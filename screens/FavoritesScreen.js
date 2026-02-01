import { FlatList, Linking, Platform, SafeAreaView, Text, View } from 'react-native';
import { useFavorites } from '../context/FavoritesContext';
import { COLORS, globalStyles } from '../styles/theme';
import RestaurantCard from './RestaurantCard';

export default function FavoritesScreen() {
  const { favorites } = useFavorites();

  const openMap = (name, address) => {
    const query = encodeURIComponent(`${name} ${address}`);
    Linking.openURL(Platform.select({ ios: `maps:0,0?q=${query}`, android: `geo:0,0?q=${query}` }));
  };

  return (
    <SafeAreaView style={globalStyles.screenContainer}>
      <View style={{ padding: 16, flex: 1 }}>
        <Text style={globalStyles.h1}>Favourite <Text style={{color: COLORS.accent}}>Spots</Text></Text>
        <Text style={globalStyles.body}>Your curated list of best eats.</Text>

        <FlatList
          data={favorites}
          keyExtractor={(item) => item.place_id}
          contentContainerStyle={{ paddingTop: 20 }}
          renderItem={({ item }) => (
            <RestaurantCard restaurant={item} onPress={() => openMap(item.name, item.address)} />
          )}
          ListEmptyComponent={
            <View style={{ marginTop: 50, alignItems: 'center' }}>
              <Text style={{ fontSize: 40 }}>💔</Text>
              <Text style={{ color: COLORS.textDim, marginTop: 10 }}>No favorites yet.</Text>
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
}