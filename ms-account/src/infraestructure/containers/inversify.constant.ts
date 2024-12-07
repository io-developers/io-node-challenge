// Identificadores para las dependencias
export const TYPES = {
    TableName: Symbol.for("TableName"),
    DynamoDBClient: Symbol.for("DynamoDBClient"),
    AccountRepository: Symbol.for("AccountRepository"),
    ValidateAccountUsecase: Symbol.for("ValidateAccountUsecase"),
    GetAccountUsecase: Symbol.for("GetAccountUsecase"),
    UpdateAccountUsecase: Symbol.for("UpdateAccountUsecase")
};