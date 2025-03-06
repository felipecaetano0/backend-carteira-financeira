import express, { Request, Response } from "express";
import { getMetadata } from "./Metadata";
import { getCarteira } from "./Carteira";
import { getIndice } from "./Indice";


export const router = express.Router();

router.get("/metadata", getMetadata);
router.get("/carteira", getCarteira);
router.get("/indice/:ticker", getIndice);
