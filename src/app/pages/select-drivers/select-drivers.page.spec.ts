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

import { SelectDriversPage } from './select-drivers.page';

describe('SelectDriversPage', () => {
  let component: SelectDriversPage;
  let fixture: ComponentFixture<SelectDriversPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SelectDriversPage],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SelectDriversPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
