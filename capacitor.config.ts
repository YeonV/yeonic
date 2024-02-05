import { CapacitorConfig } from '@capacitor/cli';
const isDevelopment = process.env.NODE_ENV === 'development';

const config: CapacitorConfig = {
  appId: 'com.blade.ledfx',
  appName: 'LedFx Client',
  webDir: 'dist',
  server: {
    "url": isDevelopment ? "http://192.168.1.236:5173" : undefined,
    "cleartext": true,
    androidScheme: 'https'
  }
};

export default config;
