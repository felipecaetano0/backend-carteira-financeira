import * as fs from 'fs';
import path from 'path';
import { IFileDataFetcher } from './IDataFetcher';


/**
 *  Classe que implementa a interface IFileDataFetcher para buscar dados de um arquivo JSON.
 */
export default class JSONFileDataFetcher implements IFileDataFetcher {
  timestamps: number[] = [];
  valor: number[] = [];

  constructor(public ticker: string) {
    this.fetch(ticker);
  }

  fetch(name: string) {
    const filename = path.join(__dirname, '../../dados/' + name + '.json')
    try {
      const assetDataString = fs.readFileSync(filename, 'utf8');
      const assetData = JSON.parse(assetDataString);
      this.timestamps = assetData.chart.result[0].timestamp;
      this.valor = assetData.chart.result[0].indicators.quote[0].close;
    }
    catch (err) {
      console.error('Arquivo não encontrado', err);
    }
  }
}