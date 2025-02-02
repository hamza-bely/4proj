import { Component } from '@angular/core';
import {ImportsModule} from '../../../primeng/imports';

@Component({
  selector: 'app-footer',
  imports: [ImportsModule],
  templateUrl: './footer.component.html',
  standalone: true,
  styleUrl: './footer.component.css'
})
export class FooterComponent {

}
