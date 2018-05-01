import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class DeleteFileService {

    private deleteFile = new BehaviorSubject(null);
    private recycleBin = new BehaviorSubject(null);
    private sttAllFiles = new BehaviorSubject(null);
    constructor() { }

    getStatusDelete() {
        return this.deleteFile.asObservable();
    }
    statusDelete(status) {
        this.deleteFile.next(status);
    }

    statusRecycleBin(stt) {
        this.recycleBin.next(stt);
    }

    getStatusRecycleBin() {
        return this.recycleBin.asObservable();
    }

    statusAllFiles(stt) {
        this.sttAllFiles.next(stt);
    }

    getStatusAllFiles() {
        return this.sttAllFiles.asObservable();
    }

}