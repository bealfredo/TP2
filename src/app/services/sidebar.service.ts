import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  private isOpenSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor() { }

  // Alterna o estado da barra lateral
  toggle() {
    const currentState = this.isOpenSubject.value;
    this.isOpenSubject.next(!currentState);
  }

  // Retorna um observable para o estado da barra lateral
  getSidebarState() {
    return this.isOpenSubject.asObservable();
  }

  // Permite consultar o estado atual
  isOpen(): boolean {
    return this.isOpenSubject.value;
  }
}
