import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import {NgOptimizedImage} from '@angular/common'; // Importez le service de traduction

@Component({
  selector: 'app-country-selector',
  templateUrl: './country-selector.component.html',
  styleUrls: ['./country-selector.component.css'],
  standalone: true
})
export class CountrySelectorComponent {
  languages = [
    { name: 'Fr', img: 'assets/images/languages/france.png' },
    { name: 'En', img: 'assets/images/languages/english.png' },
  ];

  selectedLanguages = this.languages[0];
  isOpen = false;

  constructor(private translate: TranslateService) {
    translate.setDefaultLang('fr');
    translate.use('fr');
  }

  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }

  selectUser(language: any) {
    this.selectedLanguages = language;
    this.translate.use(language.name.toLowerCase());
    this.isOpen = false;
  }
}
