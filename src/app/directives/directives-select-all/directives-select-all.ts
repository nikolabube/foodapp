/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : ionic 5 foodies app
  Created : 28-Feb-2021
  This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2020-present initappz.
*/
import { Directive, ElementRef, HostListener } from '@angular/core';


@Directive({
  selector: 'ion-input[select-all]' // Attribute selector
})
export class DirectivesSelectAllDirective {

  constructor(private el: ElementRef) {
  }

  @HostListener('click')
  selectAll() {
    // access to the native input element
    let nativeEl: HTMLInputElement = this.el.nativeElement.querySelector('input');

    if (nativeEl) {
      if (nativeEl.setSelectionRange) {
        // select the text from start to end
        return nativeEl.setSelectionRange(0, nativeEl.value.length);
      }

      nativeEl.select();
    }
  }
}
