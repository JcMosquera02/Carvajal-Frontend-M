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
      position: relative;
      min-height: 100vh;
      display: grid;
      place-items: center;
      padding: 40px 24px;
      overflow: hidden;
      background:
        linear-gradient(
          125deg,
          #172426 0%,
          #21383a 52%,
          #2a9d8f 100%
        );
    }

    .auth-page::before {
      content: 'TU LISTA, TU ESTILO';
      position: absolute;
      left: 4vw;
      bottom: 7vh;
      max-width: 500px;
      color: rgba(255,255,255,.08);
      font-size: clamp(56px, 9vw, 130px);
      font-weight: 900;
      line-height: .82;
      letter-spacing: -.06em;
      pointer-events: none;
    }

    .auth-page::after {
      content: '';
      position: absolute;
      width: 320px;
      height: 320px;
      top: -90px;
      right: -70px;
      border-radius: 50%;
      background: rgba(231,111,81,.22);
      filter: blur(4px);
    }

    .card {
      position: relative;
      z-index: 2;
      width: min(460px, 100%);
      padding: 42px;
      border: 1px solid rgba(255,255,255,.35);
      border-radius: 30px;
      background: rgba(255,253,249,.96);
      box-shadow: 0 35px 80px rgba(0,0,0,.24);
    }

    h1 {
      margin: 0;
      color: var(--accent);
      font-size: 14px;
      font-weight: 800;
      letter-spacing: .16em;
      text-transform: uppercase;
    }

    h2 {
      margin: 10px 0 30px;
      color: var(--dark);
      font-size: 34px;
      line-height: 1.05;
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
      width: 100%;
      padding: 14px 16px;
      border: 1px solid var(--line);
      border-radius: 14px;
      outline: none;
      background: #fff;
      color: var(--ink);
      transition: .2s ease;
    }

    input:focus {
      border-color: var(--teal);
      box-shadow: 0 0 0 4px rgba(42,157,143,.12);
    }

    button {
      width: 100%;
      padding: 14px;
      border: none;
      border-radius: 14px;
      background: var(--accent);
      color: white;
      font-weight: 800;
      cursor: pointer;
      box-shadow: 0 12px 25px rgba(231,111,81,.25);
    }

    button:hover:not(:disabled) {
      background: var(--accent-dark);
    }

    button:disabled {
      opacity: .6;
      cursor: wait;
    }

    .error {
      padding: 13px 15px;
      margin-bottom: 18px;
      border-left: 4px solid var(--danger);
      border-radius: 10px;
      background: #fff0ee;
      color: #a73d37;
    }

    p {
      margin: 22px 0 0;
      color: var(--muted);
      text-align: center;
      font-size: 14px;
    }

    p a {
      color: var(--teal);
      font-weight: 800;
      text-decoration: none;
    }

    @media (max-width: 520px) {
      .card {
        padding: 30px 24px;
        border-radius: 24px;
      }

      h2 {
        font-size: 29px;
      }
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
