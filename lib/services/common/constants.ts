import { config } from 'dotenv';

config();

export const ACCOUNTS_TABLE = process.env.ACCOUNTS_TABLE || '';
export const TRANSACTIONS_TABLE = process.env.TRANSACTIONS_TABLE || '';
export const MP_PUBLIC_KEY = process.env.MP_PUBLIC_KEY || '';
export const MP_ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN || '';
export const PAYER_ID = process.env.PAYER_ID || '';
export const PAYER_EMAIL = process.env.PAYER_EMAIL || '';
