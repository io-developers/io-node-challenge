import { UserAmout } from "./value-object/user-amout.vo";
import { UserId } from "./value-object/user-id.vo";

export class Account {
  id: UserId;
  amount: UserAmout;
  constructor(id: UserId, amount: UserAmout) {
    this.id = id;
    this.amount = amount;
  }

  mapToPrimitives() {
    return {
      id: this.id.value,
      amount: this.amount.value,
    };
  }
}
