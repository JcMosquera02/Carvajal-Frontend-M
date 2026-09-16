import {
  Component,
  OnInit,
  computed,
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
  WishlistService
} from '../../core/services/wishlist.service';

import {
  WishlistItem
} from '../../core/models/wishlist.models';

@Component({
  selector: 'app-wishlist',
  standalone: true,

  imports: [
    CommonModule,
    FormsModule,
    CurrencyPipe
  ],

  template: `
    <main class="page">

      <header class="header">

        <div>
          <h1>Mi lista de deseos</h1>

          <p>
            Administra los productos que quieres comprar en el futuro
          </p>
        </div>

        <div class="counter">
          {{ items().length }} producto(s)
        </div>

      </header>

      @if (loading()) {

        <div class="state">
          Cargando lista de deseos...
        </div>

      }

      @if (error()) {

        <div class="alert error">
          {{ error() }}
        </div>

      }

      @if (hasOutOfStock()) {

        <div class="alert warning">

          <strong>Atención:</strong>

          uno o más productos de tu lista ya no tienen stock disponible

        </div>

      }

      @if (!loading() && items().length === 0) {

        <section class="empty">

          <div class="heart">
            ♡
          </div>

          <h2>
            Tu lista está vacía
          </h2>

          <p>
            Agrega productos desde el catálogo
          </p>

        </section>

      }

      <section class="grid">

        @for (
          item of items();
          track item.productId
        ) {

          <article
            class="card"
            [class.out-stock]="!item.inStock"
          >

            <div class="card-header">

              <div>

                <h2>
                  {{ item.productName }}
                </h2>

                <span
                  class="stock"
                  [class.unavailable]="!item.inStock"
                >

                  @if (item.inStock) {

                    Disponible

                  } @else {

                    Sin stock

                  }

                </span>

              </div>

              <button
                type="button"
                class="delete"
                (click)="remove(item)"
              >
                ✕
              </button>

            </div>

            <div class="price">

              {{
                item.price |
                currency:'COP':'symbol':'1.0-0'
              }}

            </div>

            <div class="quantity">

              <label>

                Cantidad

                <input
                  type="number"
                  min="1"
                  [ngModel]="item.quantity"
                  (ngModelChange)="changeQuantity(item, $event)"
                >

              </label>

            </div>

            <div class="subtotal">

              <span>
                Subtotal
              </span>

              <strong>

                {{
                  item.price *
                  item.quantity |
                  currency:'COP':'symbol':'1.0-0'
                }}

              </strong>

            </div>

          </article>

        }

      </section>

      @if (items().length > 0) {

        <section class="summary">

          <span>
            Valor aproximado
          </span>

          <strong>

            {{
              total() |
              currency:'COP':'symbol':'1.0-0'
            }}

          </strong>

        </section>

      }

    </main>
  `,

  styles: [`

    .page {
      max-width: 1200px;
      margin: auto;
      padding: 35px 25px;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 20px;
      margin-bottom: 30px;
    }

    .header h1 {
      margin: 0 0 5px;
    }

    .header p {
      margin: 0;
      color: #666;
    }

    .counter {
      padding: 10px 15px;
      background: #eef3f8;
      border-radius: 20px;
      font-weight: 600;
    }

    .alert {
      padding: 15px;
      border-radius: 10px;
      margin-bottom: 20px;
    }

    .warning {
      background: #fff4d7;
      color: #7d5800;
    }

    .error {
      background: #ffe2e2;
      color: #9d1d1d;
    }

    .grid {
      display: grid;
      grid-template-columns:
        repeat(
          auto-fill,
          minmax(280px, 1fr)
        );
      gap: 20px;
    }

    .card {
      padding: 22px;
      background: white;
      border: 1px solid #e2e6ea;
      border-radius: 14px;
      box-shadow:
        0 5px 15px rgba(0,0,0,.05);
    }

    .out-stock {
      border-color: #e8adad;
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      gap: 15px;
    }

    .card h2 {
      margin: 0 0 7px;
      font-size: 18px;
    }

    .stock {
      color: #198754;
      font-size: 13px;
    }

    .unavailable {
      color: #c62828;
    }

    .delete {
      width: 35px;
      height: 35px;
      border: none;
      border-radius: 50%;
      background: #ffeded;
      color: #c62828;
      cursor: pointer;
    }

    .price {
      margin: 25px 0;
      font-size: 25px;
      font-weight: 700;
    }

    .quantity label {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .quantity input {
      width: 75px;
      padding: 8px;
      border: 1px solid #ccc;
      border-radius: 7px;
    }

    .subtotal {
      display: flex;
      justify-content: space-between;
      margin-top: 20px;
      padding-top: 15px;
      border-top: 1px solid #eee;
    }

    .summary {
      display: flex;
      justify-content: space-between;
      margin-top: 30px;
      padding: 20px;
      border-radius: 12px;
      background: #f3f6f9;
      font-size: 20px;
    }

    .empty {
      padding: 70px 20px;
      text-align: center;
    }

    .heart {
      color: #aaa;
      font-size: 70px;
    }

    .state {
      padding: 25px;
      text-align: center;
    }

  `]
})
export class WishlistComponent
  implements OnInit {

  items =
    signal<WishlistItem[]>([]);

  loading =
    signal(false);

  error =
    signal('');

  readonly hasOutOfStock =
    computed(() =>
      this.items().some(
        item => !item.inStock
      )
    );

  readonly total =
    computed(() =>
      this.items().reduce(
        (total, item) =>
          total +
          (
            item.price *
            item.quantity
          ),
        0
      )
    );

  constructor(
    private wishlistService:
      WishlistService
  ) {}

  ngOnInit(): void {
    this.loadWishlist();
  }

  loadWishlist(): void {

    this.loading.set(true);
    this.error.set('');

    this.wishlistService
      .getWishlist()
      .subscribe({

        next: response => {

          this.items.set(response);
          this.loading.set(false);

        },

        error: error => {

          this.loading.set(false);

          this.error.set(
            error?.error?.message ??
            'No se pudo cargar la lista de deseos'
          );

        }

      });
  }

  changeQuantity(
    item: WishlistItem,
    quantity: number
  ): void {

    const newQuantity =
      Number(quantity);

    if (
      !newQuantity ||
      newQuantity < 1
    ) {

      return;

    }

    this.wishlistService
      .updateProduct(
        item.productId,
        newQuantity
      )
      .subscribe({

        next: updated => {

          this.items.update(
            current =>
              current.map(
                value =>
                  value.productId ===
                  item.productId
                    ? updated
                    : value
              )
          );

        },

        error: error => {

          this.error.set(
            error?.error?.message ??
            'No se pudo actualizar la cantidad'
          );

          this.loadWishlist();

        }

      });
  }

  remove(
    item: WishlistItem
  ): void {

    const confirmed =
      confirm(
        `¿Eliminar "${item.productName}" de tu lista?`
      );

    if (!confirmed) {

      return;

    }

    this.wishlistService
      .removeProduct(
        item.productId
      )
      .subscribe({

        next: () => {

          this.items.update(
            current =>
              current.filter(
                value =>
                  value.productId !==
                  item.productId
              )
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
