import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CategoriaPlanta } from '../models/categoriaPlanta.model';

@Injectable({
  providedIn: 'root'
})
export class CategoriaPlantaService {
  private baseUrl = 'http://localhost:8080/categoriasplanta';

  constructor(private httpClient: HttpClient) {  }

  findAll(): Observable<CategoriaPlanta[]> {
    return this.httpClient.get<CategoriaPlanta[]>(this.baseUrl);
  }

  findById(id: string): Observable<CategoriaPlanta> {
    return this.httpClient.get<CategoriaPlanta>(`${this.baseUrl}/${id}`);
  }

  insert(categoriaplanta: CategoriaPlanta): Observable<CategoriaPlanta> {
    return this.httpClient.post<CategoriaPlanta>(this.baseUrl, categoriaplanta)
  }

  update(categoriaplanta: CategoriaPlanta): Observable<CategoriaPlanta> {
    return this.httpClient.put<CategoriaPlanta>(`${this.baseUrl}/${categoriaplanta.id}`, categoriaplanta)
  }

  delete(categoriaplanta: CategoriaPlanta): Observable<any> {
    return this.httpClient.delete<any>(`${this.baseUrl}/${categoriaplanta.id}`)
  }

}
