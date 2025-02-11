import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {FooterComponent} from './components/footer/footer.component';
import {HeaderComponent} from './components/header/header.component';
import {MessageService} from 'primeng/api';
import {FormsModule} from '@angular/forms';
import {Toast} from 'primeng/toast';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FooterComponent, HeaderComponent, FormsModule, Toast],
  templateUrl: './app.component.html',
  standalone: true,
  styleUrl: './app.component.css',
  providers: [MessageService]
})
export class AppComponent {
  title = 'web-traficandme';
}
