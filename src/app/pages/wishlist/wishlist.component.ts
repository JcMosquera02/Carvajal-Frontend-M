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
      width: min(1240px, 100%);
      margin: auto;
      padding: 38px 24px 60px;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: end;
      gap: 20px;
      margin-bottom: 28px;
      padding-bottom: 24px;
      border-bottom: 1px solid var(--line);
    }

    .header h1 {
      margin: 0 0 7px;
      color: var(--dark);
      font-size: clamp(30px, 4vw, 44px);
      letter-spacing: -.04em;
    }

    .header p {
      margin: 0;
      color: var(--muted);
    }

    .counter {
      padding: 10px 16px;
      border-radius: 999px;
      background: var(--dark);
      color: white;
      font-size: 13px;
      font-weight: 800;
    }

    .alert {
      padding: 15px 18px;
      margin-bottom: 20px;
      border-radius: 14px;
    }

    .warning {
      border-left: 5px solid var(--warning);
      background: #fff5df;
      color: #845b13;
    }

    .error {
      border-left: 5px solid var(--danger);
      background: #fff0ee;
      color: #a34038;
    }

    .grid {
      display: grid;
      grid-template-columns:
        repeat(auto-fill, minmax(310px, 1fr));
      gap: 20px;
    }

    .card {
      position: relative;
      padding: 24px;
      border: 1px solid var(--line);
      border-radius: 22px;
      background: var(--surface);
      box-shadow: var(--shadow-soft);
    }

    .card::before {
      content: '';
      position: absolute;
      top: 24px;
      left: 0;
      width: 5px;
      height: 58px;
      border-radius: 0 8px 8px 0;
      background: var(--teal);
    }

    .out-stock::before {
      background: var(--danger);
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      gap: 15px;
    }

    .card h2 {
      margin: 0 0 8px;
      color: var(--dark);
      font-size: 19px;
    }

    .stock {
      display: inline-block;
      padding: 5px 9px;
      border-radius: 999px;
      background: var(--teal-soft);
      color: #187466;
      font-size: 11px;
      font-weight: 800;
    }

    .unavailable {
      background: #fbe4df;
      color: #b24735;
    }

    .delete {
      width: 38px;
      height: 38px;
      border: none;
      border-radius: 12px;
      background: #f8e7e3;
      color: #b24735;
      font-weight: 900;
      cursor: pointer;
    }

    .price {
      margin: 28px 0;
      color: var(--accent);
      font-size: 28px;
      font-weight: 900;
    }

    .quantity label {
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: var(--muted);
      font-size: 13px;
      font-weight: 700;
    }

    .quantity input {
      width: 82px;
      padding: 9px;
      border: 1px solid var(--line);
      border-radius: 12px;
      outline: none;
      background: #faf8f4;
    }

    .quantity input:focus {
      border-color: var(--teal);
    }

    .subtotal {
      display: flex;
      justify-content: space-between;
      margin-top: 20px;
      padding-top: 17px;
      border-top: 1px dashed var(--line);
      color: var(--muted);
    }

    .subtotal strong {
      color: var(--dark);
    }

    .summary {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 28px;
      padding: 24px 28px;
      border-radius: 22px;
      background: var(--dark);
      color: white;
      box-shadow: var(--shadow);
    }

    .summary span {
      color: #b9c9c7;
    }

    .summary strong {
      color: #f3c969;
      font-size: 26px;
    }

    .empty {
      margin: 35px 0;
      padding: 70px 20px;
      border: 2px dashed var(--line);
      border-radius: 24px;
      background: rgba(255,255,255,.45);
      text-align: center;
    }

    .heart {
      color: var(--accent);
      font-size: 70px;
    }

    .state {
      padding: 30px;
      color: var(--muted);
      text-align: center;
    }

    @media (max-width: 650px) {
      .header {
        align-items: flex-start;
        flex-direction: column;
      }
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
