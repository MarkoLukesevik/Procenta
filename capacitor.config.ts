import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'procenta',
  webDir: 'www',
  plugins: {
    Keyboard: {
      resize: "native",
    }
  }
};

export default config;
