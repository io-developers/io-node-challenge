"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.update = exports.getById = void 0;
exports.getById = {
    succcess: {
        event: { pathParameters: { accountId: 'ACCOUNT-FOUND' } },
        context: { functionName: 'get-account' }
    },
    acountNotFound: {
        event: { pathParameters: { accountId: 'ACCOUNT-NOT-FOUND' } },
        context: { functionName: 'get-account' }
    }
};
exports.update = {
    succcess: {
        event: {
            Records: [
                {
                    dynamodb: {
                        NewImage: {
                            data: {
                                M: {
                                    accountId: { S: 'NEW-TRANSACTION-ACCUNT-ID' },
                                    amount: { N: '208' }
                                }
                            }
                        }
                    }
                }
            ]
        },
        context: { functionName: 'update-account' }
    },
    acountNotFound: {
        event: {
            Records: [
                {
                    dynamodb: {
                        NewImage: {
                            data: {
                                M: {
                                    accountId: { S: 'ACCOUNT-NOT-FOUND' },
                                    amount: { N: '208' }
                                }
                            }
                        }
                    }
                }
            ]
        },
        context: { functionName: 'update-account' }
    },
    inputError: {
        event: { Records: [{ dynamodb: { NewImage: {} } }] },
        context: { functionName: 'update-account' }
    }
};
