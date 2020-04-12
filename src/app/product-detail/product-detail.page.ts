import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import { Validators, FormBuilder, FormControl, FormGroup, Form } from '@angular/forms';
import { AlertController } from '@ionic/angular';

import { ItemService } from '../item.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.page.html',
  styleUrls: ['./product-detail.page.scss'],
})
export class ProductDetailPage implements OnInit {
  new_order_form: FormGroup;

  current_item:any;
  imgfile:any;
  constructor(
    private route: ActivatedRoute,
    public itemService: ItemService,
    public formBuilder: FormBuilder,
    private router: Router,
    public alertController: AlertController
  ) {   }

  async presentAlertConfirm(){
    const alert = await this.alertController.create({
      header: 'Delete ' + this.current_item.name + '!',
      message: 'Are you sure you want to delete this product?',
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
            this.deleteProduct();
          }
        }
      ]
    });
    await alert.present();
    let result = await alert.onDidDismiss();
    console.log(result);
  }

  ngOnInit() {
    this.route.params.subscribe(
      param => {
        this.current_item = param;
        console.log(this.current_item.id);
      }
    );
    
    this.imgfile = this.current_item.img;
    this.newOrderForm();
  }

  private newOrderForm() {
    this.new_order_form = this.formBuilder.group({
      quantity: new FormControl('', Validators.required),
    });
  }

  addItem(value){
    var total = value.quantity * this.current_item.price;
    var name = this.current_item.name;
    this.itemService.addItem(name,total,value.quantity);

    this.goBack();
  }

  goBack(){
    this.router.navigate(['/tabs'])
  }

  deleteProduct(){
    console.log(this.current_item.id+" to be deleted");
    this.itemService.deleteProduct(this.current_item.id);
    this.goBack();
  }

  updateProductPage(){
    this.router.navigate(['/update-product', this.current_item]);
  }

}
