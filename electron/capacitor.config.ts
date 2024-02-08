import { CapacitorConfig } from '@capacitor/cli'
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
      smallIcon: 'ic_stat_icon_config_sample',
      iconColor: '#800000',
      sound: 'beep.wav'
    }
  }
}

export default config
