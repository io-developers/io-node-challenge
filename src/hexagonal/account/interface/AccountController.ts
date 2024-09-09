import { Request, Response, NextFunction } from "express";
import { AccountNotFoundError } from "../domain/AccountNotFoundError";
import { DependencyInjecttionContainer } from "../../DependencyInjecttionContainer";

export class AccountController {
  async getOne(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;

    if (!id) next(new Error("Id es obligatorio"));

    try {
      const account =
        await DependencyInjecttionContainer.account.getOne.execute(id);

      return res.json({ ...account.mapToPrimitives() }).status(200);
    } catch (error) {
      if (error instanceof AccountNotFoundError) {
        res.status(404).json({ message: error.message });
      }

      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    const { id, amount } = req.body;

    if (!id) next(new Error("Id es obligatorio"));

    try {
      await DependencyInjecttionContainer.account.update.execute(id, amount);

      return res.status(200).json({ message: "ok" });
    } catch (error) {
      if (error instanceof AccountNotFoundError) {
        res.status(404).json({ message: error.message });
      }

      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    const { id, amount } = req.body;

    if (!amount) next(new Error("amount es obligatorio"));

    try {
      await DependencyInjecttionContainer.account.create.execute(id, amount);

      return res.status(200).json({ message: "ok" });
    } catch (error) {
      if (error instanceof AccountNotFoundError) {
        res.status(404).json({ message: error.message });
      }

      next(error);
    }
  }
}
