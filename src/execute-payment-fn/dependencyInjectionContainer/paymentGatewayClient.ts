import axios, { AxiosInstance } from 'axios';

export interface HttpClient {
  post<T>(url: string, data: any): Promise<T>;
}

export class AxiosHttpClient implements HttpClient {
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create();
  }

  async post<T>(url: string, data: any): Promise<T> {
    const response = await this.axiosInstance.post<T>(url, data);
    return response.data;
  }
}
