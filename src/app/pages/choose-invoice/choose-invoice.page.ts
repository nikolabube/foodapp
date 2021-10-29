import { PopoverComponent } from './../../components/popover/popover.component';
import { CartService } from './../../services/cart.service';
import { NavController, PopoverController } from '@ionic/angular';
import { UtilService } from './../../services/util.service';
import { ApisService } from './../../services/apis.service';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-choose-invoice',
  templateUrl: './choose-invoice.page.html',
  styleUrls: ['./choose-invoice.page.scss'],
})
export class ChooseInvoicePage implements OnInit {

  id: any;
  myinvoices: any[] = [];
  from: any;
  selectedInvoice: any;
  dummy = Array(10);

  constructor(
    private router: Router,
    public api: ApisService,
    public util: UtilService,
    private navCtrl: NavController,
    private route: ActivatedRoute,
    private popoverController: PopoverController,
    private cart: CartService
  ) { 
    this.route.queryParams.subscribe(data => {
      console.log(data);
      if (data && data.from) {
        this.from = data.from;
      }
    });
    this.getInvoices();
    this.util.getInvoiceObservable().subscribe((data) => {
      this.getInvoices();
    });
  }

  ngOnInit() {
  }

  getInvoices() {
    const param = {
      id: localStorage.getItem('uid')
    };
    this.api.post_private('address/getInvoiceByUid', param).then((data) => {
      console.log(data);
      this.dummy = [];
      if (data && data.status === 200 && data.data.length > 0) {
        this.myinvoices = data.data;
      }
    }, error => {
      console.log(error);
      this.dummy = [];
      this.util.errorToast(this.util.translate('Something went wrong'));
    }).catch(error => {
      console.log(error);
      this.dummy = [];
      this.util.errorToast(this.util.translate('Something went wrong'));
    });
  }

  addNew() {
    this.router.navigate(['add-new-invoice']);
  }

  async openMenu(item, events) {
    const popover = await this.popoverController.create({
      component: PopoverComponent,
      event: events,
      mode: 'ios',
    });
    popover.onDidDismiss().then(data => {
      console.log(data.data);
      if (data && data.data) {
        if (data.data === 'edit') {
          const navData: NavigationExtras = {
            queryParams: {
              from: 'edit',
              data: JSON.stringify(item)
            }
          };
          this.router.navigate(['add-new-invoice'], navData);
        } else if (data.data === 'delete') {
          console.log(item);
          Swal.fire({
            title: this.util.translate('Are you sure?'),
            text: this.util.translate('to delete this invoice'),
            icon: 'question',
            confirmButtonText: this.util.translate('Yes'),
            backdrop: false,
            background: 'white',
            showCancelButton: true,
            showConfirmButton: true,
            cancelButtonText: this.util.translate('cancel')
          }).then(data => {
            console.log(data);
            if (data && data.value) {
              this.util.show();
              const param = {
                id: item.id
              };
              this.api.post_private('address/deleteInvoice', param).then(info => {
                console.log(info);
                this.util.hide();
                this.getInvoices();
              }, error => {
                console.log(error);
                this.util.hide();
                this.util.errorToast(this.util.translate('Something went wrong'));
              }).catch((error) => {
                console.log(error);
                this.util.hide();
                this.util.errorToast(this.util.translate('Something went wrong'));
              });
            }
          });

        }
      }
    });
    await popover.present();
  }

  async selectInvoice() {
    if (this.from === 'cart') {
      const selected = this.myinvoices.filter(x => x.id === this.selectedInvoice);
      if (selected && selected.length) {
        const item = selected[0];
        this.cart.invoice_id = this.selectedInvoice;
        this.router.navigate(['payments']);
      }
    }
  }

}
