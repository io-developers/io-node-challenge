/* eslint-disable @typescript-eslint/no-explicit-any */
import { createTransactionHandler } from './../src/infraestructure/handlers/create-transaction.handler';
import { CreateTransactionUsecase } from './../src/application/usecases/create-transaction.usecase';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { Logger } from "@aws-lambda-powertools/logger";
import { validate, ValidationError } from 'class-validator';
import { CreatedTransactionResDto } from '../src/application/dtos/response/created-transaction.res.dto';



describe('createTransactionHandler', () => {
  let loggerSpy: jest.SpyInstance; 
  let validateSpy: jest.SpyInstance;
  let executeSpy: jest.SpyInstance;

  beforeEach(() => {
    executeSpy = jest.spyOn(CreateTransactionUsecase.prototype, 'execute');
    validateSpy = jest.spyOn(require('class-validator'), 'validate');
  });
    
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return 400 if validation fails', async () => {
    loggerSpy = jest.spyOn(Logger.prototype, 'error');
    const event: APIGatewayProxyEvent = {
      body: JSON.stringify({}),
      headers: {},
      multiValueHeaders: {},
      httpMethod: 'POST',
      isBase64Encoded: false,
      path: '',
      pathParameters: null,
      queryStringParameters: null,
      multiValueQueryStringParameters: null,
      stageVariables: null,
      requestContext: {} as any,
      resource: '',
    } as any;

    const validationErrors: ValidationError[] = [
      { property: 'accountId', constraints: { isNotEmpty: 'accountId should not be empty' } },
      { property: 'amount', constraints: { isNotEmpty: 'amount should not be empty' } },
    ];
    validateSpy.mockResolvedValue(validationErrors);
    
    const result: APIGatewayProxyResult = await createTransactionHandler(event);

    expect(validate).toHaveBeenCalled();
    expect(loggerSpy).toHaveBeenCalledWith(`Validation errors: ${JSON.stringify(validationErrors.map(e => e.constraints))}`);
    expect(result.statusCode).toBe(400);
    expect(JSON.parse(result.body)).toEqual({ message: 'Invalid request', errors: validationErrors.map(e => e.constraints) });
    expect(executeSpy).not.toHaveBeenCalled();
  });

  it('should return 201 if transaction is created successfully', async () => {
    loggerSpy = jest.spyOn(Logger.prototype, 'info');
    const event: APIGatewayProxyEvent = {
      body: JSON.stringify({ accountId: '123', amount: 100, transactionCode: 'abc123' }),
      headers: {},
      multiValueHeaders: {},
      httpMethod: 'POST',
      isBase64Encoded: false,
      path: '',
      pathParameters: null,
      queryStringParameters: null,
      multiValueQueryStringParameters: null,
      stageVariables: null,
      requestContext: {} as any,
      resource: '',
    } as any;

    const mockResult = { transactionId: 'abc123' };

    validateSpy.mockResolvedValue([]);
    executeSpy.mockResolvedValue(mockResult);

    const result: APIGatewayProxyResult = await createTransactionHandler(event);

    expect(validate).toHaveBeenCalled();
    expect(executeSpy).toHaveBeenCalledWith({ accountId: '123', amount: 100, transactionCode: 'abc123' });
    expect(loggerSpy).toHaveBeenCalledWith('createTransactionHandler executed successfully:', { data: mockResult });
    expect(result.statusCode).toBe(201);
    expect(JSON.parse(result.body)).toEqual(mockResult);

  });

    it('should return 400 if an error occurs during execution', async () => {
      loggerSpy = jest.spyOn(Logger.prototype, 'error');
      const event: APIGatewayProxyEvent = {
        body: JSON.stringify({ accountId: '123', amount: 100, transactionCode: 'abc123' }),
        headers: {},
        multiValueHeaders: {},
        httpMethod: 'POST',
        isBase64Encoded: false,
        path: '',
        pathParameters: null,
        queryStringParameters: null,
        multiValueQueryStringParameters: null,
        stageVariables: null,
        requestContext: {} as any,
        resource: '',
      } as any;

      const mockError = new Error('Execution error');

      validateSpy.mockResolvedValue([]);
      executeSpy.mockRejectedValue(mockError);

      const result: APIGatewayProxyResult = await createTransactionHandler(event);

      expect(validate).toHaveBeenCalled();
      expect(executeSpy).toHaveBeenCalledWith({ accountId: '123', amount: 100, transactionCode: 'abc123' });
      expect(loggerSpy).toHaveBeenCalledWith(`Error processing request: ${mockError}`);
      expect(result.statusCode).toBe(400);
      expect(JSON.parse(result.body)).toEqual(new CreatedTransactionResDto({}));    
    });
});