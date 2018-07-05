import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from 'angularfire2/firestore';
import { User } from '../interface/user';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';


@Injectable()
export class UserFireBaseService {
    usersCollection: AngularFirestoreCollection<User>;
    users = new BehaviorSubject<User[]>([]);

    constructor(private afs: AngularFirestore) {
        this.usersCollection = this.afs.collection('users');

        this.afs.collection('users')
            .snapshotChanges()
            .map((documents) => documents.map(doc => Object.assign({}, doc.payload.doc.data() as any, { id: doc.payload.doc.id })))
            .subscribe(users => this.users.next(users));

    }
    getUsers() {
        return this.users;
    }
    addUser(user: User) {
        this.usersCollection.add(user);
    }

}
