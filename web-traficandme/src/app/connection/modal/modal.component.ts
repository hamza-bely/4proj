import { Component } from '@angular/core';
import {LoginComponent} from '../login/login.component';
import {RegisterComponent} from '../register/register.component';

@Component({
  selector: 'app-modal',
  imports: [
    LoginComponent,
    RegisterComponent
  ],
  templateUrl: './modal.component.html',
  standalone: true,
  styleUrl: './modal.component.css'
})
export class ModalComponent {
  isRegister: boolean = true
  isLogin : boolean = false

}
