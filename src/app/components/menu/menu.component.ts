/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : ionic 5 foodies app
  Created : 28-Feb-2021
  This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2020-present initappz.
*/
import { Component, OnInit } from '@angular/core';
import { NavParams, PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {
  cates: any;
  id: any;
  constructor(
    private navParam: NavParams,
    private popoverController: PopoverController
  ) {
    this.id = this.navParam.get('id');
    this.cates = this.navParam.get('data');
  }

  ngOnInit() { }
  selected(item) {
    this.popoverController.dismiss(item, 'selected');
  }
}
