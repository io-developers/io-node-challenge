import { JTDSchemaType } from "ajv/dist/jtd"
import { ajvInstance, isUUID } from "../../shared/util/helper"
import { Transaction } from "../../transaction/domain/Transaction";

export class RegisterActivityRequest {
  static parse(json: string): Transaction {
    const schema: JTDSchemaType<Transaction> = {
      properties: {
        transactionId: { type: 'string' },
        userId: { type: 'string' },
        amount: { type: 'float32' },
      },
    }

    const parse = ajvInstance().compileParser(schema)
    const payload = parse(json);

    if (! payload) {
      throw new TypeError(parse.message)
    }

    if (! isUUID(payload.userId)) {
      throw new TypeError('Invalid UUID format for userId');
    }

    if (! isUUID(payload.transactionId)) {
      throw new TypeError('Invalid UUID format for transactionId');
    }

    if (payload.amount < 0) {
      throw new TypeError('Amount must be greater than 0');
    }

    return payload
  }
}