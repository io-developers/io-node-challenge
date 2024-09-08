import rootHandler from './Root';

export const updateAccountAmount = async (
  event: any,
  context: any
): Promise<any> => {
  return await rootHandler(event, context?.functionName);
};

export const getAccountById = async (
  event: any,
  context: any
): Promise<any> => {
  return await rootHandler(event, context?.functionName);
};
