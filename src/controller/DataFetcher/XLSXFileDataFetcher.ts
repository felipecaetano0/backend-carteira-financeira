import { IFileDataFetcher } from "./IDataFetcher";
import XLSX from 'xlsx';
import path from 'path';


/**
 * Classe que implementa a interface IFileDataFetcher para buscar dados de um arquivo XLSX.
 */
export default class XLSXFileDataFetcher implements IFileDataFetcher {
  timestamps: number[] = [];
  valor: number[] = [];

  constructor(public ticker: string) {
    this.fetch(ticker);
  }

  fetch(ticker: string) {
    const filename = path.join(__dirname, '../../dados/' + ticker + '.xlsx')
    // Lê o arquivo Excel 
    const workbook = XLSX.readFile(filename);

    // Seleciona a primeira planilha do arquivo
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    // Converte a planilha para um objeto JSON
    const data = XLSX.utils.sheet_to_json(worksheet);

    // Extrai os dados 
    data.forEach((row: { data: string; valor: string; }) => {
      row.data = row.data.replace(/(\d{2})\/(\d{2})\/(\d{4})/, '$3-$2-$1');
      this.timestamps.push(new Date(row.data).getTime());
      this.valor.push(Number(row.valor));
    });
  }
}
