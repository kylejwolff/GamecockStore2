import { Component, OnInit } from '@angular/core';
import * as firebase from 'Firebase';
import { Router,ActivatedRoute } from '@angular/router';
import { ItemService } from '../item.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {
  user={
    email:"",
    password:"",
    type:""};

  constructor(private router:Router) { }

  ngOnInit() {
  }

  signup(){
    console.log(this.user.email+"  "+this.user.password);
    var email=this.user.email;
    var password=this.user.password;
    var type = this.user.type;
    var self=this;

    firebase.auth().createUserWithEmailAndPassword(email, password)
    .then(function(result){
      var db = firebase.firestore();
      db.collection("users").doc(result.user.uid).set({
        'email':result.user.email,
        'type':type
      });
      self.router.navigate(["/login"]);
    })
    .catch(function(error){
      console.log(error);
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(error.message);
      if(errorCode.length > 0){
        console.log("Failed");
      }
      else{
        console.log("signup ok");
      }
    })
  }

}
