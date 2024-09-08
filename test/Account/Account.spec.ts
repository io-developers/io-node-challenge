import 'reflect-metadata';

import { getById, update } from './mock/RequestAccount';
import Container from '../../src/payBalance/infrastructureMock/interface/rootMook';

describe('{ Account } module test', () => {
  let configurationContainer;

  beforeAll(() => {
    configurationContainer = Container;
  });

  it('{ getAccountById } success request', async () => {
    const { event, context } = getById.succcess;
    const result = await configurationContainer(event, context?.functionName);
    const body = JSON.parse(result.body);

    expect(result.statusCode).toEqual(200);
    expect(body).toHaveProperty('id', 'ACCOUNT-FOUND');
    expect(body).toHaveProperty('amount', 1992);
  });

  it('{ getAccountById } Account not found', async () => {
    const { event, context } = getById.acountNotFound;
    const result = await configurationContainer(event, context?.functionName);
    const body = JSON.parse(result.body);

    expect(result.statusCode).toEqual(404);
    expect(body).toHaveProperty('message', 'Account not found');
  });

  it('{ updateAmount } success request', async () => {
    const { event, context } = update.succcess;
    const result = await configurationContainer(event, context?.functionName);
    const body = JSON.parse(result.body);

    expect(result.statusCode).toEqual(200);
    expect(body).toHaveProperty('message', 'Updated successfully');
  });

  it('{ updateAmount } Warning, Account not found', async () => {
    const { event, context } = update.acountNotFound;
    const result = await configurationContainer(event, context?.functionName);
    const body = JSON.parse(result.body);

    expect(result.statusCode).toEqual(200);
    expect(body).toHaveProperty(
      'message',
      'No record was found, id: ACCOUNT-NOT-FOUND'
    );
  });
  
  it('{ updateAmount } Error, Data not found', async () => {
    const { event, context } = update.inputError;
    const result = await configurationContainer(event, context?.functionName);
    const body = JSON.parse(result.body);

    expect(result.statusCode).toEqual(400);
    expect(body).toHaveProperty(
      'message',
      'Something was wrong'
    );
  });
});
