import { AfterViewInit, Component } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-map',
  imports: [],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss',
})
export class MapComponent implements AfterViewInit {
  private readonly myLocation = {
    lat: 41.99842295685538,
    lng: 21.405541997091913,
  };
  ngAfterViewInit(): void {
    this.initMap();
  }

  private initMap(): void {
    const map = L.map('map').setView(
      [this.myLocation.lat, this.myLocation.lng],
      13,
    );

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    const faIcon = L.divIcon({
      html: '<i class="fas fa-map-marker-alt fa-2x" style="color:red;"></i>',
      iconSize: [30, 42],
      className: '',
    });

    L.marker([this.myLocation.lat, this.myLocation.lng], {
      icon: faIcon,
    }).addTo(map);
  }
}
