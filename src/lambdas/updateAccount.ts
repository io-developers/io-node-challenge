import dynamoDb from '../utils/dynamoDB';
import {PaymentRequest} from '../models/PaymentRequest'

const ACCOUNTS_TABLE = process.env.DYNAMO_ACCOUNTS_TABLE || '';

export const updateAccount = async (updateRequest: PaymentRequest): Promise<void> => {
    const params = {
        TableName: ACCOUNTS_TABLE,
        Key: {
            id: updateRequest.accountId,
        },
        UpdateExpression: 'SET amount = amount + :amount',
        ExpressionAttributeValues: {
            ':amount': updateRequest.amount,
        },
    };

    try {
        await dynamoDb.update(params).promise();
        console.log('Account updated successfully:', {updateRequest});
    } catch (error) {
        console.error('Error updating account:', {error});
        throw new Error('Could not update account');
    }
};
