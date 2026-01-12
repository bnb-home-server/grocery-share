import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonList,
  IonItem, IonLabel, IonCheckbox, IonButtons, IonInput, ModalController
} from '@ionic/angular/standalone';
import { Person } from '../../models/person.model';
import { SettingsService } from '../../services/settings.service';
import { PurchasesService } from '../../services/purchases.service';

@Component({
  selector: 'app-new-purchase-modal',
  templateUrl: './new-purchase-modal.component.html',
  styleUrls: ['./new-purchase-modal.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton,
    IonList,
    IonItem,
    IonLabel,
    IonCheckbox,
    IonButtons,
    IonInput
  ]
})
export class NewPurchaseModalComponent implements OnInit {
  @Input() allPeople: Person[] = [];

  establishment = '';
  selectedPeople: number[] = [];
  recentEstablishments: string[] = [];

  constructor(
    private modalCtrl: ModalController,
    private settingsService: SettingsService,
    private purchasesService: PurchasesService
  ) {}

  async ngOnInit() {
    const lastUsedPeople = await this.settingsService.getLastUsedPeople();
    this.selectedPeople = lastUsedPeople.filter(id =>
      this.allPeople.some(p => p.id === id)
    );

    if (this.selectedPeople.length === 0 && this.allPeople.length > 0) {
      this.selectedPeople = this.allPeople.map(p => p.id!);
    }

    this.recentEstablishments = await this.purchasesService.getRecentEstablishments(5);
  }

  togglePerson(personId: number) {
    const index = this.selectedPeople.indexOf(personId);
    if (index > -1) {
      this.selectedPeople.splice(index, 1);
    } else {
      this.selectedPeople.push(personId);
    }
  }

  isPersonSelected(personId: number): boolean {
    return this.selectedPeople.includes(personId);
  }

  selectEstablishment(name: string) {
    this.establishment = name;
  }

  cancel() {
    this.modalCtrl.dismiss();
  }

  create() {
    if (this.establishment.trim() && this.selectedPeople.length > 0) {
      this.modalCtrl.dismiss({
        establishment: this.establishment.trim(),
        selectedPeople: this.selectedPeople
      });
    }
  }
}
