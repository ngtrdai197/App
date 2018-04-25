import { Injectable } from '@angular/core';

declare var toastr: any;

@Injectable()
export class ToastrService {

  constructor() { }

  Error( title: string, message?: string) {
    toastr.error(title, message);
  }
  Success( title: string, message?: string) {
    toastr.success(title, message);
  }

}
