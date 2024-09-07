export class UserAmout {
  value: number;

  constructor(value: number) {
    this.value = value;
    this.isNumber();
  }

  private isNumber() {
    if (typeof this.value !== "number") {
      throw new Error("el valor debe ser numerico");
    }

    if (this.value <= 0) {
      throw new Error("El valor debe ser mayor a 0");
    }
  }
}
