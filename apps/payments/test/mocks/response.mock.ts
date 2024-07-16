import { Transaction } from "apps/payments/src/domain/entities/transaction.entity";

export const responseMock: Transaction = {
    accountName: 'Nombre Cuenta',
    transactionId: '8af0e6be-3053-4ccf-99d1-70527cdd814e',
    transactionDescription: 'Descripcion de transaccion',
    transactionType: 'Payment',
    accountNumber: '54546768',
    amount: 20.26,
    userId: undefined,
    userName: undefined
}