import { Injectable } from '@angular/core';
import { IFile } from '../interface/IFile';
import { HttpClient, HttpRequest, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

const httpOptions = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'my-auth-token'
    })
};

@Injectable()
export class FilesService {
    public API = 'http://localhost:3000/sources';

    newFolder: IFile;
    private nameFolderAdd = new BehaviorSubject(null);
    private filesArrKeyWord = new BehaviorSubject([]);
    constructor(private http: HttpClient) {
    }

    postFiles(): any {
        this.http.post(this.API, this.newFolder);
        return this.http.get(this.API);
    }
    getFile(): any {
        return this.http.get(this.API);
    }

    addFolder(newFolder: IFile): Observable<IFile> {
        this.newFolder = newFolder;
        return this.http.post<IFile>(this.API, newFolder, httpOptions);
    }

    deleteFolder(id: number): Observable<{}> {
        const url = `${this.API}/${id}`;
        return this.http.delete(url, httpOptions);
    }

    public getThongTinSearch() {
        return this.filesArrKeyWord.asObservable();
    }

    public search(filteredFiles) {
        this.filesArrKeyWord.next(filteredFiles);
    }

    public nameFolder(folderN) {
        this.nameFolderAdd.next(folderN);
    }
    public getNameFolder() {
        return this.nameFolderAdd.asObservable();
    }

}
