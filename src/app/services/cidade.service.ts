import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Cidade } from '../models/cidade.model';

@Injectable({
  providedIn: 'root'
})
export class CidadeService {
  private baseUrl = 'http://localhost:8080/cidades';

  constructor(private httpClient: HttpClient) {  }

  findAll(): Observable<Cidade[]> {
    return this.httpClient.get<Cidade[]>(this.baseUrl);
  }

  findById(id: string): Observable<Cidade> {
    return this.httpClient.get<Cidade>(`${this.baseUrl}/${id}`);
  }

  insert(cidade: Cidade): Observable<Cidade> {
    const data = {
      nome: cidade.nome,
      estado: cidade.estado,
      frete: cidade.frete
    }
    return this.httpClient.post<Cidade>(this.baseUrl, data)
  }

  update(cidade: Cidade): Observable<Cidade> {
    const data = {
      nome: cidade.nome,
      estado: cidade.estado,
      frete: cidade.frete
    }
    return this.httpClient.put<Cidade>(`${this.baseUrl}/${cidade.id}`, data)
  }

  delete(cidade: Cidade): Observable<any> {
    return this.httpClient.delete<any>(`${this.baseUrl}/${cidade.id}`)
  }

}
