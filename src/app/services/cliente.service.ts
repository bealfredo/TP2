import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Cliente } from '../models/cliente.model';
import { AuthService } from './auth.service';
import { ItemCarrinho } from '../models/itemcarrinho.model';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private baseUrl = 'http://localhost:8080/clientes';

  constructor(
    private httpClient: HttpClient,
    private authService: AuthService,
  ) {  }

  findAll(page?: number, pageSize?: number): Observable<Cliente[]> {
    let params = {};

    if (page !== undefined && pageSize !== undefined) {
      params = {
        page: page.toString(),
        pageSize: pageSize.toString()
      }
    }

    return this.httpClient.get<Cliente[]>(`${this.baseUrl}`, {params});
  }

  findById(id: string): Observable<Cliente> {
    return this.httpClient.get<Cliente>(`${this.baseUrl}/${id}`);
  }

  update(cliente: Cliente): Observable<Cliente> {
    return this.httpClient.patch<Cliente>(`${this.baseUrl}/${cliente.id}`, cliente)
  }

  selfUpdate(cliente: Cliente): Observable<Cliente> {
    return this.httpClient.patch<Cliente>(`${this.baseUrl}/selfupdate`, cliente)
  }

  delete(cliente: Cliente): Observable<any> {
    return this.httpClient.delete<any>(`${this.baseUrl}/${cliente.id}`)
  }

  count(): Observable<number> {
    return this.httpClient.get<number>(`${this.baseUrl}/count`);
  }

  create(cliente: Cliente): Observable<Cliente> {
    return this.httpClient.post<Cliente>(`${this.baseUrl}`, cliente, {observe: 'response'}).pipe(
      tap((res: any) => {
        const authToken = res.headers.get('Authorization') ?? '';
        if (authToken) {
          this.authService.setToken(authToken);
          this.authService.initUsuarioLogado();
        }
      }
    ));
  }

  insertExistingUser(email: string, passwordExisting: string): Observable<any> {
    const params = {
      email: email,
      passwordExisting: passwordExisting
    }

    return this.httpClient.post<any>(`${this.baseUrl}/insertexistinguser`, params, {observe: 'response'}).pipe(
      tap((res: any) => {
        const authToken = res.headers.get('Authorization') ?? '';
        if (authToken) {
          this.authService.setToken(authToken);
          this.authService.initUsuarioLogado();
        }
      })
    );
  }

  updateCarrinho(carrinho: string): Observable<any> {
    const params = {
      carrinho: carrinho
    }

    return this.httpClient.patch<any>(`${this.baseUrl}/updatecarrinho`, params);
  }

  getCarrinho(): Observable<ItemCarrinho[]> {
    return this.httpClient.get<any>(`${this.baseUrl}/carrinho`);
  }

  findByToken(): Observable<Cliente> {
    return this.httpClient.get<Cliente>(`${this.baseUrl}/findbytoken`);
  }

  // finalizarCompra(idEnderecoEntrega:number, itensVenda: ItemCarrinho[]): Observable<any> {

  //   const params = {
  //     idEnderecoEntrega: idEnderecoEntrega,
  //     itensVenda: itensVenda
  //   }

  //   return this.httpClient.patch<any>(`${this.baseUrl}/vendas`, params);
  // }
}
