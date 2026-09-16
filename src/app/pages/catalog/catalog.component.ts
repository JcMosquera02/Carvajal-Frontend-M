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
  Product
} from '../../core/models/product.models';

import {
  ProductService
} from '../../core/services/product.service';

@Component({
  selector: 'app-catalog',
  standalone: true,

  imports: [
    CommonModule,
    FormsModule,
    CurrencyPipe
  ],

  template: `
    <main class="catalog-page">

      <section class="header">

        <div>
          <h1>
            Catálogo de productos
          </h1>

          <p>
            Consulta los productos disponibles
          </p>
        </div>

        <input
          type="text"
          placeholder="Buscar producto..."
          [ngModel]="search()"
          (ngModelChange)="search.set($event)"
        >

      </section>

      @if (loading()) {

        <p>
          Cargando productos...
        </p>

      } @else if (error()) {

        <div class="error">
          {{ error() }}
        </div>

      } @else {

        <section class="grid">

          @for (
            product of filteredProducts();
            track product.id
          ) {

            <article class="card">

              <div class="status">

                @if (
                  product.stock > 0
                ) {

                  <span class="available">
                    Disponible
                  </span>

                } @else {

                  <span class="unavailable">
                    Agotado
                  </span>

                }

              </div>

              <h2>
                {{ product.name }}
              </h2>

              <p class="description">
                {{ product.description }}
              </p>

              <p class="price">
                {{
                  product.price |
                  currency:'COP':
                  'symbol-narrow':
                  '1.0-0'
                }}
              </p>

              <p>
                Stock:
                {{ product.stock }}
              </p>

            </article>

          } @empty {

            <p>
              No se encontraron productos
            </p>

          }

        </section>

      }

    </main>
  `,

  styles: [`
    .catalog-page {
      padding: 30px;
      max-width: 1200px;
      margin: auto;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 20px;
      margin-bottom: 30px;
      flex-wrap: wrap;
    }

    .header input {
      min-width: 280px;
      padding: 12px;
      border: 1px solid #d5dbe2;
      border-radius: 8px;
    }

    .grid {
      display: grid;
      grid-template-columns:
        repeat(
          auto-fit,
          minmax(250px, 1fr)
        );
      gap: 20px;
    }

    .card {
      background: white;
      padding: 22px;
      border-radius: 14px;
      box-shadow:
        0 8px 25px rgba(0,0,0,.08);
    }

    .description {
      color: #555;
      min-height: 45px;
    }

    .price {
      font-size: 1.3rem;
      font-weight: bold;
      color: #005baa;
    }

    .available {
      color: #177245;
      font-weight: 600;
    }

    .unavailable {
      color: #b42318;
      font-weight: 600;
    }

    .error {
      padding: 15px;
      border-radius: 8px;
      background: #ffe4e4;
      color: #a02222;
    }
  `]
})
export class CatalogComponent
  implements OnInit {

  products =
    signal<Product[]>([]);

  search =
    signal('');

  loading =
    signal(true);

  error =
    signal('');

  constructor(
    private productService:
      ProductService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {

    this.loading.set(true);
    this.error.set('');

    this.productService
      .getProducts()
      .subscribe({

        next: products => {

          this.products.set(
            products.filter(
              product =>
                product.isActive
            )
          );

          this.loading.set(false);
        },

        error: () => {

          this.error.set(
            'No se pudieron cargar los productos'
          );

          this.loading.set(false);
        }

      });
  }

  filteredProducts():
    Product[] {

    const term =
      this.search()
        .trim()
        .toLowerCase();

    if (!term) {
      return this.products();
    }

    return this.products()
      .filter(product =>

        product.name
          .toLowerCase()
          .includes(term)

        ||

        product.description
          .toLowerCase()
          .includes(term)

      );
  }
}
