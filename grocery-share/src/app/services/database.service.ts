import { Injectable } from '@angular/core';
import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite';
import { Capacitor } from '@capacitor/core';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  private sqlite: SQLiteConnection;
  private db!: SQLiteDBConnection;
  private isDbReady = false;
  private initPromise: Promise<void> | null = null;

  constructor() {
    this.sqlite = new SQLiteConnection(CapacitorSQLite);
  }

  async initializeDatabase(): Promise<void> {
    // If already initialized, return immediately
    if (this.isDbReady) return;

    // If initialization is in progress, wait for it
    if (this.initPromise) {
      return this.initPromise;
    }

    // Start initialization
    this.initPromise = this._initializeDatabase();

    try {
      await this.initPromise;
    } finally {
      this.initPromise = null;
    }
  }

  private async _initializeDatabase(): Promise<void> {
    try {
      // Check if connection already exists
      const isConnExists = await this.sqlite.isConnection('grocery_share', false);

      if (isConnExists.result) {
        // Connection exists, try to retrieve it
        try {
          this.db = await this.sqlite.retrieveConnection('grocery_share', false);
          console.log('Retrieved existing database connection');
        } catch (retrieveError) {
          // Connection exists but can't be retrieved, close and recreate
          console.log('Connection exists but cannot be retrieved, closing...');
          await this.sqlite.closeConnection('grocery_share', false);

          this.db = await this.sqlite.createConnection(
            'grocery_share',
            false,
            'no-encryption',
            1,
            false
          );
          console.log('Created new database connection after closing');
        }
      } else {
        // No connection exists, create new one
        console.log('Creating new database connection');
        this.db = await this.sqlite.createConnection(
          'grocery_share',
          false,
          'no-encryption',
          1,
          false
        );
      }

      // Check if database is open
      const isOpen = await this.db.isDBOpen();
      if (!isOpen.result) {
        await this.db.open();
      }

      await this.createTables();
      this.isDbReady = true;
    } catch (error) {
      console.error('Database initialization error:', error);
      this.isDbReady = false;
      this.db = null as any;
      throw error;
    }
  }

  private async createTables(): Promise<void> {
    const createTablesQuery = `
      CREATE TABLE IF NOT EXISTS people (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS purchases (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        establishment TEXT NOT NULL,
        is_completed INTEGER DEFAULT 0,
        created_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS purchase_people (
        purchase_id INTEGER NOT NULL,
        person_id INTEGER NOT NULL,
        PRIMARY KEY (purchase_id, person_id),
        FOREIGN KEY (purchase_id) REFERENCES purchases(id) ON DELETE CASCADE,
        FOREIGN KEY (person_id) REFERENCES people(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE
      );

      CREATE TABLE IF NOT EXISTS purchase_products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        purchase_id INTEGER NOT NULL,
        product_id INTEGER NOT NULL,
        price REAL,
        is_divided INTEGER DEFAULT 1,
        person_id INTEGER,
        FOREIGN KEY (purchase_id) REFERENCES purchases(id) ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
        FOREIGN KEY (person_id) REFERENCES people(id) ON DELETE SET NULL
      );

      CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL
      );
    `;

    await this.db.execute(createTablesQuery);
  }

  async executeQuery(query: string, values?: any[]): Promise<any> {
    if (!this.isDbReady) {
      await this.initializeDatabase();
    }
    return await this.db.run(query, values);
  }

  async queryDatabase(query: string, values?: any[]): Promise<any> {
    if (!this.isDbReady) {
      await this.initializeDatabase();
    }
    return await this.db.query(query, values);
  }

  getDb(): SQLiteDBConnection {
    return this.db;
  }

  isReady(): boolean {
    return this.isDbReady;
  }
}
