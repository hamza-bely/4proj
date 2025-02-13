import { Component } from '@angular/core';
import {ToastService} from '../../components/toast/toast.service';
import {MessageService} from 'primeng/api';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-register',
  imports: [
    TranslatePipe
  ],
  templateUrl: './register.component.html',
  standalone: true,
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  constructor(private toastService: ToastService,private messageService: MessageService) {}


  toggleForm(){
  }
  notAvailable() {
    this.toastService.showWarn("La page n'est pas disponible pour le moment",this.messageService);
  }
}
