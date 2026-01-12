import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonList,
  IonItem, IonIcon, IonFab, IonFabButton,
  IonButtons, AlertController, IonInput
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { add, trash, create, arrowBack, checkmarkCircle, closeCircle } from 'ionicons/icons';
import { PeopleService } from '../../services/people.service';
import { Person } from '../../models/person.model';

@Component({
  selector: 'app-people',
  templateUrl: './people.page.html',
  styleUrls: ['./people.page.scss'],
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
    IonIcon,
    IonFab,
    IonFabButton,
    IonButtons,
    IonInput
  ]
})
export class PeoplePage implements OnInit {
  people: Person[] = [];
  loading = true;
  newPersonName = '';
  isAddingPerson = false;

  constructor(
    private peopleService: PeopleService,
    private alertCtrl: AlertController,
    private router: Router
  ) {
    addIcons({ add, trash, create, arrowBack, 'checkmark-circle': checkmarkCircle, 'close-circle': closeCircle });
  }

  async ngOnInit() {
    await this.loadPeople();
  }

  async loadPeople() {
    try {
      const people = await this.peopleService.getAllPeople();
      // Só atualiza se recebeu dados válidos
      if (people !== null && people !== undefined) {
        this.people = people;
      }
    } catch (error) {
      console.error('Error loading people:', error);
      // Não limpa a lista em caso de erro
    } finally {
      this.loading = false;
    }
  }

  startAddingPerson() {
    this.isAddingPerson = true;
    this.newPersonName = '';
    // Focus on input after view update
    setTimeout(() => {
      const input = document.querySelector('ion-input[name="newPersonName"]') as any;
      if (input) {
        input.setFocus();
      }
    }, 100);
  }

  async savePerson() {
    if (!this.newPersonName.trim()) {
      return;
    }

    try {
      await this.peopleService.addPerson(this.newPersonName.trim());
      await this.loadPeople();
      this.newPersonName = '';
      this.isAddingPerson = false;
    } catch (error) {
      const alert = await this.alertCtrl.create({
        header: 'Error',
        message: 'Failed to add person',
        buttons: ['OK']
      });
      await alert.present();
    }
  }

  cancelAddPerson() {
    this.isAddingPerson = false;
    this.newPersonName = '';
    // Não recarrega os dados, apenas fecha o formulário
  }

  async updatePersonName(person: Person, event: any) {
    const newName = event.target.value?.trim();

    // Se não houver mudança no nome ou o campo estiver vazio, não faz nada
    if (!newName || newName === person.name) {
      // Restaura o valor original se estiver vazio
      if (!newName && event.target) {
        event.target.value = person.name;
      }
      return;
    }

    // Atualiza apenas se houver ID e o nome for diferente
    if (person.id && newName !== person.name) {
      try {
        await this.peopleService.updatePerson(person.id, newName);
        person.name = newName;
      } catch (error) {
        console.error('Error updating person:', error);
        // Restaura o valor original em caso de erro
        if (event.target) {
          event.target.value = person.name;
        }
      }
    }
  }

  async addPerson_old() {
    const alert = await this.alertCtrl.create({
      header: 'Add Person',
      inputs: [
        {
          name: 'name',
          type: 'text',
          placeholder: 'Name'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Add',
          handler: async (data) => {
            if (data.name && data.name.trim()) {
              await this.peopleService.addPerson(data.name.trim());
              await this.loadPeople();
            }
          }
        }
      ]
    });

    await alert.present();
  }

  async editPerson(person: Person) {
    const alert = await this.alertCtrl.create({
      header: 'Edit Person',
      inputs: [
        {
          name: 'name',
          type: 'text',
          value: person.name,
          placeholder: 'Name'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Save',
          handler: async (data) => {
            if (data.name && data.name.trim() && person.id) {
              await this.peopleService.updatePerson(person.id, data.name.trim());
              await this.loadPeople();
            }
          }
        }
      ]
    });

    await alert.present();
  }

  async deletePerson(person: Person) {
    const alert = await this.alertCtrl.create({
      header: 'Delete Person',
      message: `Are you sure you want to delete ${person.name}?`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Delete',
          role: 'destructive',
          handler: async () => {
            if (person.id) {
              await this.peopleService.deletePerson(person.id);
              await this.loadPeople();
            }
          }
        }
      ]
    });

    await alert.present();
  }

  goBack() {
    this.router.navigate(['/purchases']);
  }
}
