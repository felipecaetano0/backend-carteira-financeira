import { IFileDataFetcher } from '../controller/DataFetcher/IDataFetcher';
import JSONFileDataFetcher from '../controller/DataFetcher/JSONFileDataFetcher';


/**
* Representa um índice de ativo financeiro, como o IBOVESPA.
* Calcula os retornos diários do índice com base nos valores de fechamento.
*/
export class Indice {
  timestamps: number[] = [];
  valorFechamento: number[] = [];
  rentabilidadeDiaria: number[] = [];


  constructor(public ticker: string) {
    if (!ticker || ticker.trim() === '') {
      throw new Error('Ticker não pode ser vazio');
    }

    const dataFetcher: IFileDataFetcher = new JSONFileDataFetcher(ticker);
    this.timestamps = dataFetcher.timestamps;
    this.valorFechamento = dataFetcher.valorFechamento;
    if(this.isEmpty()) {
      throw new Error('Ticker não encontrado');
    }
    if(!this.dadosValidos()) {
      throw new Error('Dados inválidos');
    }
    this.calcularRentabilidadeDiaria();
  }

  /**
  * Calcula os retornos diários para o índice.
  */
  private calcularRentabilidadeDiaria() {
    if (!this.dadosValidos()) return;
    const length = this.valorFechamento.length;
    this.rentabilidadeDiaria = new Array(length);
    this.rentabilidadeDiaria[0] = 1;

    for (let i = 1; i < length; i++) {
      this.rentabilidadeDiaria[i] = this.valorFechamento[i] / this.valorFechamento[i - 1];
    }
  }

  /**
   * Verifica se os arrays de dados (timestamps e valorFechamento) possuem dados válidos e se têm o mesmo tamanho.
   * 
   * @returns {boolean} Retorna true se os arrays timestamps e valorFechamento não estiverem vazios e tiverem o mesmo comprimento.
   * Retorna false caso contrário.
   */
  dadosValidos(): boolean {
    return (this.timestamps.length > 0 && this.valorFechamento.length > 0) &&
      (this.timestamps.length === this.valorFechamento.length);
  }

  isEmpty(): boolean {
    return this.timestamps.length === 0 && this.valorFechamento.length === 0;
  }

  /**
   * Encontra o índice do primeiro timestamp no array `timestamps` que é maior ou igual ao `timestamp` fornecido.
   *
   * @param timestamp - O timestamp a ser procurado no array `timestamps`.
   * @returns O índice do primeiro timestamp que é maior ou igual ao timestamp fornecido.
   */
  findTimestampIndex(timestamp: number): number {
    const index = this.timestamps.findIndex(t => t >= timestamp);
    return index !== -1 ? index : this.timestamps.length;
  }


  /**
   * Corta os arrays de dados (timestamps, valorFechamento, rentabilidadeDiaria) para o intervalo de tempo especificado.
   *
   * @param fromTimestamp - O timestamp inicial (inclusive) para os dados cortados.
   * @param toTimestamp - O timestamp final (inclusive) para os dados cortados.
   */
  crop(fromTimestamp: number | string, toTimestamp: number | string) {
    fromTimestamp = Number.isNaN(Number(fromTimestamp)) ? 0 : Number(fromTimestamp);
    toTimestamp = Number.isNaN(Number(toTimestamp)) ? Number.POSITIVE_INFINITY : Number(toTimestamp);

    if (fromTimestamp > toTimestamp) {
      throw new Error('fromTimestamp cannot be greater than toTimestamp');
    }

    let fromIndex = this.findTimestampIndex(fromTimestamp);
    let toIndex = this.findTimestampIndex(toTimestamp);

    this.timestamps = this.timestamps.slice(fromIndex, toIndex);
    this.valorFechamento = this.valorFechamento.slice(fromIndex, toIndex);
    this.rentabilidadeDiaria = this.rentabilidadeDiaria.slice(fromIndex, toIndex);
  }
}
