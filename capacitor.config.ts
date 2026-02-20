import type { CapacitorConfig } from '@capacitor/cli';
import { KeyboardResize } from '@capacitor/keyboard';

const config: CapacitorConfig = {
  appId: 'com.procenta.app',
  appName: 'procenta',
  webDir: 'www',
  plugins: {
    Keyboard: {
      resize: 'native' as KeyboardResize,
      resizeOnFullScreen: true,
    },
  },
};

export default config;
