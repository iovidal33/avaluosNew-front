import { Injectable } from '@angular/core';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
const EXCEL_EXTENSION = '.xlsx';

@Injectable({
  providedIn: 'root',
})
export class ExcelService {
  constructor() {}

  public exportAsExcelFile(headers: any[], data: any[], excelFileName: string): void {
    let worksheet: XLSX.WorkSheet;
    let sheetName = 'Investigación de mercado';
    data.unshift(headers);
    worksheet = XLSX.utils.json_to_sheet(data, {skipHeader: true});
    worksheet['!cols'] = [{wch: 30}, {wch: 40}, {wch: 10}, {wch: 10}, {wch: 40}, {wch: 30}, {wch: 15}, {wch: 10}, {wch: 10}, {wch: 10}];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE,
    });

    FileSaver.saveAs(
      data,
      fileName + EXCEL_EXTENSION
    );
  }

  public saveData(blob: Blob, fileName: string): void {
    var a = document.createElement('a');
    document.body.appendChild(a);
    const url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = fileName + '_' + new Date().getTime() + EXCEL_EXTENSION;
    a.click();
    window.URL.revokeObjectURL(url);
  }
}
