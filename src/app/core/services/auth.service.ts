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
      localStorage.getItem('role') as UserRole | null
    );

  readonly token =
    computed(() => this.tokenSignal());

  readonly username =
    computed(() => this.usernameSignal());

  readonly role =
    computed(() => this.roleSignal());

  readonly authenticated =
    computed(() => !!this.tokenSignal());

  readonly isAdmin =
    computed(
      () => this.roleSignal() === 'ADMIN'
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
        this.saveSession(response);
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

  private saveSession(
    response: AuthResponse
  ): void {

    localStorage.setItem(
      'token',
      response.token
    );

    localStorage.setItem(
      'username',
      response.username
    );

    localStorage.setItem(
      'role',
      response.role
    );

    this.tokenSignal.set(
      response.token
    );

    this.usernameSignal.set(
      response.username
    );

    this.roleSignal.set(
      response.role
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
    return localStorage.getItem('role') as UserRole | null;
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}
