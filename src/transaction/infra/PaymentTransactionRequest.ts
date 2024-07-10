import Ajv, { JTDSchemaType } from "ajv/dist/jtd"
import { ajvInstance, isUUID } from "../../shared/util/helper"

export type PaymentTransactionPayload = {
  userId: string
  amount: number
}

export class PaymentTransactionRequest {
  static parse(json: string): PaymentTransactionPayload {
    const schema: JTDSchemaType<PaymentTransactionPayload> = {
      properties: {
        userId: { type: "string" },
        amount: { type: "float32" },
      },
    }

    const parse = ajvInstance().compileParser(schema)
    const payload = parse(json);

    if (! payload) {
      throw new TypeError(parse.message)
    }

    if (! isUUID(payload.userId)) {
      throw new TypeError('Invalid UUID format');
    }

    if (payload.amount < 0) {
      throw new TypeError('Amount must be greater than 0');
    }

    return payload
  }
}