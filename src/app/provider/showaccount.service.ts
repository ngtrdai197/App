import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
@Injectable()
export class ShowAccountService {
    private showAccount = new BehaviorSubject(null);
    constructor() { }
    getShowAccount() {
        return this.showAccount.asObservable();
    }
    show(show) {
        this.showAccount.next(show);
    }
}
