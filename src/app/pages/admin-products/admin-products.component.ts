import {
  Component,
  OnInit,
  signal
} from '@angular/core';

import {
  CommonModule,
  CurrencyPipe
} from '@angular/common';

import {
  FormsModule
} from '@angular/forms';

import {
  AdminService
} from '../../core/services/admin.service';

import {
  Product
} from '../../core/models/admin.models';

@Component({
  selector: 'app-admin-products',
  standalone: true,

  imports: [
    CommonModule,
    FormsModule,
    CurrencyPipe
  ],

  template: `
    <main class="page">

      <header class="page-header">

        <div>
          <h1>Administración de productos</h1>
          <p>Crear, editar y eliminar productos del catálogo</p>
        </div>

        <button
          type="button"
          class="primary"
          (click)="newProduct()"
        >
          + Nuevo producto
        </button>

      </header>

      @if (message()) {
        <div class="alert success">
          {{ message() }}
        </div>
      }

      @if (error()) {
        <div class="alert error">
          {{ error() }}
        </div>
      }

      <section class="layout">

        <div class="form-card">

          <h2>
            {{
              editingId() !== null
                ? 'Editar producto'
                : 'Nuevo producto'
            }}
          </h2>

          <form (ngSubmit)="save()">

            <label>
              Nombre

              <input
                type="text"
                name="name"
                [(ngModel)]="form.name"
                required
                maxlength="255"
              >
            </label>

            <label>
              Descripción

              <textarea
                name="description"
                [(ngModel)]="form.description"
                rows="4"
              ></textarea>
            </label>

            <div class="two-columns">

              <label>
                Precio

                <input
                  type="number"
                  name="price"
                  [(ngModel)]="form.price"
                  min="0.01"
                  step="0.01"
                  required
                >
              </label>

              <label>
                Stock

                <input
                  type="number"
                  name="stock"
                  [(ngModel)]="form.stock"
                  min="0"
                  step="1"
                  required
                >
              </label>

            </div>

            <label class="checkbox">
              <input
                type="checkbox"
                name="isActive"
                [(ngModel)]="form.isActive"
              >

              Producto activo
            </label>

            <div class="actions">

              <button
                type="submit"
                class="primary"
                [disabled]="saving()"
              >
                @if (saving()) {
                  Guardando...
                } @else {
                  {{
                    editingId() !== null
                      ? 'Actualizar'
                      : 'Crear producto'
                  }}
                }
              </button>

              @if (editingId() !== null) {
                <button
                  type="button"
                  class="secondary"
                  (click)="newProduct()"
                >
                  Cancelar
                </button>
              }

            </div>

          </form>

        </div>

        <div class="products-card">

          <div class="table-header">

            <div>
              <h2>Productos</h2>
              <span>{{ products().length }} registro(s)</span>
            </div>

            <button
              type="button"
              class="secondary"
              (click)="loadProducts()"
            >
              Actualizar
            </button>

          </div>

          @if (loading()) {
            <div class="state">
              Cargando productos...
            </div>
          }

          @if (!loading() && products().length === 0) {
            <div class="state">
              No hay productos registrados
            </div>
          }

          @if (products().length > 0) {

            <div class="table-wrapper">

              <table>

                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Producto</th>
                    <th>Precio</th>
                    <th>Stock</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>

                <tbody>

                  @for (product of products(); track product.id) {

                    <tr>

                      <td>
                        {{ product.id }}
                      </td>

                      <td>
                        <strong>
                          {{ product.name }}
                        </strong>

                        <small>
                          {{ product.description }}
                        </small>
                      </td>

                      <td>
                        {{
                          product.price |
                          currency:'COP':'symbol':'1.0-0'
                        }}
                      </td>

                      <td>
                        <span
                          [class.no-stock]="product.stock === 0"
                        >
                          {{ product.stock }}
                        </span>
                      </td>

                      <td>
                        <span
                          class="status"
                          [class.active]="product.isActive"
                          [class.inactive]="!product.isActive"
                        >
                          {{
                            product.isActive
                              ? 'Activo'
                              : 'Inactivo'
                          }}
                        </span>
                      </td>

                      <td>

                        <div class="row-actions">

                          <button
                            type="button"
                            class="edit"
                            (click)="editProduct(product)"
                          >
                            Editar
                          </button>

                          <button
                            type="button"
                            class="delete"
                            (click)="deleteProduct(product)"
                          >
                            Eliminar
                          </button>

                        </div>

                      </td>

                    </tr>

                  }

                </tbody>

              </table>

            </div>

          }

        </div>

      </section>

    </main>
  `,

  styles: [`
.page {
      width: min(1450px, 100%);
      margin: auto;
      padding: 38px 24px 60px;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      gap: 20px;
      margin-bottom: 28px;
    }

    .page-header h1 {
      margin: 0 0 6px;
      color: var(--dark);
      font-size: clamp(30px, 4vw, 44px);
      letter-spacing: -.04em;
    }

    .page-header p {
      margin: 0;
      color: var(--muted);
    }

    .layout {
      display: grid;
      grid-template-columns: minmax(320px, 390px) 1fr;
      gap: 24px;
      align-items: start;
    }

    .form-card {
      position: sticky;
      top: 105px;
      padding: 26px;
      border-radius: 24px;
      background: var(--dark);
      color: white;
      box-shadow: var(--shadow);
    }

    .products-card {
      padding: 24px;
      border: 1px solid var(--line);
      border-radius: 24px;
      background: var(--surface);
      box-shadow: var(--shadow-soft);
    }

    .form-card h2,
    .products-card h2 {
      margin-top: 0;
    }

    .form-card label {
      color: #d8e2e1;
    }

    label {
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin-bottom: 17px;
      font-size: 13px;
      font-weight: 700;
    }

    input,
    textarea {
      padding: 12px 14px;
      border: 1px solid var(--line);
      border-radius: 12px;
      outline: none;
      background: white;
      color: var(--ink);
    }

    input:focus,
    textarea:focus {
      border-color: var(--teal);
      box-shadow: 0 0 0 3px rgba(42,157,143,.12);
    }

    .two-columns {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }

    .checkbox {
      flex-direction: row;
      align-items: center;
      font-weight: 500;
    }

    .actions,
    .row-actions {
      display: flex;
      gap: 8px;
    }

    button {
      padding: 10px 15px;
      border: none;
      border-radius: 12px;
      font-weight: 800;
      cursor: pointer;
    }

    .primary {
      background: var(--accent);
      color: white;
      box-shadow: 0 8px 20px rgba(231,111,81,.22);
    }

    .primary:hover {
      background: var(--accent-dark);
    }

    .secondary {
      background: #ece8e0;
      color: var(--dark);
    }

    .form-card .secondary {
      background: rgba(255,255,255,.10);
      color: white;
    }

    .edit {
      background: var(--teal-soft);
      color: #187466;
    }

    .delete {
      background: #fbe4df;
      color: #b24735;
    }

    .alert {
      padding: 14px 17px;
      margin-bottom: 20px;
      border-radius: 13px;
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

    .table-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 20px;
      margin-bottom: 17px;
    }

    .table-header h2 {
      margin-bottom: 3px;
    }

    .table-header span {
      color: var(--muted);
      font-size: 12px;
    }

    .table-wrapper {
      overflow-x: auto;
      border: 1px solid var(--line);
      border-radius: 16px;
    }

    table {
      width: 100%;
      min-width: 760px;
      border-collapse: collapse;
    }

    th,
    td {
      padding: 14px;
      border-bottom: 1px solid var(--line);
      text-align: left;
    }

    th {
      background: #f2eee7;
      color: var(--muted);
      font-size: 11px;
      letter-spacing: .07em;
      text-transform: uppercase;
    }

    tbody tr:hover {
      background: #faf7f2;
    }

    td small {
      display: block;
      margin-top: 4px;
      color: var(--muted);
    }

    .status {
      display: inline-block;
      padding: 5px 10px;
      border-radius: 999px;
      font-size: 11px;
      font-weight: 800;
    }

    .active {
      background: var(--teal-soft);
      color: #187466;
    }

    .inactive {
      background: #eceae5;
      color: #6e706d;
    }

    .no-stock {
      color: var(--danger);
      font-weight: 900;
    }

    .state {
      padding: 40px;
      color: var(--muted);
      text-align: center;
    }

    @media (max-width: 950px) {
      .layout {
        grid-template-columns: 1fr;
      }

      .form-card {
        position: static;
      }

      .page-header {
        align-items: flex-start;
        flex-direction: column;
      }
    }
  `]
})
export class AdminProductsComponent
  implements OnInit {

  products =
    signal<Product[]>([]);

  loading =
    signal(false);

  saving =
    signal(false);

  error =
    signal('');

  message =
    signal('');

  editingId =
    signal<number | null>(null);

  form: Product =
    this.emptyProduct();

  constructor(
    private adminService:
      AdminService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  private emptyProduct(): Product {
    return {
      name: '',
      description: '',
      price: 0.01,
      stock: 0,
      isActive: true
    };
  }

  loadProducts(): void {

    this.loading.set(true);
    this.error.set('');

    this.adminService
      .getProducts()
      .subscribe({

        next: response => {
          this.products.set(response);
          this.loading.set(false);
        },

        error: error => {
          this.loading.set(false);

          this.error.set(
            error?.error?.message ??
            'No se pudieron cargar los productos'
          );
        }

      });
  }

  newProduct(): void {

    this.editingId.set(null);
    this.form = this.emptyProduct();

    this.error.set('');
    this.message.set('');
  }

  editProduct(
    product: Product
  ): void {

    if (product.id === undefined) {
      return;
    }

    this.editingId.set(product.id);

    this.form = {
      ...product
    };

    this.error.set('');
    this.message.set('');
  }

  save(): void {

    if (!this.form.name.trim()) {
      this.error.set(
        'El nombre es obligatorio'
      );
      return;
    }

    if (this.form.price < 0.01) {
      this.error.set(
        'El precio debe ser mayor o igual a 0.01'
      );
      return;
    }

    if (this.form.stock < 0) {
      this.error.set(
        'El stock no puede ser negativo'
      );
      return;
    }

    this.saving.set(true);
    this.error.set('');
    this.message.set('');

    const id =
      this.editingId();

    if (id === null) {
      this.create();
    } else {
      this.update(id);
    }
  }

  private create(): void {

    this.adminService
      .createProduct(this.form)
      .subscribe({

        next: product => {

          this.saving.set(false);

          this.products.update(
            current => [
              ...current,
              product
            ]
          );

          this.message.set(
            'Producto creado correctamente'
          );

          this.form =
            this.emptyProduct();
        },

        error: error => {

          this.saving.set(false);

          this.error.set(
            error?.error?.message ??
            'No se pudo crear el producto'
          );
        }

      });
  }

  private update(
    id: number
  ): void {

    const product: Product = {
      ...this.form,
      id
    };

    this.adminService
      .updateProduct(
        id,
        product
      )
      .subscribe({

        next: updated => {

          this.saving.set(false);

          this.products.update(
            current =>
              current.map(
                item =>
                  item.id === id
                    ? updated
                    : item
              )
          );

          this.message.set(
            'Producto actualizado correctamente'
          );

          this.editingId.set(null);
          this.form =
            this.emptyProduct();
        },

        error: error => {

          this.saving.set(false);

          this.error.set(
            error?.error?.message ??
            'No se pudo actualizar el producto'
          );
        }

      });
  }

  deleteProduct(
    product: Product
  ): void {

    if (product.id === undefined) {
      return;
    }

    const confirmed =
      confirm(
        `¿Eliminar el producto "${product.name}"?`
      );

    if (!confirmed) {
      return;
    }

    this.adminService
      .deleteProduct(product.id)
      .subscribe({

        next: () => {

          this.products.update(
            current =>
              current.filter(
                item =>
                  item.id !== product.id
              )
          );

          this.message.set(
            'Producto eliminado correctamente'
          );
        },

        error: error => {

          this.error.set(
            error?.error?.message ??
            'No se pudo eliminar el producto'
          );
        }

      });
  }
}
