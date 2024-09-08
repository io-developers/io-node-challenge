import 'reflect-metadata';

import Container from '../../src/payBalance/infrastructureMock/interface/rootMook';

describe('{ Account } module test', () => {
  let configurationContainer;

  beforeAll(() => {
    configurationContainer = Container;
  });

  it('{ processTransaction } success request', async () => {
    const context = { functionName: 'execute-payment' };
    const result = await configurationContainer({}, context?.functionName);

    expect(result).toHaveProperty('id', 12345678);
    expect(result).toHaveProperty('message', 'success');
  });
});
