import { Indice } from "./Indice";


/**
* Representa uma carteira de ativos financeiros.
* Calcula os retornos diários e anuais da carteira com base nos retornos individuais dos índices e seus pesos.
*/
export default class Carteira {
  indices: Indice[] = [];
  indicesPonderados: number[][] = []; 

  rentabilidadeDiaria: number[] = [];
  valorInicial: number = 0;
  valorFinal: number = 0;
  rentabilidadeTotal: number = 0;
  rentabilidadePercentual: number = 0;


  constructor(public tickers: string[], public pesos: number[], from: string, to: string) {
    if (tickers.length !== pesos.length) {
      throw new Error('Número de tickers deve ser igual ao número de pesos');
    }
    if (tickers.length === 0) {
      throw new Error('É necessário pelo menos um ticker');
    }
    if(!this.pesosValidos()) {
      throw new Error('Somatória dos pesos diferente de 100%');
    }

    tickers.forEach(ticker => { this.indices.push(new Indice(ticker)); });
    if(from || to) {
      this.crop(from, to);
    }
    this.crop(from, to);

    this.calcularRentabilidadeDiaria();
  }


  /**
   * Calcula a rentabilidade diária da carteira multiplicando a rentabilidade diária de cada índice pelo seu peso e somando os retornos ponderados.
   */
  private calcularRentabilidadeDiaria() {
    // Para cada indice, multiplicar sua rentabilidade diária pelo seu peso
    this.indices.forEach((indice, i) => {
      const peso = (this.pesos[i] / 100);
      const indicePonderado = indice.rentabilidadeDiaria.map(indice => indice * peso);
      this.indicesPonderados.push(indicePonderado);
    });
    // somar os resultados para obter a rentabilidade diária ponderada
    this.rentabilidadeDiaria = new Array(this.indices[0].rentabilidadeDiaria.length).fill(0);
    this.indicesPonderados.forEach(indicePonderado => {
      this.rentabilidadeDiaria = this.rentabilidadeDiaria.map((valor, index) => valor + indicePonderado[index]);
    });
  }


  /**
   * Verifica se a soma dos pesos da carteira é igual a 100%.
   * @returns `true` se a soma dos pesos for 100%, `false` caso contrário.
   */
  pesosValidos(): boolean {
    let sum = this.pesos.reduce((acc, peso) => acc + peso, 0);
    return sum === 100;
  }


  /**
   * Corta os dados de cada índice da carteira para o intervalo de tempo especificado.
   * @param fromTimestamp - O timestamp inicial do intervalo de tempo para cortar.
   * @param toTimestamp - O timestamp final do intervalo de tempo para cortar.
   */
  crop(fromTimestamp: number | string, toTimestamp: number | string) {
    this.indices.forEach(indice => indice.crop(fromTimestamp, toTimestamp));
  }


  /**
   * Simula o desempenho da carteira com base no valor inicial do investimento.
   * Calcula o retorno total, valor final da carteira e retorno anual.
   * @param valorInicial - O valor inicial do investimento.
   */
  simular(valorInicial: number) {
    if (valorInicial < 0) {
      throw new Error('Valor Inicial deve ser positivo');
    }
    this.valorInicial = valorInicial;
    this.rentabilidadeTotal = this.rentabilidadeDiaria.reduce((acc, multiplicador) => acc * multiplicador, 1);
    this.valorFinal = this.valorInicial * this.rentabilidadeTotal;
    this.rentabilidadePercentual = (this.rentabilidadeTotal - 1) * 100;
  }
}
