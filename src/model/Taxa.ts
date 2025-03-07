import XLSXFileDataFetcher from "../controller/DataFetcher/XLSXFileDataFetcher";
import AtivoFinanceiro from "./AtivoFinanceiro";



export class Taxa extends AtivoFinanceiro {
  timestamps: number[] = [];
  rentabilidadeDiaria: number[] = [];


  constructor(public ticker: string) {
    super(ticker);

    const dataFetcher = new XLSXFileDataFetcher(ticker);
    this.timestamps = dataFetcher.timestamps;
    this.rentabilidadeDiaria = dataFetcher.valor.map(valor => valor + 1);
    if (this.isEmpty()) {
      throw new Error('Ticker não encontrado');
    }
    if (!this.dadosValidos()) {
      throw new Error('Dados inválidos');
    }
  }


  /**
   * Verifica se os arrays de dados (timestamps e rentabilidadeDiaria) possuem dados válidos e se têm o mesmo tamanho.
   * 
   * @returns {boolean} Retorna true se os arrays timestamps e rentabilidadeDiaria não estiverem vazios e tiverem o mesmo comprimento.
   * Retorna false caso contrário.
   */
  dadosValidos(): boolean {
    return (this.timestamps.length > 0 && this.rentabilidadeDiaria.length > 0) &&
      (this.timestamps.length === this.rentabilidadeDiaria.length);
  }


  isEmpty(): boolean {
    return this.timestamps.length === 0 && this.rentabilidadeDiaria.length === 0;
  }
}