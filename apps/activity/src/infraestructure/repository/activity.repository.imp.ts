import { Injectable, Logger } from '@nestjs/common';
import { AttributeValue, DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';
import { Activity } from "../../domain/entity/activity.entity";
import { IActivityRepository } from "../../domain/repository/activity.repository";
import { DynamoDbException } from '../../domain/exception/dynamodb.excepciont';

@Injectable()
export class ActivityRepository implements IActivityRepository {
    private readonly dynamoClient: DynamoDBClient = new DynamoDBClient()
    constructor(private readonly logger: Logger) { }

    async registerActivity(activity: Activity): Promise<void> {
        this.logger.log('Start to insert Activity to DynamoDB', 'ActivityRepository - registerActivity');
        this.logger.log(`payload: ${JSON.stringify(activity)}`, 'ActivityRepository - registerActivity');
        const command = new PutItemCommand({
            TableName: process.env.TABLE_ACTIVITY,
            Item: this.mapActivityToItem(activity)
        });
        this.logger.log(`Comand: ${JSON.stringify(command)}`, 'ActivityRepository - registerActivity');
        try {
            await this.dynamoClient.send(command);
        } catch (error) {
            this.logger.error(`DynamoDB Error: ${JSON.stringify(error)}`, 'ActivityRepository - registerActivity');
            throw new DynamoDbException();
        }
    }

    private mapActivityToItem(activity: Activity): Record<string, AttributeValue> {
        return {
            'activityId': {
                "S": activity.activityId
            },
            "date": {
                "S": activity.date
            },
            "transactionId": {
                "S": activity.transactionId
            },
            "userId": {
                "S": activity.userId
            }
        };
    }
}