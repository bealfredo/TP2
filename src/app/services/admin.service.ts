import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Admin } from '../models/admin.model';
import { TipoAdmin } from '../models/tipoAdmin.model';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private baseUrl = 'http://localhost:8080/admins';

  constructor(private httpClient: HttpClient) {  }

  findAll(page?: number, pageSize?: number): Observable<Admin[]> {
    let params = {};

    if (page !== undefined && pageSize !== undefined) {
      params = {
        page: page.toString(),
        pageSize: pageSize.toString()
      }
    }

    return this.httpClient.get<Admin[]>(`${this.baseUrl}`, {params});
  }

  insert(admin: Admin): Observable<Admin> {
    return this.httpClient.post<Admin>(`${this.baseUrl}`, admin);
  }

  findById(id: string): Observable<Admin> {
    return this.httpClient.get<Admin>(`${this.baseUrl}/${id}`);
  }

  update(admin: Admin): Observable<Admin> {
    return this.httpClient.patch<Admin>(`${this.baseUrl}/${admin.id}`, admin)
  }

  delete(admin: Admin): Observable<any> {
    return this.httpClient.delete<any>(`${this.baseUrl}/${admin.id}`)
  }

  count(): Observable<number> {
    return this.httpClient.get<number>(`${this.baseUrl}/count`);
  }

  tipoAdmin(): Observable<TipoAdmin[]> {
    return this.httpClient.get<any>(`${this.baseUrl}/tipoadmin`);
  }

  insertExistingUser(email: string): Observable<Admin> {
    return this.httpClient.post<Admin>(`${this.baseUrl}/insertExistingUser`, {email : email});
  }
}
