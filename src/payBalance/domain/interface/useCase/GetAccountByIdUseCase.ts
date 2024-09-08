export interface GetAccountByIdUseCase {
  execute(id: string): Promise<object>;
}
