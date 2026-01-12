import { Injectable } from '@angular/core';
import { DatabaseService } from './database.service';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  constructor(private db: DatabaseService) {}

  async getSetting(key: string): Promise<string | null> {
    const result = await this.db.queryDatabase(
      'SELECT value FROM settings WHERE key = ?',
      [key]
    );
    return result.values && result.values.length > 0 ? result.values[0].value : null;
  }

  async setSetting(key: string, value: string): Promise<void> {
    await this.db.executeQuery(
      'INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)',
      [key, value]
    );
  }

  async getLastUsedPeople(): Promise<number[]> {
    const value = await this.getSetting('last_used_people');
    return value ? JSON.parse(value) : [];
  }

  async setLastUsedPeople(peopleIds: number[]): Promise<void> {
    await this.setSetting('last_used_people', JSON.stringify(peopleIds));
  }

  async getTheme(): Promise<string> {
    return (await this.getSetting('theme')) || 'light';
  }

  async setTheme(theme: string): Promise<void> {
    await this.setSetting('theme', theme);
  }
}
