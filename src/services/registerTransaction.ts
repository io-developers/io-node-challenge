import dynamoDb from '../utils/dynamoDB';
import {Transaction as TransactionRecord} from '../models/Transaction';

const TRANSACTIONS_TABLE = process.env.DYNAMO_TRANSACTIONS_TABLE || '';

export const registerTransaction = async (transactionRecord: TransactionRecord): Promise<void> => {
    const params = {
        TableName: TRANSACTIONS_TABLE,
        Item: transactionRecord,
    };

    try {
        await dynamoDb.put(params).promise();
        console.log('Transaction registered successfully:', transactionRecord);
    } catch (error) {
        console.error('Error registering transaction:', error);
        throw new Error('Could not register transaction');
    }
};
