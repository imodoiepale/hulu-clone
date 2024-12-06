import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.moviedb.app',
  appName: 'MovieDB',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;