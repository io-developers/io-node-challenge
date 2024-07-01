import Ajv, { JTDSchemaType } from "ajv/dist/jtd"
import { ajvInstance, isUUID } from "../../shared/util/helper"
import { APIGatewayProxyEventQueryStringParameters } from "aws-lambda"

export type GetTransactionPayload = {
  transactionId: string
}

export class GetTransactionRequest {
  static parse(query: APIGatewayProxyEventQueryStringParameters): GetTransactionPayload {
    const schema: JTDSchemaType<GetTransactionPayload> = {
      properties: {
        transactionId: { type: "string" },
      },
    }

    const parse = ajvInstance().compileParser(schema)
    const payload = parse(JSON.stringify(query));

    if (! payload) {
      throw new TypeError(parse.message)
    }

    if (! isUUID(payload.transactionId)) {
      throw new TypeError('Invalid UUID format for transactionId');
    }

    return payload
  }
}