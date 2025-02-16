import { Component } from '@angular/core';
import {TranslateModule} from '@ngx-translate/core';
import {IncentivesComponent} from '../../components/incentives/incentives.component';
import {StatsComponent} from '../../components/stats/stats.component';
import {ContentSectionComponent} from '../../components/content-section/content-section.component';
import {ContactComponent} from '../../components/contact/contact.component';

@Component({
  selector: 'app-home',
  imports: [TranslateModule, IncentivesComponent, StatsComponent, ContentSectionComponent,ContactComponent],
  templateUrl: './home.component.html',
  standalone: true,
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
