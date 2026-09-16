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
  WishlistService
} from '../../core/services/wishlist.service';

import {
  WishlistItem
} from '../../core/models/wishlist.models';

@Component({
  selector: 'app-history',
  standalone: true,

  imports: [
    CommonModule,
    CurrencyPipe
  ],

  template: `
    <main class="page">

      <h1>
        Histórico de lista de deseos
      </h1>

      <p class="description">
        Productos que han pasado por la lista de deseos
      </p>

      @if (loading()) {

        <div class="message">
          Cargando histórico...
        </div>

      }

      @if (error()) {

        <div class="error">
          {{ error() }}
        </div>

      }

      @if (
        !loading() &&
        history().length === 0
      ) {

        <div class="message">
          No existen registros históricos
        </div>

      }

      @if (history().length > 0) {

        <div class="table-wrapper">

          <table>

            <thead>

              <tr>
                <th>ID</th>
                <th>Producto</th>
                <th>Cantidad</th>
                <th>Precio</th>
                <th>Estado</th>
              </tr>

            </thead>

            <tbody>

              @for (
                item of history();
                track $index
              ) {

                <tr>

                  <td>
                    {{ item.productId }}
                  </td>

                  <td>
                    {{ item.productName }}
                  </td>

                  <td>
                    {{ item.quantity }}
                  </td>

                  <td>

                    {{
                      item.price |
                      currency:'COP':'symbol':'1.0-0'
                    }}

                  </td>

                  <td>

                    <span
                      [class.available]="item.inStock"
                      [class.unavailable]="!item.inStock"
                    >

                      {{
                        item.inStock
                          ? 'Disponible'
                          : 'Sin stock'
                      }}

                    </span>

                  </td>

                </tr>

              }

            </tbody>

          </table>

        </div>

      }

    </main>
  `,

  styles: [`

    .page {
      max-width: 1200px;
      margin: auto;
      padding: 35px 25px;
    }

    .description {
      color: #6c757d;
      margin-bottom: 30px;
    }

    .table-wrapper {
      overflow-x: auto;
      background: white;
      border-radius: 12px;
      box-shadow:
        0 5px 15px rgba(0,0,0,.05);
    }

    table {
      width: 100%;
      border-collapse: collapse;
    }

    th,
    td {
      padding: 16px;
      text-align: left;
      border-bottom: 1px solid #eee;
    }

    th {
      background: #f7f9fb;
    }

    .available {
      color: #198754;
      font-weight: 600;
    }

    .unavailable {
      color: #c62828;
      font-weight: 600;
    }

    .message {
      padding: 30px;
      text-align: center;
    }

    .error {
      padding: 15px;
      border-radius: 8px;
      background: #ffe5e5;
      color: #a02222;
    }

  `]
})
export class HistoryComponent
  implements OnInit {

  history =
    signal<WishlistItem[]>([]);

  loading =
    signal(false);

  error =
    signal('');

  constructor(
    private wishlistService:
      WishlistService
  ) {}

  ngOnInit(): void {
    this.loadHistory();
  }

  loadHistory(): void {

    this.loading.set(true);
    this.error.set('');

    this.wishlistService
      .getHistory()
      .subscribe({

        next: response => {

          this.history.set(response);
          this.loading.set(false);

        },

        error: error => {

          this.loading.set(false);

          this.error.set(
            error?.error?.message ??
            'No se pudo cargar el histórico'
          );

        }

      });
  }
}
