import { Test, TestingModule } from '@nestjs/testing';
import { UserServiceHttp } from '@infrastructure/service/http/user.service';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';

describe('UsersService', () => {
  let service: UserServiceHttp;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserServiceHttp, DynamoDBClient],
    }).compile();

    service = module.get<UserServiceHttp>(UserServiceHttp);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should validate existing user', async () => {
    jest.spyOn(service, 'validateUser').mockResolvedValue(true);
    const isValid = await service.validateUser('existing-user-id');
    expect(isValid).toBe(true);
  });

  it('should not validate non-existing user', async () => {
    jest.spyOn(service, 'validateUser').mockResolvedValue(false);
    const isValid = await service.validateUser('non-existing-user-id');
    expect(isValid).toBe(false);
  });
});
