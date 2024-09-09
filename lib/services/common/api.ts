import axios, { AxiosRequestConfig } from 'axios';

import { MP_ACCESS_TOKEN, MP_PUBLIC_KEY } from './constants';

const config: AxiosRequestConfig = {
  baseURL: `https://api.mercadopago.com`,
};

export const get = async (endpoint: string, params?: URLSearchParams) => {
  try {
    config.params = params;
    const result = await axios.get(endpoint, config);
    const resultData: any = result.data;
    return resultData;
  } catch (error: any) {
    console.error('get.error:', error);
    throw error;
  }
};

export const post = async (endpoint: string, data: any) => {
  try {
    config.params = {};

    if (endpoint === '/v1/card_tokens') {
      config.params.public_key = MP_PUBLIC_KEY;
    } else if (endpoint === '/v1/payments') {
      config.params.access_token = MP_ACCESS_TOKEN;
    }
    const result = await axios.post(endpoint, data, config);
    const resultData: any = result.data;
    return resultData;
  } catch (error: any) {
    console.error('post.error:', error);
    throw error;
  }
};
