import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-base-checkbox',
  imports: [CommonModule],
  templateUrl: './base-checkbox.component.html',
  styleUrl: './base-checkbox.component.scss',
})
export class BaseCheckboxComponent {
  @Input() label: string = '';
  @Input() checked: boolean = false;
  @Output() handleCheckboxClick: EventEmitter<boolean> = new EventEmitter();
}
