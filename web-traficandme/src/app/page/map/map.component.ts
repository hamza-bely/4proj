import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-map',
  imports: [],
  templateUrl: './map.component.html',
  standalone: true,
  styleUrl: './map.component.css'
})
export class MapComponent implements OnInit{
  constructor() { }

  ngOnInit(): void {
    // Initialiser la carte Leaflet
    const map = L.map('map').setView([51.505, -0.09], 13); // Coordonnées de Londres, zoom 13

    // Ajouter une couche de tuiles (ici OpenStreetMap)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Ajouter un marqueur à la carte
    L.marker([51.505, -0.09]).addTo(map)
      .bindPopup('<b>Hello world!</b><br>I am a popup.')
      .openPopup();
  }
}
