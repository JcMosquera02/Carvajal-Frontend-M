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
  AdminService
} from '../../core/services/admin.service';

import {
  UserRole,
  UserSummary
} from '../../core/models/admin.models';

@Component({
  selector: 'app-admin-role',
  standalone: true,

  imports: [
    CommonModule,
    FormsModule
  ],

  template: `
    <main class="page">

      <section class="card">

        <div class="icon">
          👤
        </div>

        <h1>
          Administración de roles
        </h1>

        <p class="description">
          Cambia el rol de un usuario mediante su identificador
        </p>

        @if (error()) {

          <div class="alert error">
            {{ error() }}
          </div>

        }

        @if (message()) {

          <div class="alert success">
            {{ message() }}
          </div>

        }

        <form
          (ngSubmit)="updateRole()"
        >

          <label>

            ID del usuario

            <input
              type="number"
              min="1"
              name="userId"
              [(ngModel)]="userId"
              required
              placeholder="Ejemplo: 1"
            >

          </label>

          <label>

            Nuevo rol

            <select
              name="role"
              [(ngModel)]="role"
            >

              <option value="CLIENT">
                CLIENT
              </option>

              <option value="ADMIN">
                ADMIN
              </option>

            </select>

          </label>

          <button
            type="submit"
            [disabled]="loading()"
          >

            @if (loading()) {
              Actualizando...
            } @else {
              Actualizar rol
            }

          </button>

        </form>

        @if (updatedUser()) {

          <section class="result">

            <h2>
              Usuario actualizado
            </h2>

            <div class="row">
              <span>ID</span>
              <strong>
                {{ updatedUser()?.id }}
              </strong>
            </div>

            <div class="row">
              <span>Usuario</span>
              <strong>
                {{ updatedUser()?.username }}
              </strong>
            </div>

            <div class="row">
              <span>Email</span>
              <strong>
                {{ updatedUser()?.email }}
              </strong>
            </div>

            <div class="row">
              <span>Rol</span>
              <strong>
                {{ updatedUser()?.role }}
              </strong>
            </div>

          </section>

        }

      </section>

    </main>
  `,

  styles: [`
.page {
      min-height: calc(100vh - 90px);
      display: grid;
      place-items: start center;
      padding: 50px 20px;
      background:
        radial-gradient(
          circle at 80% 15%,
          rgba(42,157,143,.12),
          transparent 24%
        );
    }

    .card {
      width: min(560px, 100%);
      padding: 34px;
      border: 1px solid var(--line);
      border-radius: 26px;
      background: var(--surface);
      box-shadow: var(--shadow);
    }

    .icon {
      width: 62px;
      height: 62px;
      display: grid;
      place-items: center;
      border-radius: 18px;
      background: var(--dark);
      color: white;
      font-size: 27px;
      transform: rotate(-4deg);
    }

    h1 {
      margin: 22px 0 7px;
      color: var(--dark);
      font-size: 30px;
      letter-spacing: -.03em;
    }

    .description {
      margin-bottom: 27px;
      color: var(--muted);
    }

    label {
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin-bottom: 18px;
      color: var(--dark);
      font-size: 13px;
      font-weight: 800;
    }

    input,
    select {
      padding: 13px 15px;
      border: 1px solid var(--line);
      border-radius: 13px;
      outline: none;
      background: white;
    }

    input:focus,
    select:focus {
      border-color: var(--teal);
      box-shadow: 0 0 0 4px rgba(42,157,143,.11);
    }

    button {
      width: 100%;
      padding: 14px;
      border: none;
      border-radius: 14px;
      background: var(--accent);
      color: white;
      font-weight: 900;
      cursor: pointer;
    }

    button:hover:not(:disabled) {
      background: var(--accent-dark);
    }

    button:disabled {
      opacity: .6;
    }

    .alert {
      padding: 13px 16px;
      margin-bottom: 18px;
      border-radius: 12px;
    }

    .success {
      border-left: 5px solid var(--teal);
      background: #eef9f6;
      color: #176d60;
    }

    .error {
      border-left: 5px solid var(--danger);
      background: #fff0ee;
      color: #a34038;
    }

    .result {
      margin-top: 28px;
      padding: 22px;
      border-radius: 18px;
      background: #f1ede6;
    }

    .result h2 {
      margin-top: 0;
      font-size: 18px;
    }

    .row {
      display: flex;
      justify-content: space-between;
      gap: 20px;
      padding: 10px 0;
      border-bottom: 1px dashed #d7d0c5;
    }

    .row:last-child {
      border-bottom: 0;
    }

    .row span {
      color: var(--muted);
    }
  `]
})
export class AdminRoleComponent {

  userId: number | null =
    null;

  role: UserRole =
    'CLIENT';

  loading =
    signal(false);

  error =
    signal('');

  message =
    signal('');

  updatedUser =
    signal<UserSummary | null>(null);

  constructor(
    private adminService:
      AdminService
  ) {}

  updateRole(): void {

    if (
      this.userId === null ||
      this.userId < 1
    ) {

      this.error.set(
        'Ingresa un ID de usuario válido'
      );

      return;
    }

    this.loading.set(true);
    this.error.set('');
    this.message.set('');
    this.updatedUser.set(null);

    this.adminService
      .updateUserRole(
        this.userId,
        this.role
      )
      .subscribe({

        next: response => {

          this.loading.set(false);

          this.updatedUser.set(
            response
          );

          this.message.set(
            'Rol actualizado correctamente'
          );
        },

        error: error => {

          this.loading.set(false);

          this.error.set(
            error?.error?.message ??
            'No se pudo actualizar el rol'
          );
        }

      });
  }
}
