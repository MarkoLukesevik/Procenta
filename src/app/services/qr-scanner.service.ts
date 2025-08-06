import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { Html5QrcodeScanner } from 'html5-qrcode';

@Injectable({
  providedIn: 'root',
})
export class QrScannerService {
  private html5Scanner: Html5QrcodeScanner | null = null;
  private isNative: boolean = Capacitor.isNativePlatform();

  constructor() {}

  async scan(callback: (result: string) => void): Promise<void> {
    if (this.isNative) {
      await this.scanNative(callback);
    } else {
      this.scanWeb(callback);
    }
  }

  private async scanNative(callback: (result: string) => void): Promise<void> {
    try {
      const result = await BarcodeScanner.scan();

      if (result?.barcodes?.length) {
        const code = result.barcodes[0].rawValue;
        callback(code);
      } else {
        console.warn('No barcode found');
      }
    } catch (err) {
      console.error('Native scan error:', err);
    }
  }

  private scanWeb(callback: (result: string) => void): void {
    const config = {
      fps: 10,
      qrbox: { width: 250, height: 250 },
    };

    const scannerId = 'html5qr-code-full-region';
    this.html5Scanner = new Html5QrcodeScanner(scannerId, config, false);

    this.html5Scanner.render(
      (decodedText) => {
        callback(decodedText);
        this.html5Scanner?.clear();
      },
      (error) => {
        console.warn('Scan error (ignored):', error);
      },
    );
  }

  async stop(): Promise<void> {
    if (this.isNative) {
    } else {
      await this.html5Scanner?.clear();
    }
  }
}
