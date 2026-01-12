import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonList,
  IonItem, IonLabel, IonIcon, IonFab, IonFabButton,
  IonButtons, IonChip, IonCard,
  IonCardContent, AlertController, ModalController, IonInput
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { add, trash, checkmarkCircle, personOutline, cashOutline, createOutline, arrowBack, people, closeCircle } from 'ionicons/icons';
import { PurchasesService } from '../../services/purchases.service';
import { ProductsService } from '../../services/products.service';
import { PeopleService } from '../../services/people.service';
import { PurchaseWithPeople } from '../../models/purchase.model';
import { Person } from '../../models/person.model';
import { PurchaseProductDetail } from '../../models/product.model';
import { PersonSelectorModalComponent } from '../../components/person-selector-modal/person-selector-modal.component';

@Component({
  selector: 'app-purchase-detail',
  templateUrl: './purchase-detail.page.html',
  styleUrls: ['./purchase-detail.page.scss'],
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
    IonIcon,
    IonFab,
    IonFabButton,
    IonButtons,
    IonChip,
    IonCard,
    IonCardContent,
    IonInput
  ]
})
export class PurchaseDetailPage implements OnInit {
  purchaseId!: number;
  purchase: PurchaseWithPeople | null = null;
  items: PurchaseProductDetail[] = [];
  people: Person[] = [];
  allPeople: Person[] = [];
  loading = true;
  newItemName = '';
  isAddingItem = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private purchasesService: PurchasesService,
    private productsService: ProductsService,
    private peopleService: PeopleService,
    private alertCtrl: AlertController,
    private modalCtrl: ModalController
  ) {
    addIcons({ add, trash, checkmarkCircle, personOutline, cashOutline, createOutline, arrowBack, people, 'checkmark-circle': checkmarkCircle, 'close-circle': closeCircle });
  }

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.purchaseId = parseInt(id, 10);
      await this.loadData();
    }
  }

  async loadData() {
    try {
      this.purchase = await this.purchasesService.getPurchaseById(this.purchaseId);
      if (!this.purchase) {
        this.router.navigate(['/purchases']);
        return;
      }

      this.items = await this.purchasesService.getPurchaseProducts(this.purchaseId);
      this.allPeople = await this.peopleService.getAllPeople();
      this.people = this.allPeople.filter(p => this.purchase!.people.includes(p.id!));
    } catch (error) {
      console.error('Error loading purchase:', error);
    } finally {
      this.loading = false;
    }
  }

  startAddingItem() {
    this.isAddingItem = true;
    this.newItemName = '';
    setTimeout(() => {
      const input = document.querySelector('ion-input[name="newItemName"]') as any;
      if (input) {
        input.setFocus();
      }
    }, 100);
  }

  async saveItem() {
    if (!this.newItemName.trim()) {
      return;
    }

    try {
      const productId = await this.productsService.getOrCreateProduct(this.newItemName.trim());
      await this.purchasesService.addPurchaseProduct({
        purchase_id: this.purchaseId,
        product_id: productId,
        price: undefined,
        is_divided: 1,
        person_id: undefined
      });

      await this.loadData();
      this.newItemName = '';
      this.isAddingItem = false;
    } catch (error) {
      console.error('Error adding item:', error);
    }
  }

  cancelAddItem() {
    this.isAddingItem = false;
    this.newItemName = '';
  }

  async updateItemName(item: PurchaseProductDetail, event: any) {
    const newName = event.target.value.trim();
    if (newName && newName !== item.product_name) {
      try {
        const newProductId = await this.productsService.getOrCreateProduct(newName);
        item.product_id = newProductId;
        await this.purchasesService.updatePurchaseProduct(item);
        await this.loadData();
      } catch (error) {
        console.error('Error updating item:', error);
        event.target.value = item.product_name;
      }
    } else if (!newName) {
      event.target.value = item.product_name;
    }
  }

  async updateItemPriceValue(item: PurchaseProductDetail, event: any) {
    const priceValue = event.target.value;
    if (priceValue) {
      const price = parseFloat(priceValue);
      if (!isNaN(price) && price >= 0) {
        item.price = price;
        await this.purchasesService.updatePurchaseProduct(item);
        await this.loadData();
      }
    }
  }

  async addItem() {
    const alert = await this.alertCtrl.create({
      header: 'Add Item',
      inputs: [
        {
          name: 'productName',
          type: 'text',
          placeholder: 'Product name'
        },
        {
          name: 'price',
          type: 'number',
          placeholder: 'Price (optional)',
          min: 0,
          attributes: {
            step: '0.01'
          }
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
            if (data.productName && data.productName.trim()) {
              const productId = await this.productsService.getOrCreateProduct(data.productName.trim());
              const price = data.price ? parseFloat(data.price) : undefined;

              await this.purchasesService.addPurchaseProduct({
                purchase_id: this.purchaseId,
                product_id: productId,
                price: price,
                is_divided: 1,
                person_id: undefined
              });

              await this.loadData();
            }
          }
        }
      ]
    });

    await alert.present();
  }

  async updateItemPrice(item: PurchaseProductDetail) {
    const alert = await this.alertCtrl.create({
      header: 'Update Price',
      message: item.product_name,
      inputs: [
        {
          name: 'price',
          type: 'number',
          value: item.price,
          placeholder: 'Price',
          min: 0,
          attributes: {
            step: '0.01'
          }
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
            const price = data.price ? parseFloat(data.price) : undefined;
            item.price = price;
            await this.purchasesService.updatePurchaseProduct(item);
            await this.loadData();
          }
        }
      ]
    });

    await alert.present();
  }

  async editItem(item: PurchaseProductDetail) {
    const alert = await this.alertCtrl.create({
      header: 'Edit Item',
      inputs: [
        {
          name: 'productName',
          type: 'text',
          value: item.product_name,
          placeholder: 'Product name'
        },
        {
          name: 'price',
          type: 'number',
          value: item.price,
          placeholder: 'Price',
          min: 0,
          attributes: {
            step: '0.01'
          }
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
            if (data.productName && data.productName.trim()) {
              // Update product name if changed
              if (data.productName.trim() !== item.product_name) {
                const newProductId = await this.productsService.getOrCreateProduct(data.productName.trim());
                item.product_id = newProductId;
              }

              // Update price
              const price = data.price ? parseFloat(data.price) : undefined;
              item.price = price;

              await this.purchasesService.updatePurchaseProduct(item);
              await this.loadData();
            }
          }
        }
      ]
    });

    await alert.present();
  }

  async toggleItemType(item: PurchaseProductDetail) {
    if (item.is_divided === 1) {
      const modal = await this.modalCtrl.create({
        component: PersonSelectorModalComponent,
        componentProps: {
          people: this.people,
          selectedPersonId: item.person_id
        }
      });

      await modal.present();
      const { data } = await modal.onWillDismiss();

      if (data && data.personId) {
        item.is_divided = 0;
        item.person_id = data.personId;
        await this.purchasesService.updatePurchaseProduct(item);
        await this.loadData();
      }
    } else {
      item.is_divided = 1;
      item.person_id = undefined;
      await this.purchasesService.updatePurchaseProduct(item);
      await this.loadData();
    }
  }

  async deleteItem(item: PurchaseProductDetail) {
    const alert = await this.alertCtrl.create({
      header: 'Delete Item',
      message: `Remove ${item.product_name}?`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Delete',
          role: 'destructive',
          handler: async () => {
            if (item.id) {
              await this.purchasesService.deletePurchaseProduct(item.id);
              await this.loadData();
            }
          }
        }
      ]
    });

    await alert.present();
  }

  async completePurchase() {
    const itemsWithoutPrice = this.items.filter(item => !item.price);

    if (itemsWithoutPrice.length > 0) {
      const alert = await this.alertCtrl.create({
        header: 'Items Without Price',
        message: `${itemsWithoutPrice.length} item(s) don't have a price. Do you want to remove them and complete the purchase?`,
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel'
          },
          {
            text: 'Remove & Complete',
            handler: async () => {
              await this.purchasesService.deleteProductsWithoutPrice(this.purchaseId);
              await this.purchasesService.completePurchase(this.purchaseId);
              this.router.navigate(['/purchases']);
            }
          }
        ]
      });

      await alert.present();
    } else {
      await this.purchasesService.completePurchase(this.purchaseId);
      this.router.navigate(['/purchases']);
    }
  }

  getPersonName(personId?: number): string {
    if (!personId) return 'Divided';
    const person = this.allPeople.find(p => p.id === personId);
    return person ? person.name : 'Unknown';
  }

  calculateTotal(): number {
    return this.items.reduce((sum, item) => sum + (item.price || 0), 0);
  }

  calculatePersonTotal(personId: number): number {
    const individualItems = this.items.filter(item => !item.is_divided && item.person_id === personId);
    const individualTotal = individualItems.reduce((sum, item) => sum + (item.price || 0), 0);

    const dividedItems = this.items.filter(item => item.is_divided);
    const dividedTotal = dividedItems.reduce((sum, item) => sum + (item.price || 0), 0);
    const dividedShare = dividedTotal / this.people.length;

    return individualTotal + dividedShare;
  }

  goBack() {
    this.router.navigate(['/purchases']);
  }
}
