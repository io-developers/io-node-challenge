export interface ProcessTransactionUseCase {
  execute(): Promise<object>;
}
