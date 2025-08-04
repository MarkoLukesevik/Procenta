import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { QRCodeResponse } from '../responses/scan-qr-response';

@Injectable({
  providedIn: 'root',
})
export class ScanService {
  private apiService = inject(ApiService);


  public scanQrCode(
    qrCode: string,
    lokalId: string,
  ): Observable<QRCodeResponse> {
    const request = {
      qrCode: qrCode,
      lokalId: lokalId,
    };
    return this.apiService.post<QRCodeResponse>('validate-qrcode', request);
  }
}
