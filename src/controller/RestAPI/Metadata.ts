import { Request, Response } from "express";
import app from "../../index";
import { Metadata, MetadataType } from "../DataFetcher/MetadataFetcher";


export const getMetadata = (req: Request, res: Response) => {
  console.log("GET /metadata");
  try {
    new Metadata((metadata: Array<MetadataType>) => {
      res.send(metadata);
    });
  }
  catch(error) {
    console.error(error);
    res.status(400).send(error.message);
  }
};