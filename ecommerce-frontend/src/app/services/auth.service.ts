import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../app.config';
import { map, tap } from 'rxjs/operators';

export interface SessionUser {
  userId: number;
  name: string;
  email: string;
  role: string; // 'USER' | 'ADMIN' - allowing string for flexibility
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private base = `${environment.apiBase}/api/auth`;
  private _user = signal<SessionUser | null>(null);

  constructor(private http: HttpClient) {
    // ✅ Load user from localStorage on service initialization
    this.loadUserFromStorage();
  }

  user = this._user.asReadonly();

  private loadUserFromStorage() {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        this._user.set(user);
      } catch (e) {
        console.error('Error parsing stored user data', e);
        localStorage.removeItem('user');
      }
    }
  }

  private saveUserToStorage(user: SessionUser | null) {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }

  login(email: string, password: string) {
    return this.http.post<any>(`${this.base}/login`, { email, password }).pipe(
      map((r) => r.data as SessionUser),
      tap((u) => {
        this._user.set(u);
        this.saveUserToStorage(u); // ✅ Save to localStorage
      })
    );
  }

  me() {
    return this.http.get<any>(`${this.base}/me`).pipe(
      map((r) => r.data as SessionUser),
      tap((u) => {
        this._user.set(u);
        this.saveUserToStorage(u); // ✅ Save to localStorage
      })
    );
  }

  logout() {
    return this.http.post<any>(`${this.base}/logout`, {}).pipe(
      tap(() => {
        this._user.set(null);
        this.saveUserToStorage(null); // ✅ Clear from localStorage
      })
    );
  }
}
