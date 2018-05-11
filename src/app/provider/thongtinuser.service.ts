import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from '../interface/user';

const httpOptions = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'my-auth-token'
    })
};

@Injectable()
export class ThongTinUserService {

    private thongtin = new BehaviorSubject([]);
    public API_Users = 'http://localhost:3000/users';

    constructor(
        private http: HttpClient,
    ) { }

    getUser(): any {
        return this.http.get(this.API_Users);
    }
    // thêm 1 folder
    addUser(newUser: User): Observable<User> {
        return this.http.post<User>(this.API_Users, newUser, httpOptions);
    }

    deleteUser(id): Observable<{}> {
        const url = `${this.API_Users}/${id}`;
        return this.http.delete(url, httpOptions);
    } 

    getThongTin() {
        return this.thongtin.asObservable();
    }
    thongTin(user: any) {
        this.thongtin.next(user);
    }


}
