import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-base-textarea',
  imports: [CommonModule, FormsModule],
  templateUrl: './base-textarea.component.html',
  styleUrl: './base-textarea.component.scss',
})
export class BaseTextareaComponent {
  @Input() label: string = '';
  @Input() placeholder: string = '';
  @Input() value: string = '';
  @Input() error: string = '';
  @Input() isRequired: boolean = false;
  @Input() backgroundColor: string = '';
  @Output() handleInputChange: EventEmitter<string> = new EventEmitter();

  public handleValueChange(): void {
    this.handleInputChange.emit(this.value);
  }
}
