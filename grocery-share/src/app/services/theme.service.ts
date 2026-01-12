import { Injectable } from '@angular/core';
import { SettingsService } from './settings.service';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private darkMode = false;

  constructor(private settings: SettingsService) {}

  async initialize(): Promise<void> {
    const savedTheme = await this.settings.getTheme();
    this.darkMode = savedTheme === 'dark';
    this.applyTheme();
  }

  toggleTheme(): void {
    this.darkMode = !this.darkMode;
    this.applyTheme();
    this.settings.setTheme(this.darkMode ? 'dark' : 'light');
  }

  isDarkMode(): boolean {
    return this.darkMode;
  }

  private applyTheme(): void {
    document.body.classList.toggle('dark', this.darkMode);
  }
}
