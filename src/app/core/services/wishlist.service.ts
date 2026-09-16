import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import {
  WishlistItem,
  WishlistItemRequest
} from '../models/wishlist.models';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {

  private readonly apiUrl = '/api/wishlist';

  constructor(
    private http: HttpClient
  ) {}

  getWishlist(): Observable<WishlistItem[]> {
    return this.http.get<WishlistItem[]>(
      this.apiUrl
    );
  }

  addProduct(
    productId: number,
    quantity: number
  ): Observable<WishlistItem> {

    const body: WishlistItemRequest = {
      productId,
      quantity
    };

    return this.http.post<WishlistItem>(
      this.apiUrl,
      body
    );
  }

  updateProduct(
    productId: number,
    quantity: number
  ): Observable<WishlistItem> {

    const body: WishlistItemRequest = {
      productId,
      quantity
    };

    return this.http.put<WishlistItem>(
      `${this.apiUrl}/${productId}`,
      body
    );
  }

  removeProduct(
    productId: number
  ): Observable<void> {

    return this.http.delete<void>(
      `${this.apiUrl}/${productId}`
    );
  }

  getHistory(): Observable<WishlistItem[]> {

    return this.http.get<WishlistItem[]>(
      `${this.apiUrl}/history`
    );
  }
}
