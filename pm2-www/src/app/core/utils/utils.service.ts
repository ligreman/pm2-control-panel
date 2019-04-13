import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { saveAs } from 'file-saver';

@Injectable({
    providedIn: 'root'
})
export class UtilsService {

    constructor() {
    }

    /**
     * Saves a file by opening file-save-as dialog in the browser
     * using file-save library.
     * @param blobContent file content as a Blob
     * @param fileName name file should be saved as
     */
    static saveFile(blobContent: Blob, fileName: string) {
        const blob = new Blob([blobContent], {type: 'application/octet-stream'});
        saveAs(blob, fileName);
    }

    /**
     * Derives file name from the http response
     * by looking inside content-disposition
     * @param response http Response
     */
    static getFileNameFromResponseContentDisposition(response: any) {
        const contentDisposition = response.headers.get('content-disposition') || '';
        const matches = /filename=([^;]+)/ig.exec(contentDisposition);

        let name = 'untitled';
        if (matches.length > 0) {
            name = matches[1].trim();
        }

        const fecha = new Date();
        return fecha.getTime() + '_' + name;
    };
}
