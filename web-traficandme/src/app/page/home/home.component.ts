import { Component } from '@angular/core';
import {TranslateModule} from '@ngx-translate/core';
import {IncentivesComponent} from '../../components/incentives/incentives.component';
import {StatsComponent} from '../../components/stats/stats.component';
import {ContentSectionComponent} from '../../components/content-section/content-section.component';

@Component({
  selector: 'app-home',
  imports: [TranslateModule, IncentivesComponent, StatsComponent, ContentSectionComponent],
  templateUrl: './home.component.html',
  standalone: true,
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
