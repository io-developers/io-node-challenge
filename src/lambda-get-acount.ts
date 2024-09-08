import express from "express";
import { Request, Response, NextFunction } from "express";
import { AccountController } from "./hexagonal/account/interface/AccountController";
import { TransactionController } from "./hexagonal/transaction/infraestructure/TransactionController";
import serverlessExpress from "@vendia/serverless-express";

const controllerAcount = new AccountController();
const app = express();

app.use(express.json());

app.get("/v1/accounts/:id", controllerAcount.getOne);

app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof Error) {
    return res.status(500).json({ message: err.message });
  }
  return res.status(500).json({ message: "Something was wrong" });
});


export const handler = serverlessExpress({ app });
