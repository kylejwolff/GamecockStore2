import { Component, OnInit, ViewChild } from '@angular/core';
import { Validators, FormBuilder, FormControl, FormGroup, Form } from '@angular/forms';
import { Router, RouterOutlet, ActivationStart,ActivatedRoute } from '@angular/router';

import { ItemService } from '../item.service';
import { Camera, CameraOptions } from "@ionic-native/camera/ngx";
import { File } from "@ionic-native/file/ngx";

import * as firebase from "firebase";

@Component({
  selector: 'app-update-product',
  templateUrl: './update-product.page.html',
  styleUrls: ['./update-product.page.scss'],
})
export class UpdateProductPage implements OnInit {
  result;
  imgfile="";

  update_product_form: FormGroup;
  current_item:any;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public formBuilder: FormBuilder,
    public itemService: ItemService,
    private camera: Camera,
    private file: File
  ) { }

  ngOnInit() {
    this.route.params.subscribe(
      param => {
        this.current_item = param;
        console.log(this.current_item.id);
      }
    );

    this.update_product_form = this.formBuilder.group({
      name: new FormControl(this.current_item.name),
      price: new FormControl(this.current_item.price),
      category: new FormControl(this.current_item.category),
      img: new FormControl(this.current_item.img),
      description: new FormControl(this.current_item.description)
    });
  }

  updateProduct(newValues){
    this.itemService.updateProduct(this.current_item, newValues);

    this.goBack();
  }

  goBack(){
    this.router.navigate(['/tabs']);
  }

}
