import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ItemService } from '../item.service';
import { Events } from '@ionic/angular';

import * as firebase from 'Firebase';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.page.html',
  styleUrls: ['./product-list.page.scss'],
})
export class ProductListPage implements OnInit {

  products = []

  constructor(
    private router: Router,
    public itemService: ItemService,
    public events: Events
  ) {
    var self=this;
    events.subscribe('dataloaded', (time) =>{
      console.log('data load time:', time);
      self.products = this.itemService.getProducts();
      console.log(self.products);
    })
   }

  ngOnInit() {
    //this.products = this.itemService.getProducts();
    console.log("ngOnInit ...")
    this.products = this.itemService.getProducts();
    console.log("items no:"+this.products.length)
    if(this.products != undefined){
          console.log(this.products.length);
    }
  }

  openNewProductPage(){
    if(this.itemService.usertype == "owner"){
      this.router.navigate(["/add-product"]);
    }
    else{
      console.log("Users/Visitors cannot add products");
    }
  }

  openShoppingCartPage(){
    this.router.navigate(["/shopping-cart"]);
  }

  goToProduct(product){
    this.router.navigate(["/product-detail", product]);
  }
  login(){
    this.router.navigate(["/login"])
  }

  logout(){
    var uid = firebase.auth().currentUser.uid;
    this.itemService.deleteCart(uid);
    firebase.auth().signOut().then(function() {
      // Sign-out successful.
      console.log("logout ok. Byeybe");
      this.itemService.setUserType("visitor");
    }).catch(function(error) {
      // An error happened.
    });
  }

}
