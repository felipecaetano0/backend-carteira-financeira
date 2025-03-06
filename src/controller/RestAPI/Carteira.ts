import { Request, Response } from "express";
import Carteira from "../../model/Carteira";


export const getCarteira = (req: Request, res: Response) => {
  const { tickers, pesos, from, to, valorInicial } = req.query;
  console.log(`GET /carteira`);
  const tickersArray = (tickers as string).split(",") ?? [];
  const pesosArray = typeof pesos === 'string' ? pesos.split(",").map(Number) : [];
  try {
    const carteira: Carteira = new Carteira(tickersArray, pesosArray, from as string, to as string);
    carteira.simular(Number.isNaN(Number(valorInicial)) ? 0 : Number(valorInicial));
    res.send(carteira);
  } catch (error) {
    res.status(400).send(error.message);
  }
};