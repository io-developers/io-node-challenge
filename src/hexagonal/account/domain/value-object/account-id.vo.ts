import { validate as uuidValidate } from 'uuid';

export class AccountId {
  value: string;

  constructor(value: string) {
    this.value = value;
    this.isUuid();
  }

  private isUuid() {
    if (!uuidValidate(this.value)) {
      throw new Error("el id debe ser de tipo uuid");
    }
  }
}
