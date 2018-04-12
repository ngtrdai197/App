import { Injectable } from '@angular/core';
import { IFile } from '../interface/IFile';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
@Injectable()
export class FilesService {
    public API = 'http://localhost:3000/sources';
    constructor(private http: HttpClient) {
    }
    getFiles(): any {
        return this.http.get(this.API);
    }
}
