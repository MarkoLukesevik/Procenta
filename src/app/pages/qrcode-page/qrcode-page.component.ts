import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';

import { QRCodeComponent } from 'angularx-qrcode';
import { ZXingScannerModule } from '@zxing/ngx-scanner';

import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../services/user.service';
import { LokalsService } from '../../services/lokals.service';
import { ScanService } from '../../services/scan.service';
import { LanguageService } from '../../services/language.service';

import { User } from '../../models/user';
import { Lokal } from '../../models/lokal';

import { QRCodeResponse } from '../../responses/scan-qr-response';

@Component({
  selector: 'app-qrcode-page',
  imports: [CommonModule, QRCodeComponent, ZXingScannerModule],
  templateUrl: './qrcode-page.component.html',
  styleUrl: './qrcode-page.component.scss',
})
export class QrcodePageComponent implements OnInit, OnDestroy {
  private userService: UserService = inject(UserService);
  private lokalService: LokalsService = inject(LokalsService);
  private scanService: ScanService = inject(ScanService);
  private toastService: ToastrService = inject(ToastrService);
  private languageService: LanguageService = inject(LanguageService);

  public loggedInUser: User | null;
  public loggedInLokal: Lokal | null;

  public qrCodeSize: number = window.innerWidth * 0.9;

  public scanResult: string | null = null;
  public isEligible: boolean = false;
  public notEligibleReason: string = '';
  public currentDevice: MediaDeviceInfo | undefined = undefined;
  public isScanningSpinnerOn: boolean = false;

  public scannedUser?: User;

  constructor() {
    this.loggedInUser = this.userService.getLoggedInUser()();
    this.loggedInLokal = this.lokalService.getLoggedInLokal()();
  }

  ngOnInit(): void {
    this.setQrCodeWidth();
    window.addEventListener('resize', this.resizeListener);

    navigator.mediaDevices
      .enumerateDevices()
      .then((devices) => {
        const videoDevices = devices.filter(
          (device) => device.kind === 'videoinput',
        );

        if (videoDevices.length > 0) {
          this.currentDevice = videoDevices[0];
        } else {
          this.toastService.error('No camera device found.');
        }
      })
      .catch((error) => {
        this.toastService.error('Error accessing camera: ' + error.message);
      });
  }

  ngOnDestroy(): void {
    window.removeEventListener('resize', this.resizeListener);
  }

  public t(key: string): string {
    return this.languageService.translate(key);
  }

  private resizeListener = () => {
    this.setQrCodeWidth();
  };

  private setQrCodeWidth() {
    if (window.innerWidth > 1200) {
      this.qrCodeSize = window.innerWidth * 0.3;
    } else if (window.innerWidth > 600) {
      this.qrCodeSize = window.innerWidth * 0.5;
    } else {
      this.qrCodeSize = window.innerWidth * 0.9;
    }
  }

  public onCodeResult(result: string) {
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
        },
        error: (httpErrorResponse: HttpErrorResponse) => {
          this.toastService.error(httpErrorResponse.error);
          this.isScanningSpinnerOn = false;
        },
      });
  }
}
