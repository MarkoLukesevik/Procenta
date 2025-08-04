import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-base-input',
  imports: [CommonModule, FormsModule],
  templateUrl: './base-input.component.html',
  styleUrl: './base-input.component.scss',
})
export class BaseInputComponent {
  @Input() label: string = '';
  @Input() placeholder: string = '';
  @Input() value: string = '';
  @Input() type: 'text' | 'email' | 'password' = 'text';
  @Input() error: string = '';
  @Input() isRequired: boolean = false;
  @Output() handleInputChange: EventEmitter<string> = new EventEmitter();

  public handleValueChange(): void {
    this.handleInputChange.emit(this.value);
  }
}
