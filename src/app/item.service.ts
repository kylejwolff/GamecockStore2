import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Storage } from '@ionic/storage';

import * as firebase from 'Firebase';

import { Events } from '@ionic/angular'

@Injectable({
  providedIn: 'root'
})
export class ItemService {
  db = firebase.firestore();
  usertype="visitor";

  //ref = firebase.database().ref('products/');
  //ref2 = firebase.database().ref('orders/');
  products:Array<any>=[];
  orders:Array<any>=[];
  cart:Array<any>=[];


  constructor(public events: Events) {

    var self=this;

    this.db.collection("products").onSnapshot(function(querySnapshot) {
        console.log("products list changed...........");
        self.products = [];
        querySnapshot.forEach(function(doc) {
          //console.log("pushing product");
            var item = doc.data();
            self.products.push({
              id:doc.id,
              name:item.name,
              price:item.price,
              category:item.category,
              img:item.img,
              description:item.description
            })
        });
        self.events.publish('dataloaded',Date.now());
        console.log("products reloaded");
    });
    if (this.usertype == "visitor"){
      console.log("no orders for visitors");
      self.orders = [];
    }
    else{
      var uid = firebase.auth().currentUser.uid;
      this.db.collection("orders").where("uid", "==", uid)
      .onSnapshot(function(querySnapshot) {
        console.log("loading orders for: "+uid);
        self.orders = [];
        querySnapshot.forEach(function(doc) {
          var item = doc.data();
          self.orders.push({
            id:doc.id,
            total:item.total,
            quantity:item.quantity,
            name:item.name,
            date:item.date,
            uid:item.uid
          })
        })
      })
    }
  }// end of constructor

  setUserType(type){
    var self = this;
    this.usertype = type;
    console.log("usertype set as: "+type);
    if(this.usertype == "visitor"){
      console.log("No orders for visitors");
      self.orders = [];
    }
    else{
      var uid = firebase.auth().currentUser.uid;
      uid = firebase.auth().currentUser.uid;
      console.log("building shopping cart....");
      this.db.collection("cart").doc(uid).set({
        items: [""]
      });
      this.db.collection("orders").where("uid", "==", uid)
      .onSnapshot(function(querySnapshot){
        console.log("loading orders for: "+uid);
        self.orders = [];
        querySnapshot.forEach(function(doc){
          var item = doc.data();
          self.orders.push({
            id:doc.id,
            total:item.total,
            quantity:item.quantity,
            name:item.name,
            date:item.date,
            uid:item.uid
          })
        })
      })
    }
  }

  getProducts(){
    return this.products;
  } 

  createProduct(name,price,category,image,description){
    if(this.usertype != "owner"){
      console.log("visitors cannot create products");
    }
    else{
      var db = firebase.firestore();
      db.collection("products").add({
        'name': name,
        'price': price,
        'category': category,
        'img': image,
        'description': description
      })
      .then(function(docRef){
        console.log("Document written with ID: ", docRef.id);
      })
      .catch(function(error){
        console.error("Error adding document: ", error);
      })
    }
  }

  updateProduct(current_item, newValues){
    
    if(this.usertype != "owner"){
      console.log("visitors cannot update products");
    }
    else{
      console.log("Updating Item:" + current_item.id);
      this.db.collection('products').doc(current_item.id).update(newValues);
    }
  }

  deleteProduct(id){
    var db = firebase.firestore();
    let newInfo = db.collection('products').doc(id).delete();
    console.log("Product deleted:"+id);
  }

  deleteOrder(id){
    var db = firebase.firestore();
    let newInfo = db.collection('orders').doc(id).delete();
    console.log("Order deleted:"+id);
  }

  deleteCart(id){
    var db = firebase.firestore();
    let newInfo = db.collection('cart').doc(id).delete();
    this.cart = [];
    console.log("Cart deleted:"+id);
  }

  getOrders(){
    return this.orders;
  }

  getCart(){
    return this.cart;
  }

  addItem(name,total,quantity){
    if(this.usertype == "visitor"){
      console.log("visitors cannot add items to cart");
    }
    else{
      var uid = firebase.auth().currentUser.uid;
      this.cart.push({
        name:name,
        total:total,
        quantity:quantity
      })
      var db = firebase.firestore();
      db.collection("cart").doc(uid).set({
        items:this.cart
      });
    }
  }

  createOrder(total,quantity){
    if(this.usertype == "visitor"){
      console.log("visitors cannot create orders");
    }
    else{
      var db = firebase.firestore();
      var uid = firebase.auth().currentUser.uid;
      db.collection("orders").add({
        'total': total,
        'quantity': quantity,
        'items': this.cart,
        'date': Date(),  //TODO make this more usefull
        'uid': uid
      })
      .then(function(docRef){
        console.log("Document written with ID: ", docRef.id);
        //this.deleteCart(uid);
      })
      .catch(function(error){
        console.error("Error adding document: ", error);
      })
    }
  }
}


export const snapshotToArray = snapshot => {
  let returnArr = [];

  snapshot.forEach(childSnapshot => {
    let item = childSnapshot.val();
    item.key = childSnapshot.key;
    console.log(item);
    returnArr.push(item);
  });

  return returnArr;
}
