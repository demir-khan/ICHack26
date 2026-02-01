// src/styles/theme.js
import { StyleSheet } from 'react-native';

export const COLORS = {
  bg: '#0B0F19',        // Deep, deep blue/black
  card: '#151C2C',      // Slightly lighter for cards
  primary: '#CCFF00',   // The "ForkCast" Neon Lime
  text: '#FFFFFF',      // Pure white for headings
  textDim: '#8F9BB3',   // Blue-grey for secondary text
  border: '#2A364D',    // Subtle border color
  success: '#00E096',   // Green for "Open Now"
};

export const globalStyles = StyleSheet.create({
  // The Screen Wrapper
  screenContainer: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  // The "Glass" Card (Consistent Look)
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 12,
    marginBottom: 16,
    // Soft Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 4,
  },
  // Typography Hierarchy
  h1: {
    fontSize: 28,
    fontWeight: '800', // Extra Bold
    color: COLORS.text,
    letterSpacing: -0.5,
  },
  h2: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 4,
  },
  body: {
    fontSize: 14,
    color: COLORS.textDim,
    lineHeight: 20,
  },
  // Buttons
  primaryButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.primary,
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  buttonText: {
    color: '#000',
    fontWeight: '900',
    fontSize: 16,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
});