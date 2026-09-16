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
      min-height: calc(100vh - 70px);
      display: flex;
      justify-content: center;
      align-items: flex-start;
      padding: 45px 20px;
      background: #f5f7fa;
    }

    .card {
      width: 100%;
      max-width: 500px;
      background: white;
      padding: 32px;
      border-radius: 15px;
      box-shadow:
        0 10px 30px rgba(0,0,0,.08);
    }

    .icon {
      width: 55px;
      height: 55px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #edf3f9;
      border-radius: 15px;
      font-size: 25px;
    }

    h1 {
      margin-bottom: 7px;
    }

    .description {
      color: #777;
      margin-bottom: 25px;
    }

    label {
      display: flex;
      flex-direction: column;
      gap: 7px;
      margin-bottom: 18px;
      font-weight: 600;
    }

    input,
    select {
      padding: 12px;
      border: 1px solid #d4dae1;
      border-radius: 8px;
      background: white;
    }

    button {
      width: 100%;
      padding: 13px;
      border: none;
      border-radius: 8px;
      background: #005baa;
      color: white;
      font-weight: 600;
      cursor: pointer;
    }

    button:disabled {
      opacity: .6;
    }

    .alert {
      padding: 13px;
      margin-bottom: 18px;
      border-radius: 8px;
    }

    .success {
      background: #e4f7e7;
      color: #176b2c;
    }

    .error {
      background: #ffe4e4;
      color: #a02222;
    }

    .result {
      margin-top: 25px;
      padding-top: 20px;
      border-top: 1px solid #eee;
    }

    .result h2 {
      font-size: 18px;
    }

    .row {
      display: flex;
      justify-content: space-between;
      gap: 20px;
      padding: 8px 0;
    }

    .row span {
      color: #777;
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
