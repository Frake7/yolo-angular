import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  
  categoryId !: number;

  private apiUrl : string = 'http://localhost:3000/';
  constructor(private http : HttpClient) { 
  }

  getAllTasks(categoryId: number): Observable<any> {
    if (categoryId == null) {
      return this.http.get<any>(this.apiUrl + "tasks");
    } else {
      return this.http.get<any>(this.apiUrl + "tasks?categoryId=" + categoryId);
    }
  }

  getAllCategories() : Observable<any> {
    return this.http.get<any>(this.apiUrl+'categories');
  }

  updateTask(task : any) : Observable<any> {
    return this.http.put<any>(this.apiUrl+'tasks/'+task.id, task)
  }

  createTask(task: any): Observable<any> {
    return this.http.post<any>(this.apiUrl + 'tasks', task);
  }
  
  updateCategory(category: any): Observable<any> {
    return this.http.put<any>(this.apiUrl + 'categories/' + category.id, category);
  }

  createCategory(category: any): Observable<any> {
    console.log("created");
    return this.http.post<any>(this.apiUrl + 'categories', category);
  }

  deleteCategory(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}categories/${id}`);
  }

  deleteTask(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}tasks/${id}`);
  }
}
