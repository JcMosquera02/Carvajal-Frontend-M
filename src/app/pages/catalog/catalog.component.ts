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
      width: min(1320px, 100%);
      margin: auto;
      padding: 34px 24px 60px;
    }

    .header {
      position: relative;
      overflow: hidden;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      gap: 28px;
      margin-bottom: 30px;
      padding: 34px;
      border-radius: 28px;
      background: var(--dark);
      color: white;
      box-shadow: var(--shadow);
    }

    .header::after {
      content: '';
      position: absolute;
      width: 220px;
      height: 220px;
      right: -70px;
      top: -90px;
      border-radius: 50%;
      background: var(--accent);
      opacity: .30;
    }

    .header h1 {
      position: relative;
      z-index: 1;
      margin: 0 0 8px;
      font-size: clamp(30px, 4vw, 46px);
      letter-spacing: -.045em;
    }

    .header p {
      position: relative;
      z-index: 1;
      max-width: 560px;
      margin: 0;
      color: #bdcfcd;
      font-size: 15px;
    }

    .header input {
      position: relative;
      z-index: 1;
      width: min(330px, 100%);
      padding: 14px 18px;
      border: 1px solid rgba(255,255,255,.14);
      border-radius: 999px;
      outline: none;
      background: rgba(255,255,255,.10);
      color: white;
    }

    .header input::placeholder {
      color: #b9c6c5;
    }

    .header input:focus {
      border-color: var(--teal);
      background: rgba(255,255,255,.15);
    }

    .grid {
      display: grid;
      grid-template-columns:
        repeat(auto-fill, minmax(255px, 1fr));
      gap: 22px;
    }

    .card {
      position: relative;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      min-height: 470px;
      padding: 14px 14px 20px;
      border: 1px solid var(--line);
      border-radius: 24px;
      background: var(--surface);
      box-shadow: var(--shadow-soft);
      transition:
        transform .22s ease,
        box-shadow .22s ease;
    }

    .card:hover {
      transform: translateY(-5px);
      box-shadow: var(--shadow);
    }

    .product-image {
      width: 100%;
      height: 210px;
      object-fit: contain;
      margin-bottom: 15px;
      padding: 16px;
      border-radius: 18px;
      background:
        linear-gradient(
          135deg,
          #f4efe6,
          #edf4ef
        );
    }

    .status {
      margin: 0 4px 8px;
    }

    .available,
    .unavailable {
      display: inline-block;
      padding: 5px 9px;
      border-radius: 999px;
      font-size: 11px;
      font-weight: 800;
      letter-spacing: .05em;
      text-transform: uppercase;
    }

    .available {
      background: var(--teal-soft);
      color: #187466;
    }

    .unavailable {
      background: #fbe4df;
      color: #b24735;
    }

    .card h2 {
      margin: 5px 4px 6px;
      color: var(--dark);
      font-size: 19px;
      line-height: 1.2;
    }

    .description {
      min-height: 42px;
      margin: 0 4px 14px;
      color: var(--muted);
      font-size: 13px;
      line-height: 1.45;
    }

    .price {
      margin: auto 4px 2px;
      color: var(--accent);
      font-size: 24px;
      font-weight: 900;
    }

    .stock {
      margin: 0 4px 16px;
      color: var(--muted);
      font-size: 12px;
    }

    .wishlist-button {
      width: calc(100% - 8px);
      margin: 0 4px;
      padding: 13px;
      border: none;
      border-radius: 14px;
      background: var(--dark);
      color: white;
      font-weight: 800;
      cursor: pointer;
    }

    .wishlist-button:hover:not(:disabled) {
      background: var(--accent);
    }

    .wishlist-button:disabled {
      background: #c8c6c1;
      cursor: not-allowed;
    }

    .message {
      padding: 14px 18px;
      margin-bottom: 20px;
      border-radius: 14px;
      box-shadow: var(--shadow-soft);
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

    .state {
      padding: 60px 20px;
      color: var(--muted);
      text-align: center;
    }

    @media (max-width: 760px) {
      .header {
        align-items: stretch;
        flex-direction: column;
      }

      .header input {
        width: 100%;
      }
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


  getProductImage(productName: string): string {

    const images: Record<string, string> = {

      'Lápiz Mirado No. 2':
        'assets/products/Lápiz Mirado No. 2.jpg',

      'Morral Totto Universitario':
        'assets/products/Morral Totto Universitario.jpg',

      'Calculadora Casio fx-82':
        'assets/products/Calculadora Casio fx-82.jpg',

      'Cuaderno Norma Jean Book':
        'assets/products/Cuaderno Norma Jean Book.jpg',

      'Borrador Nata Pelikan':
        'assets/products/Borrador Nata Pelikan.jpg',

      'Cinta Pegante Tesa':
        'assets/products/Cinta Pegante Tesa.jpg',

      'Bolígrafo Kilométrico':
        'assets/products/Bolígrafo Kilométrico.jpg',

      'Carpeta Fuelle Norma':
        'assets/products/Carpeta Fuelle Norma.jpg',

      'Resma Papel Reprograf':
        'assets/products/Resma Papel Reprograf.jpg',

      'Marcadores Sharpie':
        'assets/products/Marcadores Sharpie.jpg'
    };

    return images[productName] ?? 'assets/products/default.svg';
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
