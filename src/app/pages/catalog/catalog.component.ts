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

import {
  WishlistService
} from '../../core/services/wishlist.service';

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
            y agrégalos a tu lista de deseos
          </p>

        </div>

        <input
          type="text"
          placeholder="Buscar producto..."
          [ngModel]="search()"
          (ngModelChange)="search.set($event)"
        >

      </section>

      @if (success()) {

        <div class="message success">
          {{ success() }}
        </div>

      }

      @if (wishlistError()) {

        <div class="message error">
          {{ wishlistError() }}
        </div>

      }

      @if (loading()) {

        <div class="state">
          Cargando productos...
        </div>

      } @else if (error()) {

        <div class="message error">
          {{ error() }}
        </div>

      } @else {

        <section class="grid">

          @for (
            product of filteredProducts();
            track product.id
          ) {

            <article class="card">

              <img
                [src]="getProductImage(product.name)"
                [alt]="product.name"
                class="product-image"
              >

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
                  currency:
                    'COP':
                    'symbol':
                    '1.0-0'
                }}

              </p>

              <p class="stock">
                Stock:
                {{ product.stock }}
              </p>

              <button
                type="button"
                class="wishlist-button"
                [disabled]="
                  product.stock <= 0 ||
                  addingProductId() === product.id
                "
                (click)="addToWishlist(product)"
              >

                @if (
                  addingProductId() === product.id
                ) {

                  Agregando...

                } @else {

                  Agregar a wishlist

                }

              </button>

            </article>

          } @empty {

            <div class="state">
              No se encontraron productos
            </div>

          }

        </section>

      }

    </main>
  `,

  styles: [`

    .catalog-page {
      padding: 35px 25px;
      max-width: 1200px;
      margin: auto;
    }

    .header {
      display: flex;
      justify-content:
        space-between;
      align-items: center;
      gap: 20px;
      margin-bottom: 30px;
      flex-wrap: wrap;
    }

    .header h1 {
      margin-bottom: 5px;
    }

    .header p {
      margin: 0;
      color: #666;
    }

    .header input {
      min-width: 280px;
      padding: 12px;
      border:
        1px solid #d5dbe2;
      border-radius: 8px;
    }

    .grid {
      display: grid;
      grid-template-columns:
        repeat(
          auto-fit,
          minmax(260px, 1fr)
        );
      gap: 20px;
    }

    .card {
      display: flex;
      flex-direction: column;
      padding: 22px;
      background: white;
      border:
        1px solid #e5e9ed;
      border-radius: 14px;
      box-shadow:
        0 8px 25px
        rgba(0,0,0,.06);
    }

    .product-image {
      width: 100%;
      height: 180px;
      object-fit: contain;
      border-radius: 10px;
      margin-bottom: 15px;
      background: #f7f7f7;
      padding: 8px;
    }

    .card h2 {
      margin-bottom: 8px;
    }

    .description {
      color: #555;
      min-height: 45px;
    }

    .price {
      margin-bottom: 5px;
      font-size: 1.35rem;
      font-weight: bold;
      color: #005baa;
    }

    .stock {
      color: #555;
    }

    .available {
      color: #177245;
      font-weight: 600;
    }

    .unavailable {
      color: #b42318;
      font-weight: 600;
    }

    .wishlist-button {
      margin-top: auto;
      padding: 12px;
      border: none;
      border-radius: 8px;
      background: #005baa;
      color: white;
      font-weight: 600;
      cursor: pointer;
    }

    .wishlist-button:hover:not(
      :disabled
    ) {
      background: #004886;
    }

    .wishlist-button:disabled {
      background: #aab4be;
      cursor: not-allowed;
    }

    .message {
      padding: 14px;
      margin-bottom: 20px;
      border-radius: 8px;
    }

    .success {
      background: #dcf5e6;
      color: #17683a;
    }

    .error {
      background: #ffe4e4;
      color: #a02222;
    }

    .state {
      padding: 30px;
      text-align: center;
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

  success =
    signal('');

  wishlistError =
    signal('');

  addingProductId =
    signal<number | null>(null);

  constructor(
    private productService:
      ProductService,

    private wishlistService:
      WishlistService
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

        error: error => {

          this.loading.set(false);

          this.error.set(
            error?.error?.message ??
            'No se pudieron cargar los productos'
          );

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

  addToWishlist(
    product: Product
  ): void {

    if (product.stock <= 0) {

      this.wishlistError.set(
        'El producto no tiene stock disponible'
      );

      return;
    }

    this.success.set('');
    this.wishlistError.set('');

    this.addingProductId.set(
      product.id
    );

    this.wishlistService
      .addProduct(
        product.id,
        1
      )
      .subscribe({

        next: () => {

          this.addingProductId.set(
            null
          );

          this.success.set(
            `${product.name} fue agregado a tu wishlist`
          );

        },

        error: error => {

          this.addingProductId.set(
            null
          );

          this.wishlistError.set(
            error?.error?.message ??
            'No se pudo agregar el producto a la wishlist'
          );

        }

      });
  }
}
