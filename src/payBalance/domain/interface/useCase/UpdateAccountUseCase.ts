export interface InputUpdateAccount {
  data: any;
}

export interface UpdateAccountUseCase {
  execute(payload: InputUpdateAccount): Promise<object>;
}