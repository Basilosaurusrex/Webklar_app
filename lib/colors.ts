// Centralized color system
export const colors = {
  // Main brand colors
  primary: '#0A400C',      // Dark green
  secondary: '#819067',    // Medium green  
  tertiary: '#B1AB86',     // Light green-beige
  background: '#FEFAE0',   // Cream background
  
  // Derived colors for better contrast
  primaryLight: '#0F5010',
  primaryDark: '#052006',
  secondaryLight: '#9AA67F',
  secondaryDark: '#6B7A58',
  
  // Neutral colors
  white: '#FFFFFF',
  black: '#000000',
  gray: {
    100: '#F5F5F5',
    200: '#E5E5E5',
    300: '#D4D4D4',
    400: '#A3A3A3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
  }
} as const;

export type ColorKey = keyof typeof colors;