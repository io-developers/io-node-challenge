import { AppError } from '../../infrastructure/errors/AppError';

export const successResponse = (statusCode: number, data: object) => ({
  statusCode,
  body: JSON.stringify(data),
});

export const errorResponse = (statusCode: number, message: string) => {
  throw new AppError(message, statusCode);
};
