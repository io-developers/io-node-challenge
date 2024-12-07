/* eslint-disable @typescript-eslint/no-explicit-any */
import { updateAccountHandler } from './../src/infraestructure/handlers/update-account.handler';

import { DynamoDBStreamEvent } from 'aws-lambda';
import { Logger } from "@aws-lambda-powertools/logger";
import { validate, ValidationError } from 'class-validator';
import { UpdateAccountUsecase } from '../src/application/usecases/update-account.usecase';


describe('updateAccountHandler', () => {
  let loggerSpy: jest.SpyInstance; 
  let validateSpy: jest.SpyInstance;
  let executeSpy: jest.SpyInstance;

  beforeEach(() => {
    executeSpy = jest.spyOn(UpdateAccountUsecase.prototype, 'execute');
    validateSpy = jest.spyOn(require('class-validator'), 'validate');
  });
    
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should log Invalid record', async () => {
    loggerSpy = jest.spyOn(Logger.prototype, 'error');
    const event: DynamoDBStreamEvent = {
      Records: [
        {
          eventName: 'INSERT',
          dynamodb: {
            NewImage: {
              data: {},
            },
          },
        },
      ],
    } as any;

    await updateAccountHandler(event);


    expect(loggerSpy).toHaveBeenCalledWith(`Invalid record: ${event.Records[0]}`);
    expect(validate).not.toHaveBeenCalled();
    expect(executeSpy).not.toHaveBeenCalled();
  });

  it('should log validation errors and skip invalid records', async () => {
    loggerSpy = jest.spyOn(Logger.prototype, 'error');
    const event: DynamoDBStreamEvent = {
      Records: [
        {
          eventName: 'INSERT',
          dynamodb: {
            NewImage: {
              data: {
                M: {
                  amount: { N: '100' },
                },
              },
            },
          },
        },
      ],
    } as any;

    const validationErrors: ValidationError[] = [
      { property: 'accountId', constraints: { isNotEmpty: 'accountId should not be empty' } },
    ];
    validateSpy.mockResolvedValue(validationErrors);
    
    await updateAccountHandler(event);

    expect(validate).toHaveBeenCalled();
    expect(loggerSpy).toHaveBeenCalledWith(`Validation errors: ${JSON.stringify(validationErrors.map(e => e.constraints))}`);
    expect(executeSpy).not.toHaveBeenCalled();
  });

  it('should call updateAccountUsecase with correct parameters and check data', async () => {
    loggerSpy = jest.spyOn(Logger.prototype, 'info');
    const event: DynamoDBStreamEvent = {
      Records: [
        {
          eventName: 'INSERT',
          dynamodb: {
            NewImage: {
              data: {
                M: {
                  accountId: { S: '123' },
                  amount: { N: '100' },
                },
              },
            },
          },
        },
      ],
    } as any;

    validateSpy.mockResolvedValue([]);
    executeSpy.mockResolvedValue({ status: 'OK' });

    await updateAccountHandler(event);

    expect(validate).toHaveBeenCalled();
    expect(executeSpy).toHaveBeenCalledWith('123', 100);
    expect(loggerSpy).toHaveBeenCalledWith('updateAccountHandler executed successfully:', { data: { status: 'OK' } });
  });

    it('should log errors when updateAccountUsecase fails', async () => {
      loggerSpy = jest.spyOn(Logger.prototype, 'error');
      const event: DynamoDBStreamEvent = {
        Records: [
          {
            eventName: 'INSERT',
            dynamodb: {
              NewImage: {
                data: {
                  M: {
                    accountId: { S: '123' },
                    amount: { N: '100' },
                  },
                },
              },
            },
          },
        ],
      } as any;

      validateSpy.mockResolvedValue([]);
      executeSpy.mockResolvedValue({ status: 'ERROR' });

      await updateAccountHandler(event);

      expect(validate).toHaveBeenCalled();
      expect(executeSpy).toHaveBeenCalledWith('123', 100);
      expect(loggerSpy).toHaveBeenCalledWith(`Failed to update account: ${JSON.stringify({ status: 'ERROR' })}`);
    });
});