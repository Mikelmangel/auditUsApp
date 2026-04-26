import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.auditus.app',
  appName: 'AuditUs',
  webDir: '.next',
  server: {
    // WebView: APK carga tu web real desde Vercel
    // Users ven siempre la última versión sin resubir a stores
    // url: 'https://auditus-app.vercel.app',
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
    AdMob: {
      appId: process.env.NEXT_PUBLIC_ADMOB_APP_ID ?? 'ca-app-pub-6566349379255160~6333423335',
    },
  },
};

export default config;
