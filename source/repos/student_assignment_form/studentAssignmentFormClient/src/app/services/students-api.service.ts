import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IStudent } from '../models/student';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class StudentsApiService {
  

  constructor(private http: HttpClient) { }

  getStudent(): Observable<IStudent> {
    return this.http.get('https://localhost:44336/api/Students/GetAllStudents',{}) as Observable<IStudent>;
  }

  
  updateStudentsList(student: IStudent): Observable<any> {
    return this.http.post('https://localhost:44336/api/Students/UpdateStudentsList',{
      body: student
    });
  }
}
