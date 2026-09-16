import {
  Component,
  signal
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  FormsModule
} from '@angular/forms';

import {
  Router,
  RouterLink
} from '@angular/router';

import {
  AuthService
} from '../../core/services/auth.service';

import {
  AuthRequest
} from '../../core/models/auth.models';

@Component({
  selector: 'app-login',
  standalone: true,

  imports: [
    CommonModule,
    FormsModule,
    RouterLink
  ],

  template: `
    <main class="auth-page">

      <section class="card">

        <h1>
          Carvajal Wishlist
        </h1>

        <h2>
          Iniciar sesión
        </h2>

        @if (error()) {
          <div class="error">
            {{ error() }}
          </div>
        }

        <form (ngSubmit)="login()">

          <label>
            Usuario

            <input
              type="text"
              name="username"
              [(ngModel)]="form.username"
              required
            >
          </label>

          <label>
            Contraseña

            <input
              type="password"
              name="password"
              [(ngModel)]="form.password"
              required
            >
          </label>

          <button
            type="submit"
            [disabled]="loading()"
          >
            @if (loading()) {
              Ingresando...
            } @else {
              Iniciar sesión
            }
          </button>

        </form>

        <p>
          ¿No tienes cuenta?

          <a routerLink="/register">
            Registrarse
          </a>
        </p>

      </section>

    </main>
  `,

  styles: [`
    .auth-page {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 25px;
      background: #f5f7fa;
    }

    .card {
      width: 100%;
      max-width: 430px;
      padding: 35px;
      background: white;
      border-radius: 16px;
      box-shadow: 0 12px 35px rgba(0,0,0,.08);
    }

    h1 {
      color: #005baa;
    }

    label {
      display: flex;
      flex-direction: column;
      gap: 7px;
      margin-bottom: 18px;
      font-weight: 600;
    }

    input {
      padding: 13px;
      border: 1px solid #d4dae1;
      border-radius: 8px;
    }

    button {
      width: 100%;
      padding: 13px;
      border: none;
      border-radius: 8px;
      background: #005baa;
      color: white;
      cursor: pointer;
    }

    .error {
      padding: 12px;
      margin-bottom: 15px;
      background: #ffe4e4;
      color: #a02222;
      border-radius: 8px;
    }
  `]
})
export class LoginComponent {

  form: AuthRequest = {
    username: '',
    password: ''
  };

  loading =
    signal(false);

  error =
    signal('');

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  login(): void {

    if (
      !this.form.username ||
      !this.form.password
    ) {
      this.error.set(
        'Completa todos los campos'
      );
      return;
    }

    this.loading.set(true);
    this.error.set('');

    this.authService
      .login(this.form)
      .subscribe({

        next: response => {

          this.loading.set(false);

          if (
            response.role === 'ADMIN'
          ) {
            this.router.navigate([
              '/admin/products'
            ]);
          } else {
            this.router.navigate([
              '/catalog'
            ]);
          }
        },

        error: error => {

          this.loading.set(false);

          this.error.set(
            error?.error?.message ??
            'Usuario o contraseña incorrectos'
          );
        }

      });
  }
}
