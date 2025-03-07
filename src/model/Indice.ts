import { IFileDataFetcher } from '../controller/DataFetcher/IDataFetcher';
import JSONFileDataFetcher from '../controller/DataFetcher/JSONFileDataFetcher';
import AtivoFinanceiro from './AtivoFinanceiro';


/**
* Representa um índice de ativo financeiro, como o IBOVESPA.
* Calcula os retornos diários do índice com base nos valores de fechamento.
*/
export class Indice extends AtivoFinanceiro {
  timestamps: number[] = [];
  valorFechamento: number[] = [];
  rentabilidadeDiaria: number[] = [];


  constructor(public ticker: string) {
    super(ticker);

    const dataFetcher = new JSONFileDataFetcher(ticker);
    this.timestamps = dataFetcher.timestamps;
    this.valorFechamento = dataFetcher.valor;
    if (this.isEmpty()) {
      throw new Error('Ticker não encontrado');
    }
    if (!this.dadosValidos()) {
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
   * Corta os arrays de dados (timestamps, valorFechamento, rentabilidadeDiaria) para o intervalo de tempo especificado.
   *
   * @param fromTimestamp - O timestamp inicial (inclusive) para os dados cortados.
   * @param toTimestamp - O timestamp final (inclusive) para os dados cortados.
   */
  crop(fromTimestamp: number | string, toTimestamp: number | string): { fromIndex: number; toIndex: number; } {
    const { fromIndex, toIndex } = super.crop(fromTimestamp, toTimestamp);
    this.valorFechamento = this.valorFechamento.slice(fromIndex, toIndex);
    return { fromIndex, toIndex };
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
}
