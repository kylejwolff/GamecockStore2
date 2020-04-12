import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ItemService } from '../item.service';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.page.html',
  styleUrls: ['./order-list.page.scss'],
})
export class OrderListPage implements OnInit {

  orders = []

  constructor(
    private router: Router,
    public itemService: ItemService
  ) { }

  ngOnInit() {
    this.orders = this.itemService.getOrders();
  }

  goToOrder(order){
    this.router.navigate(["/order-detail", order]);
  }

}
