import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.brainroot.italianfighters',
  appName: 'BrainRoot Italian Fighters',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#1a202c",
      showSpinner: false
    }
  }
};

export default config;