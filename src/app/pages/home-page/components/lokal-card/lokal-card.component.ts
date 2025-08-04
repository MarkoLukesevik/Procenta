import { Component, Input, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Lokal } from '../../../../models/lokal';

@Component({
  selector: 'app-lokal-card',
  imports: [],
  templateUrl: './lokal-card.component.html',
  styleUrl: './lokal-card.component.scss',
})
export class LokalCardComponent {
  private router: Router = inject(Router);

  @Input() lokal!: Lokal;

  public async handleCardClick(): Promise<void> {
    await this.router.navigate(['lokal', this.lokal.id]);
  }
}
