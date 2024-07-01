import { Query } from "../../../shared/QueryHandler";

export class FindUserQuery extends Query {
  private readonly userId: string;

  constructor(params: {
    readonly userId: string,
  }) {
    super();

    this.userId = params.userId;
  }

  getUserId(): string {
    return this.userId;
  }
}