import { DependencyInjecttionContainer } from "../../DependencyInjecttionContainer";
import { TransactionNotFoundError } from "../domain/TransactionNotFoundError";

export class TransactionController {
  async getOne(req, res, next) {
    const { id } = req.parmas;

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
    const { source, id, data } = req.body;

    try {
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
