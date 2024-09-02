import {handler} from "./executePayment";
import axios from "axios";

const API_MOCK_URL = process.env.API_MOCK_URL;

describe('AWS Lambda Handler', () => {
  it('debería lanzar un error si el usuario no existe', async () => {
    const event = { userId: 'usuario-inexistente', amount: 100 };
    await expect(handler(event)).rejects.toThrow('User not found');
  });

  it('debería lanzar un error si el pago falla', async () => {
    // Simula una respuesta fallida de la API Mock
    const mockAxios = jest.spyOn(axios, 'post').mockRejectedValue(new Error('Payment failed'));

    const event = { userId: 'usuario-existente', amount: 200 };
    await expect(handler(event)).rejects.toThrow('Payment failed');

    // Verifica que se haya llamado a la API Mock con los parámetros correctos
    expect(mockAxios).toHaveBeenCalledWith(`${API_MOCK_URL}/process-payment`, {
      userId: 'usuario-existente',
      amount: 200,
    });
  });

  it('debería retornar una transacción exitosa', async () => {
    // Simula una respuesta exitosa de la API Mock
    const mockAxios = jest.spyOn(axios, 'post').mockResolvedValue({
      data: { status: 'success', transactionId: 'transaccion-123' },
    });

    const event = { userId: 'usuario-existente', amount: 300 };
    const result = await handler(event);

    expect(result).toEqual({
      status: 'SUCCESS',
      transactionId: 'transaccion-123',
    });

    // Verifica que se haya llamado a la API Mock con los parámetros correctos
    expect(mockAxios).toHaveBeenCalledWith(`${API_MOCK_URL}/process-payment`, {
      userId: 'usuario-existente',
      amount: 300,
    });
  });
});
