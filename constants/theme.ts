/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
  healthy: {
    primary: '#CC338B', // Deep Magenta
    primaryDark: '#8B008B',
    accentRed: '#B91428', // Goji Berry Red
    yellow: '#FFD700', // Vibrant Yellow
    white: '#FFFFFF',
    cream: '#FFF1E6', // Softer cream
    cardBackground: '#FAFAFA',
    mutedText: '#FFF6E5',
    textPrimary: '#FFFFFF',
    successGreen: '#1C8B39',
  },
  gradients: {
    all: ['#FFD100', '#FFB700'], // Default All - Gold/Yellow gradient like Blinkit default sometimes
    holi: ['#FF1493', '#FFD700', '#00CED1'],
    ramzan: ['#E0F2E9', '#F0F9F4'], // Soft green from image
    kids: ['#E3F2FD', '#BBDEFB'], // Soft blue from image
    imported: ['#F5F0E1', '#E8DFCC'], // Soft tan/premium from image
    gifting: ['#FFF8E1', '#FFECB3'],
    kuchBhi: ['#CC338B', '#8B008B'], // Keeping magenta here
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
