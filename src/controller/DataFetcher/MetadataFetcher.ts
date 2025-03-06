import * as fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import { IDataFetcher } from './IDataFetcher';


export type MetadataType = {
  categoria: string;
  codigoAtivo: string;
  descricao: string;
  etiqueta: string;
  nome: string;
  nomeBovespa: string;
  subtipo: string;
  tipo: string;
}


export class Metadata implements IDataFetcher {
  filename = path.join(__dirname, '../../dados/ativos.csv')
  results = [];
  
  constructor(fetchCallback: (metadata: Array<MetadataType>) => void) {
    this.fetch(fetchCallback);
  }

  fetch(callback: (metadata: Array<MetadataType>) => void) {
    fs.createReadStream(this.filename)
      .pipe(csv())
      .on('data', (data) => this.results.push(data))
      .on('end', () => {
        // console.log('Metadata file fetched');
        // console.log(this.results);
        callback(this.results);
      })
      .on('error', (err) => {
        console.error('Error reading CSV file:', err);
      });
  }
}
