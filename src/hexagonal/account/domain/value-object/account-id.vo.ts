import validate from "uuid";

export class AccountId {
  value: string;

  constructor(value: string) {
    this.value = value;
    this.isUuid();
  }

  private isUuid() {
    if (!validate(this.value)) {
      throw new Error("el valor debe ser de tipo uuid");
    }
  }
}
