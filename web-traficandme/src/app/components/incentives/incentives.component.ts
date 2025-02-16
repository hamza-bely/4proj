import { Component } from '@angular/core';
import {AccordionModule} from 'primeng/accordion';

@Component({
  selector: 'app-incentives',
  imports: [
    AccordionModule
  ],
  templateUrl: './incentives.component.html',
  standalone: true,
  styleUrl: './incentives.component.css'
})
export class IncentivesComponent {
}
