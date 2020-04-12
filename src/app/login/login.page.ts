import { Component, OnInit } from '@angular/core';

import * as firebase from 'Firebase';
import { Validators, FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Router } from '@angular/router';

import { ItemService } from '../item.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  new_item_form: FormGroup;

  imgfile="assets/login.png";

  constructor(
    private router: Router,
    public formBuilder: FormBuilder,
    public itemService: ItemService
  ) { }

  ngOnInit() {
    this.new_item_form = this.formBuilder.group({
      email: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required)
    });
  }

  signup(){
    this.router.navigate(["/signup"]);
  }

  login(item){
    console.log(item.email+"    "+item.password)
    var self=this;
    var email=item.email;
    var password=item.password;
    firebase.auth().signInWithEmailAndPassword(email, password)
    .then(function(result){
      var user = result.user;
      
      var db = firebase.firestore();
      var docRef = db.collection("users").doc(user.uid);

      docRef.get().then(function(doc) {
          if (doc.exists) {
              console.log("Document data:", doc.get("type"));
              self.itemService.setUserType(doc.get("type"));
          } else {
              console.log("No such document!");
          }
      })
      console.log("login successfull");
      console.log(result);
      self.itemService.setUserType("user");
      self.router.navigate(["/tabs"]);
    })
    .catch(function(error){
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(errorCode);

      if (errorCode === 'auth/wrong-password') {
        alert("Wrong password.");
      }
      else if (errorCode === 'auth/user-not-found'){
        alert("user does not exist");
      }
      console.log(error);
    })
  }

  loginGoogle(){
    var self=this;
    console.log("google login")
    var provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope('profile');
    provider.addScope('email');
    firebase.auth().signInWithPopup(provider).then(function(result){
      var user = result.user;
      
      var db = firebase.firestore();
      var docRef = db.collection("users").doc(user.uid);

      docRef.get().then(function(doc) {
          if (doc.exists) {
              console.log("Document data:", doc.get("type"));
              self.itemService.setUserType(doc.get("type"));
          } else {
              console.log("No such document!");
              db.collection("users").doc(user.uid).set({
                'email':user.email,
                'type':'owner'
              });
              self.itemService.setUserType("owner");
          }
      })
      .catch(function(error) {
          console.log("Error getting document:", error);
      });
      console.log(user.uid);
      console.log("login succeeded");
      self.router.navigate(["/tabs"])
    })
  }

}
