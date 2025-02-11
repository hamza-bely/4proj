import { Component } from '@angular/core';
import {TranslateModule} from '@ngx-translate/core';
import {IncentivesComponent} from '../incentives/incentives.component';

@Component({
  selector: 'app-home',
  imports: [TranslateModule,IncentivesComponent],
  templateUrl: './home.component.html',
  standalone: true,
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
