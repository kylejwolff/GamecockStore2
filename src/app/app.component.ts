import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import * as firebase from 'Firebase';

  // Your web app's Firebase configuration
  var firebaseConfig = {
    apiKey: "AIzaSyAQKEHW36QSibrKMio1GLuX1cmS4tWj9Lw",
    authDomain: "gamecockstore-bd4f7.firebaseapp.com",
    databaseURL: "https://gamecockstore-bd4f7.firebaseio.com",
    projectId: "gamecockstore-bd4f7",
    storageBucket: "gamecockstore-bd4f7.appspot.com",
    messagingSenderId: "299623336762",
    appId: "1:299623336762:web:e15052e23775d4a8811e03",
    measurementId: "G-7SE9N9MXRP"
  };
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
    firebase.initializeApp(firebaseConfig);
  }
}
