import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Lokal } from '../../../../models/lokal';
import { LokalCardComponent } from '../lokal-card/lokal-card.component';

@Component({
  selector: 'app-lokals-slider',
  imports: [CommonModule, LokalCardComponent],
  templateUrl: './lokals-slider.component.html',
  styleUrl: './lokals-slider.component.scss',
})
export class LokalsSliderComponent {
  @Input() title: string = '';
  @Input() lokals: Lokal[] = [];
}
