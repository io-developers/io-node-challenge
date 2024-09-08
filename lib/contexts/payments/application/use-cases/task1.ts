type Params = {
  number: number;
};

export const handler = async (event: Params) => {
  // Simulación de lógica que decide el estado
  console.log('Event:', event, typeof event);
  console.log('test:', event.number);

  const { number } = event;

  const status = number > 0.5 ? 'SUCCESS' : 'FAILED';

  return {
    statusCode: 200,
    body: JSON.stringify({
      status,
    }),
  };
};
