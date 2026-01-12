import { Injectable } from '@angular/core';
import { DatabaseService } from './database.service';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  constructor(private db: DatabaseService) {}

  async getAllProducts(): Promise<Product[]> {
    const result = await this.db.queryDatabase('SELECT * FROM products ORDER BY name');
    return result.values || [];
  }

  async getOrCreateProduct(name: string): Promise<number> {
    const result = await this.db.queryDatabase('SELECT id FROM products WHERE name = ?', [name]);

    if (result.values && result.values.length > 0) {
      return result.values[0].id;
    }

    const insertResult = await this.db.executeQuery('INSERT INTO products (name) VALUES (?)', [name]);
    return insertResult.changes?.lastId || 0;
  }

  async searchProducts(term: string): Promise<Product[]> {
    const result = await this.db.queryDatabase(
      'SELECT * FROM products WHERE name LIKE ? ORDER BY name LIMIT 10',
      [`%${term}%`]
    );
    return result.values || [];
  }
}
