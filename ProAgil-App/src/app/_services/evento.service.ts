import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Evento } from '../_models/Evento';

@Injectable({
  providedIn: 'root'
})
export class EventoService {
  baseURL = 'http://localhost:5000/api/evento';
 

constructor(private http: HttpClient) {
  // tslint:disable-next-line: object-literal-key-quotes
}

  // tslint:disable-next-line: typedef
  getAllEvento(): Observable<Evento[]>{
    // tslint:disable-next-line: object-literal-key-quotes

    return this.http.get<Evento[]>(this.baseURL);
  }
  getEventoById(id: number): Observable<Evento>{
    return this.http.get<Evento>(`${this.baseURL}/${id}`);
  }
  getEventoByTema(tema: string): Observable<Evento[]>{
    return this.http.get<Evento[]>(`${this.baseURL}/tema/${tema}`);
  }

  // tslint:disable-next-line: typedef
  postUpload(file: File, name: string){
    const fileToUpload = file[0] as File;
    const formData = new FormData();
    formData.append('file', fileToUpload, name);

    return this.http.post(`${this.baseURL}/upload`, formData);
  }
  // tslint:disable-next-line: typedef
  postEvento(evento: Evento){
    return this.http.post(this.baseURL, evento);
  }

  // tslint:disable-next-line: typedef
  putEvento(evento: Evento){
    return this.http.put(`${this.baseURL}/${evento.id}`, evento);
  }

  // tslint:disable-next-line: typedef
  deleteEvento(id: number){
    return this.http.delete(`${this.baseURL}/${id}`);
  }

}
