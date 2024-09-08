import rootHandler from './Root';

export const processTransaction = async (
  event: any,
  context: any
): Promise<any> => {
  event['action'] = 'processTransaction';
  const result = await rootHandler(event, context?.functionName);
  return result;
};
