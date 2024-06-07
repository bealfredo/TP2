import { Injectable } from '@angular/core';

export type keyLocalStorage = 'jwt_token' | 'usuario_logado' | 'carrinho';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }

  getItem(key: keyLocalStorage): any {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  }

  setItem(key: keyLocalStorage, value: any): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  removeItem(key: keyLocalStorage): void {
    localStorage.removeItem(key);
  }

}
