import { JTDSchemaType } from "ajv/dist/core";
import { ajvInstance, isUUID } from "../../shared/util/helper";

export type CheckUserPayload = {
  userId: string
}

export class CheckUserRequest {
  static parse(json: string) {
    const schema: JTDSchemaType<CheckUserPayload> = {
      properties: {
        userId: { type: "string" }
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

    return payload;
  }
}