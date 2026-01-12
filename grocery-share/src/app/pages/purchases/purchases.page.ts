import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonList,
  IonIcon, IonFab, IonFabButton,
  IonButtons, IonRefresher, IonRefresherContent,
  IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonBadge,
  IonItemSliding, IonItemOptions, IonItemOption,
  AlertController, ModalController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { add, cart, people, moon, sunny, personOutline, calendarOutline, trash } from 'ionicons/icons';
import { PurchasesService } from '../../services/purchases.service';
import { PeopleService } from '../../services/people.service';
import { SettingsService } from '../../services/settings.service';
import { ThemeService } from '../../services/theme.service';
import { PurchaseWithPeople } from '../../models/purchase.model';
import { Person } from '../../models/person.model';
import { NewPurchaseModalComponent } from '../../components/new-purchase-modal/new-purchase-modal.component';

@Component({
  selector: 'app-purchases',
  templateUrl: './purchases.page.html',
  styleUrls: ['./purchases.page.scss'],
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
    IonIcon,
    IonFab,
    IonFabButton,
    IonButtons,
    IonRefresher,
    IonRefresherContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonBadge,
    IonItemSliding,
    IonItemOptions,
    IonItemOption
  ]
})
export class PurchasesPage implements OnInit {
  purchases: PurchaseWithPeople[] = [];
  allPeople: Person[] = [];
  loading = true;

  constructor(
    private purchasesService: PurchasesService,
    private peopleService: PeopleService,
    private settingsService: SettingsService,
    private router: Router,
    private alertCtrl: AlertController,
    private modalCtrl: ModalController,
    public theme: ThemeService
  ) {
    addIcons({ add, cart, people, moon, sunny, personOutline, calendarOutline, trash });
  }

  async ngOnInit() {
    await this.loadData();
  }

  ionViewWillEnter() {
    this.loadData();
  }

  async loadData(event?: any) {
    try {
      this.allPeople = await this.peopleService.getAllPeople();
      this.purchases = await this.purchasesService.getAllPurchases();
    } catch (error) {
      console.error('Error loading purchases:', error);
    } finally {
      this.loading = false;
      if (event) {
        event.target.complete();
      }
    }
  }

  getPeopleNames(peopleIds: number[]): string {
    return peopleIds
      .map(id => this.allPeople.find(p => p.id === id)?.name)
      .filter(name => name)
      .join(', ');
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  async openNewPurchaseModal() {
    if (this.allPeople.length === 0) {
      const alert = await this.alertCtrl.create({
        header: 'No People',
        message: 'Please add people before creating a purchase.',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel'
          },
          {
            text: 'Add People',
            handler: () => {
              this.router.navigate(['/people']);
            }
          }
        ]
      });
      await alert.present();
      return;
    }

    const modal = await this.modalCtrl.create({
      component: NewPurchaseModalComponent,
      componentProps: {
        allPeople: this.allPeople
      }
    });

    await modal.present();
    const { data } = await modal.onWillDismiss();

    if (data) {
      const purchaseId = await this.purchasesService.createPurchase(
        data.establishment,
        data.selectedPeople
      );
      await this.settingsService.setLastUsedPeople(data.selectedPeople);
      this.router.navigate(['/purchase', purchaseId]);
    }
  }

  openPurchase(purchase: PurchaseWithPeople) {
    this.router.navigate(['/purchase', purchase.id]);
  }

  goToPeople() {
    this.router.navigate(['/people']);
  }

  async deletePurchase(purchase: PurchaseWithPeople, event: Event) {
    event.stopPropagation();

    const alert = await this.alertCtrl.create({
      header: 'Delete Purchase',
      message: `Are you sure you want to delete the purchase from ${purchase.establishment}?`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Delete',
          role: 'destructive',
          handler: async () => {
            if (purchase.id) {
              await this.purchasesService.deletePurchase(purchase.id);
              await this.loadData();
            }
          }
        }
      ]
    });

    await alert.present();
  }

  toggleTheme() {
    this.theme.toggleTheme();
  }
}
