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
  RegisterRequest
} from '../../core/models/auth.models';

@Component({
  selector: 'app-register',
  standalone: true,

  imports: [
    CommonModule,
    FormsModule,
    RouterLink
  ],

  template: `
    <main class="page">

      <section class="card">

        <h1>
          Crear cuenta
        </h1>

        @if (error()) {
          <div class="error">
            {{ error() }}
          </div>
        }

        <form (ngSubmit)="register()">

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
            Correo

            <input
              type="email"
              name="email"
              [(ngModel)]="form.email"
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
              Registrando...
            } @else {
              Crear cuenta
            }
          </button>

        </form>

        <a routerLink="/login">
          Volver al login
        </a>

      </section>

    </main>
  `,

  styles: [`
    .page {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #f5f7fa;
    }

    .card {
      width: 100%;
      max-width: 450px;
      padding: 35px;
      background: white;
      border-radius: 15px;
      box-shadow: 0 12px 35px rgba(0,0,0,.08);
    }

    label {
      display: flex;
      flex-direction: column;
      gap: 7px;
      margin-bottom: 17px;
    }

    input {
      padding: 12px;
      border: 1px solid #ccc;
      border-radius: 8px;
    }

    button {
      width: 100%;
      padding: 13px;
      margin-bottom: 20px;
      border: none;
      border-radius: 8px;
      background: #005baa;
      color: white;
    }

    .error {
      padding: 12px;
      background: #ffe4e4;
      color: #a02222;
      border-radius: 8px;
      margin-bottom: 15px;
    }
  `]
})
export class RegisterComponent {

  form: RegisterRequest = {
    username: '',
    email: '',
    password: '',
    role: 'CLIENT'
  };

  loading =
    signal(false);

  error =
    signal('');

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  register(): void {

    this.loading.set(true);
    this.error.set('');

    this.authService
      .register(this.form)
      .subscribe({

        next: () => {

          this.loading.set(false);

          this.router.navigate([
            '/login'
          ]);
        },

        error: error => {

          this.loading.set(false);

          this.error.set(
            error?.error?.message ??
            'No se pudo registrar el usuario'
          );
        }

      });
  }
}
