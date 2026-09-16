import {
  Injectable,
  computed,
  signal
} from '@angular/core';

import {
  HttpClient
} from '@angular/common/http';

import {
  Observable,
  tap
} from 'rxjs';

import {
  AuthRequest,
  AuthResponse,
  RegisterRequest,
  UserRole
} from '../models/auth.models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly apiUrl = '/api/auth';

  private normalizeRole(
    role: string | null
  ): UserRole | null {

    if (!role) {
      return null;
    }

    const normalized =
      role
        .replace('ROLE_', '')
        .trim()
        .toUpperCase();

    if (
      normalized === 'ADMIN' ||
      normalized === 'CLIENT'
    ) {
      return normalized as UserRole;
    }

    return null;
  }

  private readonly tokenSignal =
    signal<string | null>(
      localStorage.getItem('token')
    );

  private readonly usernameSignal =
    signal<string | null>(
      localStorage.getItem('username')
    );

  private readonly roleSignal =
    signal<UserRole | null>(
      this.normalizeRole(
        localStorage.getItem('role')
      )
    );

  readonly token =
    computed(() =>
      this.tokenSignal()
    );

  readonly username =
    computed(() =>
      this.usernameSignal()
    );

  readonly role =
    computed(() =>
      this.roleSignal()
    );

  readonly authenticated =
    computed(() =>
      !!this.tokenSignal()
    );

  readonly isAdmin =
    computed(() =>
      this.roleSignal() === 'ADMIN'
    );

  constructor(
    private http: HttpClient
  ) {}

  login(
    credentials: AuthRequest
  ): Observable<AuthResponse> {

    return this.http.post<AuthResponse>(
      `${this.apiUrl}/login`,
      credentials
    ).pipe(
      tap(response => {

        const normalizedRole =
          this.normalizeRole(
            response.role
          );

        localStorage.setItem(
          'token',
          response.token
        );

        localStorage.setItem(
          'username',
          response.username
        );

        if (normalizedRole) {
          localStorage.setItem(
            'role',
            normalizedRole
          );
        }

        this.tokenSignal.set(
          response.token
        );

        this.usernameSignal.set(
          response.username
        );

        this.roleSignal.set(
          normalizedRole
        );
      })
    );
  }

  register(
    data: RegisterRequest
  ): Observable<unknown> {

    return this.http.post(
      `${this.apiUrl}/register`,
      data
    );
  }

  logout(): void {

    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('role');

    this.tokenSignal.set(null);
    this.usernameSignal.set(null);
    this.roleSignal.set(null);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getRole(): UserRole | null {
    return this.normalizeRole(
      localStorage.getItem('role')
    );
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}
