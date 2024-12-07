// Identificadores para las dependencias
export const TYPES = {
    TableName: Symbol.for("TableName"),
    DynamoDBClient: Symbol.for("DynamoDBClient"),
    TransactionRepository: Symbol.for("TransactionRepository"),
    CreateTransactionUsecase: Symbol.for("CreateTransactionUsecase"),
};