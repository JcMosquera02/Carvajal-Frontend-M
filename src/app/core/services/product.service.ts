import {
  Injectable
} from '@angular/core';

import {
  HttpClient
} from '@angular/common/http';

import {
  Observable
} from 'rxjs';

import {
  Product
} from '../models/product.models';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private readonly apiUrl =
    '/api/products';

  constructor(
    private http: HttpClient
  ) {}

  getProducts():
    Observable<Product[]> {

    return this.http.get<Product[]>(
      this.apiUrl
    );
  }

  getProduct(
    id: number
  ): Observable<Product> {

    return this.http.get<Product>(
      `${this.apiUrl}/${id}`
    );
  }

  checkStock(
    id: number,
    quantity: number = 1
  ): Observable<boolean> {

    return this.http.get<boolean>(
      `${this.apiUrl}/${id}/stock`,
      {
        params: {
          quantity
        }
      }
    );
  }
}
