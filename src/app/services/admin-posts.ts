import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Post {
  id: number;
  title: string;
  slug: string;
  shortDescription: string;
  longDescription?: string | null;
  techStack?: string | null;
  githubUrl?: string | null;
  demoUrl?: string | null;
  imageUrl?: string | null;
  excerpt?: string | null;
  content: string;
  iframe: boolean;
  visible: boolean;
  published: boolean;
  publishedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PostInput {
  title: string;
  slug: string;
  shortDescription: string;
  longDescription?: string | null;
  techStack?: string | null;
  githubUrl?: string | null;
  demoUrl?: string | null;
  imageUrl?: string | null;
  excerpt?: string | null;
  content: string;
  iframe: boolean;
  visible: boolean;
  published: boolean;
}

@Injectable({ providedIn: 'root' })
export class AdminPostsService {
  private apiUrl = `${environment.apiUrl}/posts`;
  private authHeader: string | null = null;

  constructor(private http: HttpClient) {}

  setCredentials(username: string, password: string) {
    this.authHeader = 'Basic ' + btoa(`${username}:${password}`);
  }

  clearCredentials() {
    this.authHeader = null;
  }

  private withAuth() {
    if (!this.authHeader) return {};
    return { headers: new HttpHeaders({ Authorization: this.authHeader }) };
  }

  list(includeUnpublished = true): Observable<Post[]> {
    const params = new HttpParams().set('publishedOnly', (!includeUnpublished).toString());
    return this.http.get<Post[]>(this.apiUrl, { ...this.withAuth(), params });
  }

  getBySlug(slug: string, includeUnpublished = true): Observable<Post> {
    const params = new HttpParams().set('includeUnpublished', includeUnpublished.toString());
    return this.http.get<Post>(`${this.apiUrl}/${slug}`, { ...this.withAuth(), params });
  }

  create(payload: PostInput): Observable<Post> {
    return this.http.post<Post>(this.apiUrl, payload, this.withAuth());
  }

  update(id: number, payload: PostInput): Observable<Post> {
    return this.http.put<Post>(`${this.apiUrl}/${id}`, payload, this.withAuth());
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, this.withAuth());
  }
}
