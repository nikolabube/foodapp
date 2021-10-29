import { ApisService } from './../../services/apis.service';
import { UtilService } from 'src/app/services/util.service';
import { ActivatedRoute } from '@angular/router';
import { Platform, NavController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-add-new-invoice',
  templateUrl: './add-new-invoice.page.html',
  styleUrls: ['./add-new-invoice.page.scss'],
})
export class AddNewInvoicePage implements OnInit {

  id: any;
  from: any;
  nit: any;
  legal_name:any;

  constructor(
    private navCtrl: NavController,
    public api: ApisService,
    public util: UtilService,
    private route: ActivatedRoute,
    private platform: Platform,
  ) { 
    this.route.queryParams.subscribe(data => {
      console.log(data);
      if (data && data.from) {
        this.from = 'edit';
        const info = JSON.parse(data.data);
        console.log('da===>', info);
        this.id = info.id;
        this.nit = info.nit;
        this.legal_name = info.legal_name;
      } else {
        this.from = 'new';
      }
    });
  }

  ngOnInit() {
  }

  async addNew() {
    await this.util.show();
    const param = {
      uid: localStorage.getItem('uid'),
      nit: this.nit,
      legal_name: this.legal_name
    };
    this.api.post_private('address/saveInvoice', param).then((data: any) => {
      this.util.hide();
      if (data && data.status === 200) {
        this.util.publishInvoice('');
        this.navCtrl.back();
        this.util.showToast('Invoice added', 'success', 'bottom');
      } else {
        this.util.errorToast(this.util.translate('Something went wrong'));
      }
    }, error => {
      console.log(error);
      this.util.hide();
      this.util.errorToast(this.util.translate('Something went wrong'));
    });
  }

  async updateInvode() {
    await this.util.show();
    const param = {
      id: this.id,
      uid: localStorage.getItem('uid'),
      nit: this.nit,
      legal_name: this.legal_name
    };
    this.api.post_private('address/editInvoice', param).then((data: any) => {
      this.util.hide();
      console.log('update invoice == ', data);
      
      if (data && data.status === 200) {
        this.util.publishInvoice('');
        this.navCtrl.back();
        this.util.showToast('Invoice updated', 'success', 'bottom');
      } else {
        this.util.errorToast(this.util.translate('Something went wrong'));
      }
    }, error => {
      console.log(error);
      this.util.hide();
      this.util.errorToast(this.util.translate('Something went wrong'));
    });
  }

}
