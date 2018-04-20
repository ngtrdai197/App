import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from 'angularfire2/firestore';
import { User } from '../interface/user';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class UserFireBaseService {
    userCollection: AngularFirestoreCollection<User>;
    users$: Observable<User[]>;
    constructor(private afs: AngularFirestore) {
        this.userCollection = this.afs.collection('users');
        this.users$ = this.userCollection.valueChanges();
    }
    getUsers() {
        return this.users$;
    }
}
