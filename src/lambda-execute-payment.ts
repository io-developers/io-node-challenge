import express from "express";
import { Request, Response, NextFunction } from "express";
import { AccountController } from "./hexagonal/account/interface/AccountController";
import { TransactionController } from "./hexagonal/transaction/infraestructure/TransactionController";
import serverlessExpress from "@vendia/serverless-express";

const controllerTransaction = new TransactionController();
const app = express();

app.use(express.json());

app.get("/v1/payments/:id", controllerTransaction.getOne);
app.post("/v1/payments", controllerTransaction.create);

app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof Error) {
    return res.status(500).json({ message: err.message });
  }
  return res.status(500).json({ message: "Something was wrong" });
});


export const handler = serverlessExpress({ app });
