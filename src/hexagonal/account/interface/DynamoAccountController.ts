import { Request, Response, NextFunction } from "express";
import { AccountNotFoundError } from "../domain/AccountNotFoundError";
import { DependencyInjecttionContainer } from "../../DependencyInjecttionContainer";

export class DynamoDbAccountController {
  async getOne(id: string) {
    if (!id) {
      return false;
    }

    try {
      const account =
        await DependencyInjecttionContainer.DAccount.getOne.execute(id);

      return {
        statusCode: 200,
        body: JSON.stringify({ ...account.mapToPrimitives() }),
      };
    } catch (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ message: error.message }),
      };
    }
  }

  async update(accountId: string, amount) {
    const addAmount = amount;

    try {
      const account =
        await DependencyInjecttionContainer.DAccount.getOne.execute(accountId);

      const { id, amount } = account.mapToPrimitives();

      if (!id) {
        throw new AccountNotFoundError("Account not found");
      }
      const newAmount = amount + addAmount;

      await DependencyInjecttionContainer.DAccount.update.execute(
        accountId,
        amount
      );

      return {
        statusCode: 200,
        body: JSON.stringify({
          message: "Account updated successfully",
          newAmount,
        }),
      };
    } catch (error) {
      console.error("Error:", error);
      return {
        statusCode: 500,
        body: JSON.stringify({ message: "Internal server error" }),
      };
    }
  }
}
