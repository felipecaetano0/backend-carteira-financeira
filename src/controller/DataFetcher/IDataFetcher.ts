export interface IDataFetcher {
    fetch(param: any):any;
}

export interface IFileDataFetcher  extends IDataFetcher {
  timestamps: number[];
  valorFechamento: number[];
}

