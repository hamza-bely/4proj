import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  constructor(private messageService: MessageService) {}

  showSuccess(message: string,s : any) {
    s.add({ severity: 'success', summary: 'Success', detail: message });
  }

  showInfo(message: string,s : any) {
    s.add({ severity: 'info', summary: 'Info', detail: message });
  }

  showWarn(message: string,s : any) {
    s.add({ severity: 'warn', summary: 'Warning', detail: message });
  }

  showError(message: string,s : any) {
    s.add({ severity: 'error', summary: 'Error', detail: message });
  }

  showContrast(message: string,s : any) {
    s.add({ severity: 'contrast', summary: 'Contrast', detail: message });
  }

  showSecondary(message: string) {
    this.messageService.add({ severity: 'secondary', summary: 'Secondary', detail: message });
  }
}
