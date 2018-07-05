export interface FileData {
    name: string;
    type: string;
    date: Date;
    id: number;
    daterepair: Date;
    parentId?: number;
    linkDownload?: string;
}
