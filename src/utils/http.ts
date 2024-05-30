import axios from 'axios';

export const http = axios.create({});

export type PdfCatalog = {
    'catalogLevel': number,
    'catalogName': string,
    'childCatalogList': PdfCatalog[],
    'pageNum': number,
    'position': number,
    'catalogId': string
}
export type PdfPageInfo = {
    'content': string,
    'height': number,
    'imgUrl': string,
    'pageNum': number,
    'pdfUrl': string,
    'width': number,
    'pageId': string
}
export type PdfBook = {
    'bookId': string,
    'bookName': string,
    'childCatalogList': PdfCatalog[],
    'pageInfoList': PdfPageInfo[],
    'totalPage': number
}