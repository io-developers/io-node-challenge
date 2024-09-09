import { validate as uuidValidate } from "uuid";

export class TransactionSourceVo {
  value: string;

  constructor(value: string) {
    this.value = value;
    this.isValidated();
  }

  private isValidated() {
    if (!uuidValidate(this.value)) {
      throw new Error("el source debe ser de tipo uuid");
    }
  }
}
