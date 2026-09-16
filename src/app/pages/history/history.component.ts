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
      width: min(1240px, 100%);
      margin: auto;
      padding: 38px 24px 60px;
    }

    h1 {
      margin: 0;
      color: var(--dark);
      font-size: clamp(30px, 4vw, 44px);
      letter-spacing: -.04em;
    }

    .description {
      margin: 8px 0 30px;
      color: var(--muted);
    }

    .table-wrapper {
      overflow: hidden;
      overflow-x: auto;
      border: 1px solid var(--line);
      border-radius: 22px;
      background: var(--surface);
      box-shadow: var(--shadow-soft);
    }

    table {
      width: 100%;
      min-width: 720px;
      border-collapse: collapse;
    }

    th,
    td {
      padding: 17px 20px;
      text-align: left;
      border-bottom: 1px solid var(--line);
    }

    th {
      background: var(--dark);
      color: #dbe5e4;
      font-size: 11px;
      font-weight: 800;
      letter-spacing: .09em;
      text-transform: uppercase;
    }

    tbody tr {
      transition: background .18s ease;
    }

    tbody tr:hover {
      background: #f7f4ee;
    }

    tbody tr:last-child td {
      border-bottom: none;
    }

    .available,
    .unavailable {
      display: inline-block;
      padding: 5px 10px;
      border-radius: 999px;
      font-size: 11px;
      font-weight: 800;
    }

    .available {
      background: var(--teal-soft);
      color: #187466;
    }

    .unavailable {
      background: #fbe4df;
      color: #b24735;
    }

    .message {
      padding: 45px;
      border: 1px dashed var(--line);
      border-radius: 20px;
      color: var(--muted);
      text-align: center;
    }

    .error {
      padding: 15px 18px;
      border-left: 5px solid var(--danger);
      border-radius: 12px;
      background: #fff0ee;
      color: #a34038;
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
