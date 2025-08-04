import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-base-number-input',
  imports: [CommonModule, FormsModule],
  templateUrl: './base-number-input.component.html',
  styleUrl: './base-number-input.component.scss',
})
export class BaseNumberInputComponent {
  @Input() label: string = '';
  @Input() placeholder: string = '';
  @Input() value?: number;
  @Output() handleInputChange: EventEmitter<number> = new EventEmitter();

  public handleValueChange(): void {
    this.handleInputChange.emit(this.value);
  }
}
