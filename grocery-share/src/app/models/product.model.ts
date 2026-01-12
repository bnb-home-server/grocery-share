export interface Product {
  id?: number;
  name: string;
}

export interface PurchaseProduct {
  id?: number;
  purchase_id: number;
  product_id: number;
  price?: number;
  is_divided: number;
  person_id?: number;
}

export interface PurchaseProductDetail extends PurchaseProduct {
  product_name: string;
}
