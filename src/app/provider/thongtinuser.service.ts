import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
@Injectable()
export class ThongTinUserService {
    private thongtin = new BehaviorSubject(null);

    constructor() { }

    getThongTin() {
        return this.thongtin.asObservable();
    }
    thongTin(user: any) {
        this.thongtin.next(user);
    }

}
