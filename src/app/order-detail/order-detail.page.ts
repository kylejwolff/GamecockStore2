import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import { AlertController } from '@ionic/angular';

import { ItemService } from '../item.service';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.page.html',
  styleUrls: ['./order-detail.page.scss'],
})
export class OrderDetailPage implements OnInit {

  current_item:any;
  items = [];
  constructor(
    private route: ActivatedRoute,
    public itemService: ItemService,
    private router: Router,
    public alertController: AlertController
  ) {   }

  ngOnInit() {
    this.route.params.subscribe(
      param => {
        this.current_item = param;
      }
    );
    this.items = this.current_item.items;
  }
  async presentAlertConfirm(){
    const alert = await this.alertController.create({
      header: 'Delete Order!',
      message: 'Are you sure you want to delete this order?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Okay',
          handler: () => {
            console.log('Confirm Okay');
            this.deleteOrder();
          }
        }
      ]
    });
    await alert.present();
    let result = await alert.onDidDismiss();
    console.log(result);
  }


  goBack(){
    this.router.navigate(['/tabs'])
  }

  deleteOrder(){
    console.log(this.current_item.id+" to be deleted");
    this.itemService.deleteOrder(this.current_item.id);
    this.goBack();
  }

}
