import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.auditus.app',
  appName: 'AuditUs',
  webDir: 'out',
  server: {
    // En desarrollo, apunta al servidor local de Next.js
    // Comentar en producción (para build nativo)
    // url: 'http://192.168.1.X:3000',
    // cleartext: true,
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 1500,
      backgroundColor: '#09090b',
      showSpinner: false,
    },
    StatusBar: {
      style: 'dark',
      backgroundColor: '#09090b',
    },
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert'],
    },
  },
};

export default config;
