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
import { ActivatedRoute } from '@angular/router';
import { ApisService } from 'src/app/services/apis.service';
import { ActionSheetController, NavController } from '@ionic/angular';
import * as moment from 'moment';
import { UtilService } from 'src/app/services/util.service';
@Component({
  selector: 'app-add-review',
  templateUrl: './add-review.page.html',
  styleUrls: ['./add-review.page.scss'],
})
export class AddReviewPage implements OnInit {
  id: any;
  name: any;
  rate: any = 2;
  comment: any = '';
  total: any;
  rating: any[] = [];
  way: any;
  constructor(
    private route: ActivatedRoute,
    public api: ApisService,
    private actionSheetController: ActionSheetController,
    public util: UtilService,
    private navCtrl: NavController
  ) { }

  ngOnInit() {
    this.rating = [5, 5, 3, 5];
    // this.rating.push(this.rate);
    const sumOfRatingCount = this.rating.length * 5;
    const sumOfStars = this.rating.reduce((a, b) => a + b, 0);
    const storeRating = (sumOfStars * 5) / sumOfRatingCount
    console.log('rate', this.rating, storeRating);

    this.route.queryParams.subscribe(data => {
      console.log('data=>', data);
      if (data.hasOwnProperty('id')) {
        this.id = data.id;
        this.name = data.name;
        if (data.way) {
          this.way = data.way;
        } else {
          this.way = 'manually';
        }
        const param = {
          where: 'sid = ' + this.id
        };
        this.util.show();
        this.api.post('rating/getFromCount', param).then((data: any) => {
          this.util.hide();
          console.log('data', data);
          if (data && data.status === 200) {
            if (data && data.data && data.data.total) {
              this.total = data.data.total;
              if (data.data.rating) {
                const rats = data.data.rating;
                console.log(rats.split(','));
                this.rating = rats.split(',').map(function (item) {
                  return parseInt(item, 10);
                });
               
              } else {
                this.rating = [];
              }
            } else {
              this.total = 0;
              this.rating = [];
            }
          } else {
            this.total = 0;
            this.rating = [];
          }
          console.log('total', this.total, this.rating);
        }, error => {
          console.log(error);
          this.util.hide();
          this.total = 0;
          this.rating = [];
        });
      }
    });
  }

  onClick(val) {
    this.rate = val;
  }

  onChange(val) {
    console.log(val);
  }

  submit() {
    
    this.rating.push(this.rate);
    const sumOfRatingCount = this.rating.length * 5;
    const sumOfStars = this.rating.reduce((a, b) => a + b, 0);
    const storeRating = (sumOfStars * 5) / sumOfRatingCount
    console.log('rate', this.rating, storeRating, this.comment);
    if (this.comment === '') {
      this.util.errorToast(this.util.translate('Something went wrong'));
      return false;
    }
    const param = {
      uid: localStorage.getItem('uid'),
      pid: 0,
      did: 0,
      sid: this.id,
      rate: this.rate,
      msg: this.comment,
      way: this.way,
      status: 1,
      timestamp: moment().format('YYYY-MM-DD')
    };

    this.util.show();
    this.api.post_private('rating/save', param).then((data: any) => {
      console.log(data);
      this.util.hide();
      if (data && data.status === 200) {
        this.util.showToast(this.util.translate('Rating added'), 'success', 'bottom');
        const storeParam = {
          uid: this.id,
          total_rating: this.total + 1,
          rating: storeRating
        }
        this.api.post_private('stores/editByUid', storeParam).then((stores: any) => {
          console.log('store edit done', stores);
          this.util.back();
        }, error => {
          console.log(error);
        });
      } else {
        this.util.errorToast(this.util.translate('Something went wrong'));
      }
    }, error => {
      this.util.hide();
      console.log(error);
      this.util.errorToast(this.util.translate('Something went wrong'));
    });
  }


}
