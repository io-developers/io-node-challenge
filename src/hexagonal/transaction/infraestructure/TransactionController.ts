import { DependencyInjecttionContainer } from "../../DependencyInjecttionContainer";
import { TransactionNotFoundError } from "../domain/TransactionNotFoundError";
import { Request, Response, NextFunction } from "express";
import axios from "axios";
export class TransactionController {
  async getOne(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;

    try {
      const transaction =
        await DependencyInjecttionContainer.transaction.getOne.execute(id);
      return res.status(200).json({ ...transaction.mapToPrimitives() });
    } catch (error) {
      if (error instanceof TransactionNotFoundError) {
        res.status(404).json({ message: error.message });
      }
      next(error);
    }
  }

  async create(req, res, next) {
    const { id, data } = req.body;

    try {
      const urlExternal = `http://localhost:3010/api/process-payment`;
      const processPayment: any = await axios.post<{
        message: string;
        transactionId: string;
      }>(urlExternal, data);
      console.log(processPayment.data);
      const source = processPayment.data.transactionId;

      await DependencyInjecttionContainer.transaction.create.execute(
        source,
        id,
        data
      );
      return res.status(200).json({ message: "ok" });
    } catch (error) {
      next(error);
    }
  }
}
