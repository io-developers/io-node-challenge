export class UserNotFound extends Error {
  constructor(params: { userId: string }) {
    super(`User with id ${params.userId} not found`);
  }
}