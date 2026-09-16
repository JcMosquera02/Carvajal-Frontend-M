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
      position: relative;
      min-height: 100vh;
      display: grid;
      place-items: center;
      padding: 40px 24px;
      overflow: hidden;
      background:
        linear-gradient(
          145deg,
          #f6f1e8 0%,
          #e7efe9 55%,
          #dff3ef 100%
        );
    }

    .page::before {
      content: '';
      position: absolute;
      width: 420px;
      height: 420px;
      left: -150px;
      top: -150px;
      border-radius: 50%;
      background: var(--accent);
      opacity: .13;
    }

    .page::after {
      content: '';
      position: absolute;
      width: 340px;
      height: 340px;
      right: -120px;
      bottom: -100px;
      border-radius: 50%;
      background: var(--teal);
      opacity: .18;
    }

    .card {
      position: relative;
      z-index: 1;
      width: min(500px, 100%);
      padding: 40px;
      border: 1px solid rgba(255,255,255,.8);
      border-radius: 30px;
      background: rgba(255,253,249,.93);
      box-shadow: var(--shadow);
    }

    h1 {
      margin: 0 0 30px;
      color: var(--dark);
      font-size: 34px;
      letter-spacing: -.03em;
    }

    h1::after {
      content: '';
      display: block;
      width: 56px;
      height: 5px;
      margin-top: 12px;
      border-radius: 999px;
      background: var(--accent);
    }

    label {
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin-bottom: 18px;
      color: var(--dark);
      font-size: 13px;
      font-weight: 700;
    }

    input {
      padding: 14px 16px;
      border: 1px solid var(--line);
      border-radius: 14px;
      outline: none;
      background: white;
    }

    input:focus {
      border-color: var(--teal);
      box-shadow: 0 0 0 4px rgba(42,157,143,.12);
    }

    button {
      width: 100%;
      padding: 14px;
      margin-bottom: 20px;
      border: none;
      border-radius: 14px;
      background: var(--dark);
      color: white;
      font-weight: 800;
      cursor: pointer;
    }

    button:hover:not(:disabled) {
      background: var(--teal);
    }

    a {
      color: var(--accent);
      font-weight: 800;
      text-decoration: none;
    }

    .error {
      padding: 13px 15px;
      margin-bottom: 18px;
      border-radius: 12px;
      background: #fff0ee;
      color: #a73d37;
    }

    @media (max-width: 520px) {
      .card {
        padding: 30px 24px;
      }
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
