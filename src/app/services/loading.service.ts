import { Injectable } from '@angular/core';

import { NgxSpinnerService } from "ngx-spinner";
@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  

  constructor(private spinner: NgxSpinnerService) {}

  show() {
    this.spinner.show(undefined, { fullScreen: false,type: 'ball-spin-clockwise', })
  }

  hide() {
    this.spinner.hide()
  }
}
