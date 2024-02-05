import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.blade.ledfx',
  appName: 'LedFx Client',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
