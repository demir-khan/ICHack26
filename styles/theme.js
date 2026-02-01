import { StyleSheet } from 'react-native';

export const COLORS = {
  bg: '#FFFFFF',           // Pure White Background
  card: '#FFFFFF',         // White Cards
  primary: '#000000',      // Black for primary actions (Modern/Luxury)
  accent: '#FF4D4D',       // Red for Hearts/Favorites
  text: '#1C1C1E',         // Dark Grey for reading
  textDim: '#8E8E93',      // Light Grey for secondary info
  border: '#E5E5EA',       // Very subtle borders
  success: '#34C759',      // Green for "Open"
  loading: '#007AFF',      // Blue for loading bars
};

export const globalStyles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    // Soft, modern shadow (Elevation)
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  h1: {
    fontSize: 32,
    fontWeight: '800',
    color: COLORS.text,
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  h2: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 4,
  },
  body: {
    fontSize: 15,
    color: COLORS.textDim,
    lineHeight: 22,
  },
  // Modern Black Button
  primaryButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
  },
  buttonText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 16,
  },
});