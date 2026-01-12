import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonList,
  IonItem, IonLabel, IonRadioGroup, IonRadio, IonButtons, ModalController
} from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { Person } from '../../models/person.model';

@Component({
  selector: 'app-person-selector-modal',
  templateUrl: './person-selector-modal.component.html',
  styleUrls: ['./person-selector-modal.component.scss'],
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
    IonRadioGroup,
    IonRadio,
    IonButtons
  ]
})
export class PersonSelectorModalComponent {
  @Input() people: Person[] = [];
  @Input() selectedPersonId?: number;

  selectedPerson?: number;

  constructor(private modalCtrl: ModalController) {}

  ngOnInit() {
    this.selectedPerson = this.selectedPersonId;
  }

  cancel() {
    this.modalCtrl.dismiss();
  }

  confirm() {
    if (this.selectedPerson) {
      this.modalCtrl.dismiss({
        personId: this.selectedPerson
      });
    }
  }
}
