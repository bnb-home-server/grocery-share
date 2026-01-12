import { Injectable } from '@angular/core';
import { DatabaseService } from './database.service';
import { Purchase, PurchaseWithPeople } from '../models/purchase.model';
import { PurchaseProduct, PurchaseProductDetail } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class PurchasesService {
  constructor(private db: DatabaseService) {}

  async getAllPurchases(): Promise<PurchaseWithPeople[]> {
    const result = await this.db.queryDatabase(
      'SELECT * FROM purchases ORDER BY created_at DESC'
    );

    const purchases: PurchaseWithPeople[] = [];
    if (result.values) {
      for (const purchase of result.values) {
        const people = await this.getPurchasePeople(purchase.id);
        purchases.push({
          ...purchase,
          people
        });
      }
    }

    return purchases;
  }

  async getPurchaseById(id: number): Promise<PurchaseWithPeople | null> {
    const result = await this.db.queryDatabase('SELECT * FROM purchases WHERE id = ?', [id]);

    if (!result.values || result.values.length === 0) {
      return null;
    }

    const purchase = result.values[0];
    const people = await this.getPurchasePeople(id);

    return {
      ...purchase,
      people
    };
  }

  async createPurchase(establishment: string, peopleIds: number[]): Promise<number> {
    const createdAt = new Date().toISOString();
    const result = await this.db.executeQuery(
      'INSERT INTO purchases (establishment, is_completed, created_at) VALUES (?, 0, ?)',
      [establishment, createdAt]
    );

    const purchaseId = result.changes?.lastId || 0;

    for (const personId of peopleIds) {
      await this.db.executeQuery(
        'INSERT INTO purchase_people (purchase_id, person_id) VALUES (?, ?)',
        [purchaseId, personId]
      );
    }

    return purchaseId;
  }

  async updatePurchaseEstablishment(purchaseId: number, establishment: string): Promise<void> {
    await this.db.executeQuery(
      'UPDATE purchases SET establishment = ? WHERE id = ?',
      [establishment, purchaseId]
    );
  }

  async completePurchase(purchaseId: number): Promise<void> {
    await this.db.executeQuery(
      'UPDATE purchases SET is_completed = 1 WHERE id = ?',
      [purchaseId]
    );
  }

  async getPurchasePeople(purchaseId: number): Promise<number[]> {
    const result = await this.db.queryDatabase(
      'SELECT person_id FROM purchase_people WHERE purchase_id = ?',
      [purchaseId]
    );
    return result.values ? result.values.map((row: any) => row.person_id) : [];
  }

  async getPurchaseProducts(purchaseId: number): Promise<PurchaseProductDetail[]> {
    const result = await this.db.queryDatabase(
      `SELECT pp.*, p.name as product_name
       FROM purchase_products pp
       JOIN products p ON pp.product_id = p.id
       WHERE pp.purchase_id = ?
       ORDER BY pp.id`,
      [purchaseId]
    );
    return result.values || [];
  }

  async addPurchaseProduct(purchaseProduct: PurchaseProduct): Promise<number> {
    const result = await this.db.executeQuery(
      `INSERT INTO purchase_products (purchase_id, product_id, price, is_divided, person_id)
       VALUES (?, ?, ?, ?, ?)`,
      [
        purchaseProduct.purchase_id,
        purchaseProduct.product_id,
        purchaseProduct.price || null,
        purchaseProduct.is_divided,
        purchaseProduct.person_id || null
      ]
    );
    return result.changes?.lastId || 0;
  }

  async updatePurchaseProduct(purchaseProduct: PurchaseProduct): Promise<void> {
    await this.db.executeQuery(
      `UPDATE purchase_products
       SET product_id = ?, price = ?, is_divided = ?, person_id = ?
       WHERE id = ?`,
      [
        purchaseProduct.product_id,
        purchaseProduct.price || null,
        purchaseProduct.is_divided,
        purchaseProduct.person_id || null,
        purchaseProduct.id
      ]
    );
  }

  async deletePurchaseProduct(id: number): Promise<void> {
    await this.db.executeQuery('DELETE FROM purchase_products WHERE id = ?', [id]);
  }

  async deletePurchase(id: number): Promise<void> {
    await this.db.executeQuery('DELETE FROM purchases WHERE id = ?', [id]);
  }

  async deleteProductsWithoutPrice(purchaseId: number): Promise<void> {
    await this.db.executeQuery(
      'DELETE FROM purchase_products WHERE purchase_id = ? AND price IS NULL',
      [purchaseId]
    );
  }

  async getRecentEstablishments(limit: number = 10): Promise<string[]> {
    const result = await this.db.queryDatabase(
      `SELECT DISTINCT establishment
       FROM purchases
       ORDER BY created_at DESC
       LIMIT ?`,
      [limit]
    );
    return result.values ? result.values.map((row: any) => row.establishment) : [];
  }
}
