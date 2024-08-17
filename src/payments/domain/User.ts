export class User {
  userId: string;
  name: string;
  lastName: string;

  constructor(userId: string, name: string, lastName: string) {
    this.userId = userId;
    this.name = name;
    this.lastName = lastName;
  }
}
