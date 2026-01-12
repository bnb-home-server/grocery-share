import { Injectable } from '@angular/core';
import { DatabaseService } from './database.service';
import { Person } from '../models/person.model';

@Injectable({
  providedIn: 'root'
})
export class PeopleService {
  constructor(private db: DatabaseService) {}

  async getAllPeople(): Promise<Person[]> {
    const result = await this.db.queryDatabase('SELECT * FROM people ORDER BY name');
    return result.values || [];
  }

  async getPersonById(id: number): Promise<Person | null> {
    const result = await this.db.queryDatabase('SELECT * FROM people WHERE id = ?', [id]);
    return result.values && result.values.length > 0 ? result.values[0] : null;
  }

  async addPerson(name: string): Promise<number> {
    const result = await this.db.executeQuery('INSERT INTO people (name) VALUES (?)', [name]);
    return result.changes?.lastId || 0;
  }

  async updatePerson(id: number, name: string): Promise<void> {
    await this.db.executeQuery('UPDATE people SET name = ? WHERE id = ?', [name, id]);
  }

  async deletePerson(id: number): Promise<void> {
    await this.db.executeQuery('DELETE FROM people WHERE id = ?', [id]);
  }
}
