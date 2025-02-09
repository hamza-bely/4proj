import {Component, Inject} from '@angular/core';
import {RouterLink} from '@angular/router';
import {LoginComponent} from '../../connection/login/login.component';
import {CountrySelectorComponent} from '../country-selector/country-selector.component';
import {TranslateModule} from '@ngx-translate/core';
import {ToastService} from '../toast/toast.service';
import {MessageService} from 'primeng/api';

@Component({
  selector: 'app-header',
  imports: [RouterLink, LoginComponent, CountrySelectorComponent, TranslateModule],
  templateUrl: './header.component.html',
  standalone: true,
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  constructor(private toastService: ToastService,private messageService: MessageService) {}
  visible: boolean = false;

  showDialog(event : boolean) {
    this.visible = event;
  }

  notAvailable() {
    this.toastService.showWarn("L'action n'est 'pas disponible pour le moment",this.messageService);
  }
}
