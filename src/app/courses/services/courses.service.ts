import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Course } from '../models/course';
import { delay } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CoursesService {

  constructor(private httpClient: HttpClient) { }

  private readonly API = 'api/courses';

  findAll() {
    return this.httpClient.get<Course[]>(this.API).pipe(delay(200));
  }

  findById(id: string) {
    return this.httpClient.get<Course>(`${this.API}/${id}`);
  }

  save(record: Partial<Course>) {
    if(record._id){
      return this.update(record);
    }

    return this.create(record);
  }

  private create(record: Partial<Course>) {
    return this.httpClient.post<Course>(this.API, record);
  }

  private update(record: Partial<Course>) {
    return this.httpClient.put<Course>(`${this.API}/${record._id}`, record);
  }

  delete(id: string) {
    return this.httpClient.delete(`${this.API}/${id}`);
  }

}
