import { v4 as uuidv4 } from 'uuid';
import logger from './Logger';

export const generateId = (): string => {
  return uuidv4();
};

export { logger };
