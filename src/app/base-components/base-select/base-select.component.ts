import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ClickOutsideDirective } from '../../directives/click-outside.directive';

@Component({
  selector: 'app-base-select',
  imports: [CommonModule, FormsModule, ClickOutsideDirective],
  templateUrl: './base-select.component.html',
  styleUrl: './base-select.component.scss',
})
export class BaseSelectComponent {
  @Input() label: string = '';
  @Input() options: BaseSelectOption[] = [];
  @Input() placeholder: string = 'Select an option';
  @Input() selectedOption?: BaseSelectOption;
  @Input() borderColor: string = '';
  @Output() selectionChange = new EventEmitter<BaseSelectOption>();

  public isDropdownVisible: boolean = false;

  public onSelectionChange(option: BaseSelectOption, event: Event): void {
    event.stopPropagation();
    this.selectedOption = option;
    this.selectionChange.emit(this.selectedOption);
    this.isDropdownVisible = false;
  }

  public toggleDropdown(): void {
    this.isDropdownVisible = !this.isDropdownVisible;
  }

  public getSelectedOptionText(): string {
    return this.selectedOption ? this.selectedOption.text : this.placeholder;
  }
}

export interface BaseSelectOption {
  text: string;
  value: string;
}
