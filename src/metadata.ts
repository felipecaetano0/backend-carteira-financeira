import * as fs from 'fs';
import path from 'path';
import csv from 'csv-parser';


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


export class Metadata {
  static filename = path.join(__dirname, '/dados/ativos.csv')
  static results = [];

  static fetch(callback: (metadata: Array<MetadataType>) => void) {
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

