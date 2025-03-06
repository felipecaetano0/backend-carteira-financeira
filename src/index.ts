import express, { Request, Response } from "express";
import { router } from "./controller/RestAPI/Routes";



const app = express();

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, Test!");
});

app.use("/", router);

if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 9999;
  app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
  });
}

export default app

