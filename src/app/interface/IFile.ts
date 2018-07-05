export interface IFile {
    name: string;
    type: string;
    date: Date;
    daterepair: Date;
    parentId?: number;
    linkDownload?: string;
}
