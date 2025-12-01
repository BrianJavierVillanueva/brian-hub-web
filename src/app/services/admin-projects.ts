import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Project } from './projects';
import { environment } from '../../environments/environment';

export interface ProjectInput {
  title: string;
  shortDescription: string;
  longDescription?: string | null;
  techStack: string;
  githubUrl?: string | null;
  demoUrl?: string | null;
  imageUrl?: string | null;
  iframe: boolean;
  visible: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class AdminProjectsService {
  private apiUrl = `${environment.apiUrl}/admin/projects`;
  private authHeader: string | null = null;

  constructor(private http: HttpClient) {}

  setCredentials(username: string, password: string) {
    this.authHeader = 'Basic ' + btoa(`${username}:${password}`);
  }

  clearCredentials() {
    this.authHeader = null;
  }

  private withAuth() {
    if (!this.authHeader) {
      return {};
    }
    return {
      headers: new HttpHeaders({
        Authorization: this.authHeader,
      }),
    };
  }

  listAll(): Observable<Project[]> {
    return this.http.get<Project[]>(this.apiUrl, this.withAuth());
  }

  create(payload: ProjectInput): Observable<Project> {
    return this.http.post<Project>(this.apiUrl, payload, this.withAuth());
  }

  update(id: number, payload: ProjectInput): Observable<Project> {
    return this.http.put<Project>(`${this.apiUrl}/${id}`, payload, this.withAuth());
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, this.withAuth());
  }
}
