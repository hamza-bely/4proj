import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrl: './map.component.css',
  standalone: true
})
export class MapComponent implements OnInit {
  private map!: L.Map;
  constructor() { }

  ngOnInit(): void {
    this.map = L.map('map').setView([51.505, -0.09], 14); // Coordonnées de Londres

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>',
      subdomains: 'abcd'
    }).addTo(this.map);
  }
}
