import { CapacitorConfig } from '@capacitor/cli'
// import { baseTheme } from './src/themes/baseTheme'

// const isDevelopment = true || process.env.NODE_ENV === 'development' || process.env.YZ === 'true'

const config: CapacitorConfig = {
  appId: 'com.blade.yeonic',
  appName: 'yeonic',
  webDir: 'dist',
  server: {
    cleartext: true,
    androidScheme: 'https',
    iosScheme: 'https'
  },
  android: {
    allowMixedContent: true
  },
  plugins: {
    ZeroConf: {},
    LocalNotifications: {
      smallIcon: 'ic_launcher_foreground',
      iconColor: '#005aa0',
      // iconColor: baseTheme.palette.primary.main,
      sound: 'beep.wav'
    }
  }
}

export default config
