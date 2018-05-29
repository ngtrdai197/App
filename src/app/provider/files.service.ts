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
    private idFolder = new BehaviorSubject(null);
    private filesArrKeyWord = new BehaviorSubject([]);
    private valueInputSearch = new BehaviorSubject(null);

    private recycleBin = new BehaviorSubject([]);

    constructor(private http: HttpClient) {
    }

    getFile(parentId = 0): any {
        const url = `${this.API}?parentId=${parentId}`;
        return this.http.get(url);
    }

    getAllFile(): any {
        return this.http.get(this.API);
    }

    // thêm 1 folder
    addFolder(newFolder: IFile): Observable<IFile> {
        return this.http.post<IFile>(this.API, newFolder, httpOptions);
    }

    // thay đổi tên của file/folder
    updateNameFolder(renameFolder: IFile, id: number): Observable<any> {
        return this.http.put<IFile>(`${this.API}/${id}`, renameFolder, httpOptions);
    }

    deleteFolder(id): Observable<{}> {
        const url = `${this.API}/${id}`;
        return this.http.delete(url, httpOptions);
    }

    getThongTinSearch() {
        return this.filesArrKeyWord.asObservable();
    }

    search(filteredFiles) {
        this.filesArrKeyWord.next(filteredFiles);
    }

    getValueSearchNull() {
        return this.valueInputSearch.asObservable();
    }
    // kiểm tra value input có null để load data
    valueSearchNull(valeSearchNull) {
        return this.valueInputSearch.next(valeSearchNull);
    }

    // lấy tên của folder bên component FolderComponent
    nameFolder(folderN) {
        this.nameFolderAdd.next(folderN);
    }
    getNameFolder() {
        return this.nameFolderAdd.asObservable();
    }

    // lấy ID của folder/file được chọn
    _idFolder(id) {
        this.idFolder.next(id);
    }
    // trả về ID của folder/file được chọn.
    getIdFolder() {
        return this.idFolder.asObservable();
    }

    // lấy folder/file được chọn để xóa
    _recycleBin(folder) {
        const danhSachFolderXoa = this.recycleBin.getValue();
        danhSachFolderXoa.push(folder);
        this.recycleBin.next(danhSachFolderXoa);
    }
    // trả về mảng chứa các folder/file đã xóa
    getRecycleBin() {
        return this.recycleBin.asObservable();
    }
}
