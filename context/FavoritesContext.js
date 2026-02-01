import { createContext, useContext, useState } from 'react';

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);

  const toggleFavorite = (restaurant) => {
    setFavorites((prev) => {
      // Check if item is already favorited (using place_id or id)
      const exists = prev.find((item) => (item.place_id || item.id) === (restaurant.place_id || restaurant.id));
      if (exists) {
        return prev.filter((item) => (item.place_id || item.id) !== (restaurant.place_id || restaurant.id));
      } else {
        return [...prev, restaurant];
      }
    });
  };

  const isFavorite = (id) => {
    return favorites.some((item) => (item.place_id || item.id) === id);
  };

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => useContext(FavoritesContext);