export class TransactionFailed extends Error {
    constructor(
      message: string
    ) {
        super(message);
    }
}