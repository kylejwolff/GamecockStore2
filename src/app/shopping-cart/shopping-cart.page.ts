import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import { Validators, FormBuilder, FormControl, FormGroup, Form } from '@angular/forms';

import { ItemService } from '../item.service';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.page.html',
  styleUrls: ['./shopping-cart.page.scss'],
})
export class ShoppingCartPage implements OnInit {

  cart = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public formBuilder: FormBuilder,
    public itemService: ItemService
    ) { }

  ngOnInit() {
    this.cart = this.itemService.getCart();
  }

  placeOrder(){
    console.log("placing order....");
    var total = 0;
    var quantity = 0;
    for(let item of this.cart){
      total += item.total;
      quantity += item.quantity;
    }
    this.itemService.createOrder(total,quantity);

    this.goBack();
  }

  goBack(){
    this.router.navigate(['/tabs'])
  }

}
