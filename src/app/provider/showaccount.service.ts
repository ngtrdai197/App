import { Injectable } from '@angular/core';
import { BehaviorSubject ,  Observable } from 'rxjs';
@Injectable()
export class ShowAccountService {
    private showAccount = new BehaviorSubject(null);
    constructor() { }


    // lấy trạng thái khi click để hiện/ẩn đi thanh thông tin user
    
    getShowAccount() {
        return this.showAccount.asObservable();
    }
    show(show) {
        this.showAccount.next(show);
    }
}
