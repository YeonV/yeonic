import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.blade.ledfx',
  appName: 'LedFx Client',
  webDir: 'dist',
  server: {
    "url": "http://192.168.1.236:5173",
    "cleartext": true,
    androidScheme: 'https'
  }
};

export default config;
