/*
  Authors : initappz(Rahul Jograna)
Website: https://initappz.com/
App Name: ionic 5 foodies app
Created: 28 - Feb - 2021
This App Template Source code is licensed as per the
terms found in the Website https://initappz.com/license
Copyright and Good Faith Purchasers © 2020 - present initappz.
*/
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { VariationsPage } from './variations.page';

describe('VariationsPage', () => {
  let component: VariationsPage;
  let fixture: ComponentFixture<VariationsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [VariationsPage],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(VariationsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
