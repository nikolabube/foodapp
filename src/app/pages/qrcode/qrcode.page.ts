import { UtilService } from 'src/app/services/util.service';
import { ModalController } from '@ionic/angular';
import { Component, Input, OnInit } from '@angular/core';
import { File } from '@ionic-native/file/ngx';
import { Base64ToGallery, Base64ToGalleryOptions } from '@ionic-native/base64-to-gallery/ngx';

@Component({
  selector: 'app-qrcode',
  templateUrl: './qrcode.page.html',
  styleUrls: ['./qrcode.page.scss'],
})
export class QRCodePage implements OnInit {

  @Input() img: any;
  @Input() orderId: any;

  constructor(
    private modalCtrl: ModalController,
    private file: File,
    private util: UtilService,
    private btg: Base64ToGallery
  ) { }

  ngOnInit() {

  }

  dismiss() {
    this.modalCtrl.dismiss();
  }

  downloadImage1() {
    this.util.show();
    this.btg.base64ToGallery(
      this.img,
      {
        prefix: `qrcode_${this.orderId}_`,
        mediaScanner: true,
      }
    ).then(resp => {
      console.log('resp == ', resp);
      this.util.hide();
      this.modalCtrl.dismiss();
    }).catch(error => {
      console.error('error == ', error);
      this.util.hide();
      this.util.showToast(this.util.translate("Coulsn't download the image"), 'danger', 'bottom');
    })
  }

  downloadImage() {
    this.util.show();

    let UUID = 'qrcode-' + this.orderId + '-image';
    let realData = this.img.split(",")[1];
    let blob = this.b64toBlob(realData, 'image/jpeg');

    this.file.checkDir(this.file.externalRootDirectory, 'QRCodes')
      .then(_ => {
        this.file.writeFile(this.file.externalRootDirectory + 'QRCodes/', UUID + '.jpg', blob).then(response => {
          // ACTION
          this.util.hide();
          // this.util.showToast(this.util.translate("Downloaded in QRCodes successfully."), 'success', 'bottom');
          this.util.showSimpleAlert("Downloaded: " + this.file.externalRootDirectory + 'QRCodes/' + UUID + '.jpg');
          this.modalCtrl.dismiss();
        }).catch(err => {
          // ACTION
          this.util.hide();
          this.util.showToast(this.util.translate("Couldn't download the image"), 'danger', 'bottom');
        })
      })
      .catch(err => {
        this.file.createDir(this.file.externalRootDirectory, 'QRCodes', false).then(result => {
          this.file.writeFile(this.file.externalRootDirectory + 'QRCodes/', UUID + '.jpg', blob).then(response => {
            // ACTION
            this.util.hide();
            // this.util.showToast(this.util.translate("Downloaded in QRCodes successfully."), 'success', 'bottom');
            this.util.showSimpleAlert("Downloaded: " + this.file.externalRootDirectory + 'QRCodes/' + UUID + '.jpg');
            this.modalCtrl.dismiss();
          }).catch(err => {
            // ACTION
            this.util.hide();
            this.util.showToast(this.util.translate("Couldn't download the image"), 'danger', 'bottom');
          })
        }).catch(rror => {
          this.util.hide();
          this.util.showToast(this.util.translate("Couldn't make QRCodes folder"), 'danger', 'bottom');
        })
      });
  }

  //convert base64 to blob
  b64toBlob(b64Data, contentType) {
    contentType = contentType || '';
    var sliceSize = 512;
    var byteCharacters = atob(b64Data);
    var byteArrays = [];

    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      var slice = byteCharacters.slice(offset, offset + sliceSize);

      var byteNumbers = new Array(slice.length);
      for (var i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      var byteArray = new Uint8Array(byteNumbers);

      byteArrays.push(byteArray);
    }

    var blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }

}
