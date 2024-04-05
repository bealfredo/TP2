import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CategoriaPlanta, CategoriaPlantaUpdateAtiva } from '../models/categoriaPlanta.model';
import { TipoCategoria } from '../models/tipoCategoria.model';

@Injectable({
  providedIn: 'root'
})
export class CategoriaPlantaService {
  private baseUrl = 'http://localhost:8080/categoriasplanta';

  constructor(private httpClient: HttpClient) {  }

  findAll(): Observable<CategoriaPlanta[]> {
    return this.httpClient.get<CategoriaPlanta[]>(this.baseUrl);
  }

  listAllTipoCategoria(): Observable<TipoCategoria[]> {
    return this.httpClient.get<any>(`${this.baseUrl}/tipocategoria`);
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

  updateAtiva(dto: CategoriaPlantaUpdateAtiva, id: number): Observable<CategoriaPlanta> {
    return this.httpClient.patch<CategoriaPlanta>(`${this.baseUrl}/${id}/update/ativa`, dto)
  }

  delete(categoriaplanta: CategoriaPlanta): Observable<any> {
    return this.httpClient.delete<any>(`${this.baseUrl}/${categoriaplanta.id}`)
  }

}

// @GET
//     @Path("/tipocategoria")
//     public Response listAllStatusProduto() {
//         return Response.ok(TipoCategoria.listAll()).build();
//     }
