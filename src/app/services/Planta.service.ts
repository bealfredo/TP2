import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Planta, PlantaUpdateQuantidade, PlantaUpdateStatusPlanta } from '../models/planta.model';
import { TipoCategoria } from '../models/tipoCategoria.model';
import { StatusPlanta } from '../models/StatusPlanta.model';
import { NivelDificuldade } from '../models/NivelDificuldade.model';
import { NivelToxicidade } from '../models/NivelToxicidade.model';
import { PortePlanta } from '../models/PortePlanta.model';

@Injectable({
  providedIn: 'root'
})
export class PlantaService {
  private baseUrl = 'http://localhost:8080/plantas';

  constructor(private httpClient: HttpClient) {  }

  findAll(): Observable<Planta[]> {
    return this.httpClient.get<Planta[]>(this.baseUrl);
  }

  listAllStatusPlanta(): Observable<StatusPlanta[]> {
    return this.httpClient.get<any>(`${this.baseUrl}/statusplanta`);
  }

  listAllNivelDificuldade(): Observable<NivelDificuldade[]> {
    return this.httpClient.get<any>(`${this.baseUrl}/niveldificuldade`);
  }

  listAllNivelToxicidade(): Observable<NivelToxicidade[]> {
    return this.httpClient.get<any>(`${this.baseUrl}/niveltoxicidade`);
  }

  listAllPortePlanta(): Observable<PortePlanta[]> {
    return this.httpClient.get<any>(`${this.baseUrl}/porteplanta`);
  }

  findById(id: string): Observable<Planta> {
    return this.httpClient.get<Planta>(`${this.baseUrl}/${id}`);
  }

  insert(planta: Planta): Observable<Planta> {
    return this.httpClient.post<Planta>(this.baseUrl, planta)
  }

  update(planta: Planta): Observable<Planta> {
    return this.httpClient.put<Planta>(`${this.baseUrl}/${planta.id}`, planta)
  }

  updateQuantidade(dto: PlantaUpdateQuantidade, id: number): Observable<Planta> {
    return this.httpClient.patch<Planta>(`${this.baseUrl}/${id}/update/addremovequantidade`, dto)
  }

  updateStatusplanta(dto: PlantaUpdateStatusPlanta, id: number): Observable<Planta> {
    return this.httpClient.patch<Planta>(`${this.baseUrl}/${id}/update/statusplanta`, dto)
  }

  delete(planta: Planta): Observable<any> {
    return this.httpClient.delete<any>(`${this.baseUrl}/${planta.id}`)
  }

}
