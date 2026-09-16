import {
  Injectable
} from '@angular/core';

import {
  HttpClient,
  HttpHeaders
} from '@angular/common/http';

import {
  Observable
} from 'rxjs';

import {
  Product,
  UserRole,
  UserSummary
} from '../models/admin.models';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private readonly productsUrl =
    '/api/products';

  private readonly adminUrl =
    '/api/admin';

  constructor(
    private http: HttpClient
  ) {}

  getProducts():
    Observable<Product[]> {

    return this.http.get<Product[]>(
      this.productsUrl
    );
  }

  getProduct(
    id: number
  ): Observable<Product> {

    return this.http.get<Product>(
      `${this.productsUrl}/${id}`
    );
  }

  createProduct(
    product: Product
  ): Observable<Product> {

    return this.http.post<Product>(
      this.productsUrl,
      product
    );
  }

  updateProduct(
    id: number,
    product: Product
  ): Observable<Product> {

    return this.http.put<Product>(
      `${this.productsUrl}/${id}`,
      product
    );
  }

  deleteProduct(
    id: number
  ): Observable<void> {

    return this.http.delete<void>(
      `${this.productsUrl}/${id}`
    );
  }

  updateUserRole(
    userId: number,
    role: UserRole
  ): Observable<UserSummary> {

    const headers =
      new HttpHeaders({
        'Content-Type':
          'application/json'
      });

    return this.http.put<UserSummary>(
      `${this.adminUrl}/users/${userId}/role`,
      JSON.stringify(role),
      {
        headers
      }
    );
  }
}
