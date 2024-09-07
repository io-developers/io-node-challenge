import { AccountAmout } from "./value-object/account-amout.vo";
import { AccountId } from "./value-object/account-id.vo";

export class Account {
  id: AccountId;
  amount: AccountAmout;
  constructor(id: AccountId, amount: AccountAmout) {
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
