import {Component, EventEmitter, Input, output, Output} from '@angular/core';
import {ButtonModule} from 'primeng/button';
import {InputTextModule} from 'primeng/inputtext';
import {ToastService} from '../../components/toast/toast.service';
import {MessageService} from 'primeng/api';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-login',
  imports: [ButtonModule, InputTextModule, TranslatePipe],
  templateUrl: './login.component.html',
  standalone: true,
  styleUrl: './login.component.css'
})
export class LoginComponent {
  constructor(private toastService: ToastService,private messageService: MessageService) {}
  @Input() visible!: boolean;
  @Output() visibleChange = new EventEmitter<boolean>();

  closeDialog(value : boolean) {
    this.visible = value;
    this.visibleChange.emit(value);
  }

  notAvailable() {
    this.toastService.showWarn("La page n'est pas disponible pour le moment",this.messageService);
  }
}
