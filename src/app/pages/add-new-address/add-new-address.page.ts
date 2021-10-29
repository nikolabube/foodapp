/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : ionic 5 foodies app
  Created : 28-Feb-2021
  This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2020-present initappz.
*/
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Platform } from '@ionic/angular';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { Geolocation, GeolocationOptions, Geoposition, PositionError } from '@ionic-native/geolocation/ngx';
import { NavController } from '@ionic/angular';
import { ApisService } from 'src/app/services/apis.service';
import { UtilService } from 'src/app/services/util.service';
import { ActivatedRoute, Router } from '@angular/router';

declare var google;

@Component({
  selector: 'app-add-new-address',
  templateUrl: './add-new-address.page.html',
  styleUrls: ['./add-new-address.page.scss'],
})
export class AddNewAddressPage implements OnInit {

  @ViewChild('map', { static: true }) mapEle: ElementRef;

  map: any;
  marker: any;
  lat: any;
  lng: any;
  address: any;
  house: any = '';
  landmark: any = '';
  pincode: any;

  title: any = 'home';
  id: any;
  from: any;

  geoOptions: GeolocationOptions = {
    maximumAge: 3000,
    timeout: 10000,
    enableHighAccuracy: false
  }

  constructor(
    private platform: Platform,
    private androidPermissions: AndroidPermissions,
    public geolocation: Geolocation,
    private navCtrl: NavController,
    public api: ApisService,
    public util: UtilService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.route.queryParams.subscribe(data => {
      console.log(data);
      if (data && data.from) {
        this.from = 'edit';
        const info = JSON.parse(data.data);
        console.log('da===>', info);
        this.address = info.address;
        this.house = info.house;
        this.id = info.id;
        this.landmark = info.landmark;
        this.lat = info.lat;
        this.lng = info.lng;
        this.loadmap(this.lat, this.lng, this.mapEle);
      } else {
        this.from = 'new';
        this.getLocation();
      }
    });
  }

  ngOnInit() {
  }

  getLocation() {
    this.platform.ready().then(() => {
      if (this.platform.is('android')) {
        // this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION).then(
        //   result => console.log('Has permission?', result.hasPermission),
        //   err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION)
        // );
        this.grantRequest();
      } else if (this.platform.is('ios')) {
        this.grantRequest();
      } else {
        this.geolocation.getCurrentPosition().then((resp) => {
          if (resp) {
            console.log('resp', resp);
            this.lat = resp.coords.latitude;
            this.lng = resp.coords.longitude;
            this.loadmap(resp.coords.latitude, resp.coords.longitude, this.mapEle);
            this.getAddress(this.lat, this.lng);
          }
        });
      }
    });
  }

  grantRequest() {
    this.geolocation.getCurrentPosition().then((resp) => {
      if (resp) {
        console.log('grantRequest', resp);
        let lat1 = resp.coords.latitude;//'-17.3792';
        let long1 = resp.coords.longitude;//'-66.1635';
        this.loadmap(lat1, long1, this.mapEle);
        this.getAddress(resp.coords.latitude, resp.coords.longitude);
      }
    });
  }

  loadmap(lat, lng, mapElement) {
    const location = new google.maps.LatLng(lat, lng);
    const style = [
      {
        featureType: 'all',
        elementType: 'all',
        stylers: [
          { saturation: -100 }
        ]
      }
    ];

    const mapOptions = {
      zoom: 15,
      scaleControl: false,
      streetViewControl: false,
      zoomControl: false,
      overviewMapControl: false,
      center: location,
      mapTypeControl: false,
      mapTypeControlOptions: {
        mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'Foodfire5']
      }
    };
    this.map = new google.maps.Map(mapElement.nativeElement, mapOptions);
    const mapType = new google.maps.StyledMapType(style, { name: 'Grayscale' });
    this.map.mapTypes.set('Foodfire5', mapType);
    this.map.setMapTypeId('Foodfire5');
    this.addMarker(location);
  }

  getAddress(lat, lng) {
    const geocoder = new google.maps.Geocoder();
    const location = new google.maps.LatLng(lat, lng);
    geocoder.geocode({ 'location': location }, (results, status) => {
      console.log(results);
      this.address = results[0].formatted_address;
      this.lat = lat;
      this.lng = lng;
    });
  }

  userCurrentLocation() {
    console.log('----->', this.lat, this.lng);
    this.util.show();
    const param = {
      uid: localStorage.getItem('uid'),
      address: this.address,
      lat: this.lat,
      lng: this.lng,
      title: this.title,
      house: this.house ? this.house : '',
      landmark: this.landmark ? this.landmark : '',
      pincode: this.pincode ? this.pincode : ''
    };
    console.log('call api => ', param);
    this.api.post_private('address/save', param).then((data: any) => {
      this.util.hide();
      if (data && data.status === 200) {
        this.util.publishAddress('');
        this.navCtrl.back();
        this.util.showToast('Address added', 'success', 'bottom');
      } else {
        this.util.errorToast(this.util.translate('Something went wrong'));
      }
    }, error => {
      console.log(error);
      this.util.hide();
      this.util.errorToast(this.util.translate('Something went wrong'));
    });
  }

  addMarker(location) {
    console.log('location =>', location);
    const icons = {
      url: 'assets/icon/marker.png',
      scaledSize: new google.maps.Size(50, 50), // scaled size
    };
    this.marker = new google.maps.Marker({
      position: location,
      map: this.map,
      icon: icons,
      draggable: true,
      animation: google.maps.Animation.DROP
    });

    google.maps.event.addListener(this.marker, 'dragend', () => {
      console.log(this.marker);
      this.getDragAddress(this.marker);
    });

  }

  getDragAddress(event) {
    const geocoder = new google.maps.Geocoder();
    const location = new google.maps.LatLng(event.position.lat(), event.position.lng());
    geocoder.geocode({ 'location': location }, (results, status) => {
      console.log(results);
      this.address = results[0].formatted_address;
      this.lat = event.position.lat();
      this.lng = event.position.lng();
    });
  }


  addAddress() {
    if (this.address === '' || this.landmark === '' || this.house === '' ) {
    // if (this.address === '' || this.landmark === '' || this.house === '' || !this.pincode || this.pincode === '') {
      this.util.errorToast(this.util.translate('All Fields are required'));
      return false;
    }
    const geocoder = new google.maps.Geocoder;
    geocoder.geocode({ address: this.house + ' ' + this.landmark + ' ' + this.address + ' ' + this.pincode }, (results, status) => {
      console.log(results, status);
      //   if (status === 'OK' && results && results.length) {
      this.lat = results[0].geometry.location.lat();
      this.lng = results[0].geometry.location.lng();
      console.log('----->', this.lat, this.lng);
      console.log('call api');
      this.util.show();
      const param = {
        uid: localStorage.getItem('uid'),
        address: this.address,
        lat: this.lat,
        lng: this.lng,
        title: this.title,
        house: this.house,
        landmark: this.landmark,
        pincode: this.pincode
      };
      this.api.post_private('address/save', param).then((data: any) => {
        this.util.hide();
        if (data && data.status === 200) {
          this.util.publishAddress('');
          this.navCtrl.back();
          this.util.showToast('Address added', 'success', 'bottom');
        } else {
          this.util.errorToast(this.util.translate('Something went wrong'));
        }
      }, error => {
        console.log(error);
        this.util.hide();
        this.util.errorToast(this.util.translate('Something went wrong'));
      });
      // } else {
      //   this.util.errorToast(this.util.translate('Something went wrong'));
      //   return false;
      // }
    });
  }

  updateAddress() {
    if (this.address === '' || this.landmark === '' || this.house === '' || !this.pincode || this.pincode === '') {
      this.util.errorToast(this.util.translate('All Fields are required'));
      return false;
    }
    const geocoder = new google.maps.Geocoder;
    geocoder.geocode({ address: this.house + ' ' + this.landmark + ' ' + this.address + ' ' + this.pincode }, (results, status) => {
      console.log(results, status);
      if (status === 'OK' && results && results.length) {
        this.lat = results[0].geometry.location.lat();
        this.lng = results[0].geometry.location.lng();
        console.log('----->', this.lat, this.lng);
        const param = {
          id: this.id,
          uid: localStorage.getItem('uid'),
          address: this.address,
          lat: this.lat,
          lng: this.lng,
          title: this.title,
          house: this.house,
          landmark: this.landmark,
          pincode: this.pincode
        };
        this.util.show();
        this.api.post_private('address/editList', param).then((data: any) => {
          this.util.hide();
          if (data && data.status === 200) {
            this.util.publishAddress('');
            this.navCtrl.back();
            this.util.showToast('Address updated', 'success', 'bottom');
          } else {
            this.util.errorToast(this.util.translate('Something went wrong'));
          }
        }, error => {
          console.log(error);
          this.util.hide();
          this.util.errorToast(this.util.translate('Something went wrong'));
        });
      } else {
        this.util.errorToast(this.util.translate('Something went wrong'));
        return false;
      }
    });
  }
}
