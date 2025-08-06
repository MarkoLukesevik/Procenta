import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Capacitor } from '@capacitor/core';

import QRCode from 'qrcode';

import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../services/user.service';
import { LokalsService } from '../../services/lokals.service';
import { ScanService } from '../../services/scan.service';
import { LanguageService } from '../../services/language.service';
import { QrScannerService } from '../../services/qr-scanner.service';

import { User } from '../../models/user';
import { Lokal } from '../../models/lokal';

import { QRCodeResponse } from '../../responses/scan-qr-response';

@Component({
  selector: 'app-qrcode-page',
  imports: [CommonModule],
  templateUrl: './qrcode-page.component.html',
  styleUrl: './qrcode-page.component.scss',
})
export class QrcodePageComponent implements OnInit, OnDestroy {
  private userService: UserService = inject(UserService);
  private lokalService: LokalsService = inject(LokalsService);
  private scanService: ScanService = inject(ScanService);
  private toastService: ToastrService = inject(ToastrService);
  private languageService: LanguageService = inject(LanguageService);
  private qrScannerService: QrScannerService = inject(QrScannerService);

  public loggedInUser: User | null;
  public loggedInLokal: Lokal | null;

  public scanResult: string | null = null;
  public isEligible: boolean = false;
  public notEligibleReason: string = '';
  public currentDevice: MediaDeviceInfo | undefined = undefined;
  public isScanningSpinnerOn: boolean = false;

  public scannedUser?: User;
  public isNativePlatform: boolean = Capacitor.isNativePlatform();

  public qrCodeDataUrl: string | null = null;

  public isScannerVisible: boolean = true;

  constructor() {
    this.loggedInUser = this.userService.getLoggedInUser()();
    this.loggedInLokal = this.lokalService.getLoggedInLokal()();
  }

  ngOnInit(): void {
    if (this.loggedInUser && this.loggedInUser.qrCode) {
      QRCode.toDataURL(this.loggedInUser.qrCode).then((url: string): void => {
        this.qrCodeDataUrl = url;
      });
    }

    if (this.loggedInLokal) {
      navigator.mediaDevices
        .enumerateDevices()
        .then((devices): void => {
          const videoDevices = devices.filter(
            (device) => device.kind === 'videoinput',
          );

          if (videoDevices.length > 0) {
            this.currentDevice = videoDevices[0];
            this.startScan();
          } else {
            this.toastService.error(this.t('no_camera_device_found'));
          }
        })
        .catch((error: any): void => {
          console.log(error.message);
        });
    }
  }

  async ngOnDestroy(): Promise<void> {
    await this.qrScannerService.stop();
  }

  public t(key: string): string {
    return this.languageService.translate(key);
  }

  public restartScan(): void {
    this.scanResult = null;
    this.isEligible = false;
    this.scannedUser = undefined;
    this.notEligibleReason = '';
    this.isScanningSpinnerOn = false;

    this.startScan();
  }

  public startScan(): void {
    this.qrScannerService.scan((result) => {
      this.onCodeResult(result);
    });
  }

  public onCodeResult(result: string): void {
    if (this.scanResult === result) return;

    this.scanResult = result;
    this.isEligible = false;
    this.isScanningSpinnerOn = true;

    if (this.loggedInLokal)
      this.scanService.scanQrCode(result, this.loggedInLokal.id).subscribe({
        next: (response: QRCodeResponse) => {
          this.scannedUser = response.user;
          this.isEligible = response.isEligible;
          this.notEligibleReason = response.reason;
          this.isScanningSpinnerOn = false;
          this.qrScannerService.stop();
          this.isScannerVisible = false;
        },
        error: (httpErrorResponse: HttpErrorResponse): void => {
          this.toastService.error(httpErrorResponse.error);
          this.isScanningSpinnerOn = false;
          this.qrScannerService.stop();
        },
      });
  }
}
