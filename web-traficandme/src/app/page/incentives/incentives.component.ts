import { Component } from '@angular/core';
import {TranslatePipe} from '@ngx-translate/core';
import {AccordionModule} from 'primeng/accordion';

@Component({
  selector: 'app-incentives',
  imports: [
    TranslatePipe,AccordionModule
  ],
  templateUrl: './incentives.component.html',
  standalone: true,
  styleUrl: './incentives.component.css'
})
export class IncentivesComponent {

  tabs = [
    { title: 'Title 1', content: 'Content 1', value: '0' },
  ];

}
