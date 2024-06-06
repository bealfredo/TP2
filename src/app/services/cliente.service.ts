import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Cliente } from '../models/cliente.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private baseUrl = 'http://localhost:8080/clientes';

  constructor(
    private httpClient: HttpClient,
    private authService: AuthService
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

  delete(cliente: Cliente): Observable<any> {
    return this.httpClient.delete<any>(`${this.baseUrl}/${cliente.id}`)
  }

  count(): Observable<number> {
    return this.httpClient.get<number>(`${this.baseUrl}/count`);
  }

  create(cliente: Cliente): Observable<Cliente> {
    return this.httpClient.post<Cliente>(`${this.baseUrl}`, cliente);
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
}
