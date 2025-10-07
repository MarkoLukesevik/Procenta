import { Component, inject } from '@angular/core';
import { LanguageService } from '../../services/language.service';
import { ModalService } from '../../services/modal.service';

@Component({
  selector: 'app-terms-and-conditions-modal',
  templateUrl: './terms-and-conditions-modal.component.html',
  styleUrls: ['./terms-and-conditions-modal.component.scss'],
})
export class TermsAndConditionsModalComponent {
  private languageService: LanguageService = inject(LanguageService);
  private modalService: ModalService = inject(ModalService);
  constructor() {}

  public hasScrolledToBottom: boolean = false;

  public t(key: string): string {
    return this.languageService.translate(key);
  }

  public handleModalClose(value: boolean): void {
    this.modalService.close(value);
  }

  public onScroll(element: HTMLElement): void {
    this.hasScrolledToBottom =
      element.scrollHeight - element.scrollTop === element.clientHeight;
  }
}
