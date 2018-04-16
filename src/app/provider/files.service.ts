import { Injectable } from '@angular/core';
import { IFile } from '../interface/IFile';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
@Injectable()
export class FilesService {
    public API = 'http://localhost:3000/sources';
    private _files: BehaviorSubject<IFile[]> = new BehaviorSubject([]);
    public files: IFile[];
    public filteredFiles: IFile[];
    constructor(private http: HttpClient) {
    }
    getFiles(): any {
        return this.http.get(this.API);
    }

    search(keyWord) {
        this.files = this.getFiles();
        this.filteredFiles = this.getFiles();
        const match = new RegExp(keyWord, 'g');
        this.filteredFiles = this.files.filter(f => {
            match.test(f.name);
        });
        this._files.next(this.filteredFiles);
    }

}
