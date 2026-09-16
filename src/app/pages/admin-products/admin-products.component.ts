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
      max-width: 1400px;
      margin: auto;
      padding: 35px 25px;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 20px;
      margin-bottom: 30px;
    }

    .page-header h1 {
      margin: 0 0 5px;
    }

    .page-header p {
      margin: 0;
      color: #666;
    }

    .layout {
      display: grid;
      grid-template-columns: minmax(300px, 380px) 1fr;
      gap: 25px;
      align-items: start;
    }

    .form-card,
    .products-card {
      background: white;
      border: 1px solid #e2e6ea;
      border-radius: 14px;
      padding: 22px;
      box-shadow: 0 5px 15px rgba(0,0,0,.05);
    }

    label {
      display: flex;
      flex-direction: column;
      gap: 7px;
      margin-bottom: 17px;
      font-weight: 600;
    }

    input,
    textarea {
      padding: 11px;
      border: 1px solid #d3d9df;
      border-radius: 8px;
      font-family: inherit;
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

    .actions {
      display: flex;
      gap: 10px;
    }

    button {
      border: none;
      border-radius: 8px;
      padding: 10px 14px;
      cursor: pointer;
      font-weight: 600;
    }

    .primary {
      background: #005baa;
      color: white;
    }

    .secondary {
      background: #edf1f5;
      color: #333;
    }

    .edit {
      background: #e8f1fb;
      color: #005baa;
    }

    .delete {
      background: #ffeded;
      color: #b42318;
    }

    .alert {
      padding: 14px;
      margin-bottom: 20px;
      border-radius: 9px;
    }

    .success {
      background: #e5f6e8;
      color: #1b6b2d;
    }

    .error {
      background: #ffe5e5;
      color: #a02222;
    }

    .table-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
    }

    .table-wrapper {
      overflow-x: auto;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      min-width: 700px;
    }

    th,
    td {
      padding: 13px;
      text-align: left;
      border-bottom: 1px solid #eee;
    }

    th {
      background: #f7f9fb;
    }

    td small {
      display: block;
      color: #777;
      margin-top: 4px;
    }

    .status {
      padding: 5px 9px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
    }

    .active {
      background: #e6f5e9;
      color: #197333;
    }

    .inactive {
      background: #eeeeee;
      color: #666;
    }

    .no-stock {
      color: #c62828;
      font-weight: 700;
    }

    .row-actions {
      display: flex;
      gap: 7px;
    }

    .state {
      padding: 35px;
      text-align: center;
      color: #777;
    }

    @media (max-width: 900px) {
      .layout {
        grid-template-columns: 1fr;
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
