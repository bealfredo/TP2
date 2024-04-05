import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Tag, TagUpdateAtiva } from '../models/tag.model';
import { TipoCategoria } from '../models/tipoCategoria.model';

@Injectable({
  providedIn: 'root'
})
export class TagService {
  private baseUrl = 'http://localhost:8080/tags';

  constructor(private httpClient: HttpClient) {  }

  findAll(): Observable<Tag[]> {
    return this.httpClient.get<Tag[]>(this.baseUrl);
  }

  // listAllTipoCategoria(): Observable<TipoCategoria[]> {
  //   return this.httpClient.get<any>(`${this.baseUrl}/tipocategoria`);
  // }

  findById(id: string): Observable<Tag> {
    return this.httpClient.get<Tag>(`${this.baseUrl}/${id}`);
  }

  insert(tag: Tag): Observable<Tag> {
    return this.httpClient.post<Tag>(this.baseUrl, tag)
  }

  update(tag: Tag): Observable<Tag> {
    return this.httpClient.put<Tag>(`${this.baseUrl}/${tag.id}`, tag)
  }

  updateAtiva(dto: TagUpdateAtiva, id: number): Observable<Tag> {
    return this.httpClient.patch<Tag>(`${this.baseUrl}/${id}/update/ativa`, dto)
  }

  delete(tag: Tag): Observable<any> {
    return this.httpClient.delete<any>(`${this.baseUrl}/${tag.id}`)
  }

}
