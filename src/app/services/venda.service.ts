import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Cliente } from '../models/cliente.model';
import { AuthService } from './auth.service';
import { ItemCarrinho } from '../models/itemcarrinho.model';

@Injectable({
  providedIn: 'root'
})
export class VendaService {
  private baseUrl = 'http://localhost:8080/vendas';

  constructor(
    private httpClient: HttpClient,
    private authService: AuthService
  ) {  }

  finalizarCompra(idEnderecoEntrega:number, itensVenda: ItemCarrinho[]): Observable<any> {

    const params = {
      idEnderecoEntrega: idEnderecoEntrega,
      itensVenda: itensVenda
    }

    return this.httpClient.post<any>(`${this.baseUrl}`, params);
  }
}
