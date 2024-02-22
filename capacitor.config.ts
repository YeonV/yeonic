import { CapacitorConfig } from '@capacitor/cli'
import { baseTheme } from './src/themes/baseTheme'

const isDevelopment = process.env.NODE_ENV === 'development'

const config: CapacitorConfig = {
  appId: 'com.blade.yeonic',
  appName: 'yeonic',
  webDir: 'dist',
  server: {
    url: isDevelopment ? 'http://192.168.1.236:5173' : undefined,
    cleartext: true,
    androidScheme: 'https'
  },
  plugins: {
    ZeroConf: {},
    LocalNotifications: {
      smallIcon: 'ic_launcher_foreground',
      iconColor: baseTheme.palette.primary.main,
      sound: 'beep.wav'
    }
  }
}

export default config
