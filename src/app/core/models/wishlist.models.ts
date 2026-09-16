export interface WishlistItemRequest {
  productId: number;
  quantity: number;
}

export interface WishlistItem {
  productId: number;
  productName: string;
  quantity: number;
  price: number;
  inStock: boolean;
}
