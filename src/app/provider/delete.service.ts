import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class DeleteFileService {

    private deleteFile = new BehaviorSubject(null);
    constructor() { }

    getStatusDelete() {
        return this.deleteFile.asObservable();
    }
    statusDelete(status) {
        this.deleteFile.next(status);
    }

}