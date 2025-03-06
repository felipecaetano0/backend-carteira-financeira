import { Request, Response } from "express";
import app from "../../index";
import { Indice } from "../../model/Indice";


export const getIndice =  (req: Request, res: Response) => {
  const ticker = req.params.ticker;
  const { from, to } = req.query;
  console.log(`GET /indice/${ticker}`);
  try{
    const indice = new Indice(ticker);
    if (from || to) {
      indice.crop(from as string, to as string);
    }
    res.send(indice);
  }
  catch(error) {
    console.error(error);
    if(error.message === "Ticker não encontrado") {
      res.status(404).send(error.message);
    }
    else {
      res.status(400).send(error.message);
    }
  }
};