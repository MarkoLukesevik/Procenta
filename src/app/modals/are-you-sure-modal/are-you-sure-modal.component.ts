import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { LanguageService } from '../../services/language.service';
import { ModalService } from '../../services/modal.service';

@Component({
  selector: 'app-are-you-sure-modal',
  imports: [],
  templateUrl: './are-you-sure-modal.component.html',
  styleUrl: './are-you-sure-modal.component.scss',
})
export class AreYouSureModalComponent {
  private languageService: LanguageService = inject(LanguageService);
  private modalService: ModalService = inject(ModalService);

  @Input() title: string = '';
  @Input() description: string = '';

  public t(key: string): string {
    return this.languageService.translate(key);
  }

  public handleModalClose(value: boolean): void {
    this.modalService.close(value);
  }
}
