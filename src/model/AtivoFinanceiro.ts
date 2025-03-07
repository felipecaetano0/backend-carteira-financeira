
/**
 * Classe abstrata que representa um ativo financeiro.
 */
export default abstract class AtivoFinanceiro {
  timestamps: number[] = [];
  rentabilidadeDiaria: number[] = [];


  abstract dadosValidos(): boolean
  abstract isEmpty(): boolean

  constructor(public ticker: string) {
    if (!ticker || ticker.trim() === '') {
      throw new Error('Ticker não pode ser vazio');
    }
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
  crop(fromTimestamp: number | string, toTimestamp: number | string): { fromIndex: number, toIndex: number } {
    fromTimestamp = Number.isNaN(Number(fromTimestamp)) ? 0 : Number(fromTimestamp);
    toTimestamp = Number.isNaN(Number(toTimestamp)) ? Number.POSITIVE_INFINITY : Number(toTimestamp);

    if (fromTimestamp > toTimestamp) {
      throw new Error('fromTimestamp cannot be greater than toTimestamp');
    }

    let fromIndex = this.findTimestampIndex(fromTimestamp);
    let toIndex = this.findTimestampIndex(toTimestamp);

    this.timestamps = this.timestamps.slice(fromIndex, toIndex);
    this.rentabilidadeDiaria = this.rentabilidadeDiaria.slice(fromIndex, toIndex);

    return { fromIndex, toIndex };
  }
}