import { Module } from '@nestjs/common';
import { UserServiceHttp } from '../../service/http/user.service';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';

@Module({
  providers: [UserServiceHttp, DynamoDBClient],
  exports: [UserServiceHttp],
})
export class UserModule {}
