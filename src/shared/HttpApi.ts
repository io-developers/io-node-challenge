import { Logger } from "./Logger";

export class HttpApi {
  private baseUrl: string;

  private headers: Record<string, string>;

  constructor(params: {
    baseUrl: string;
    headers: Record<string, string>;
  }) {
    this.baseUrl = params.baseUrl;
    this.headers = params.headers;
  }

  async get<T>(path: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      headers: this.headers,
    });

    return response.json() as T;
  }

  async post<T>(path: string, body: Record<string, unknown>): Promise<T> {
    const url = `${this.baseUrl}${path}`;

    Logger.info(`[HttpApi] POST ${url}`);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify(body),
      });

      if (response.status >= 400) {
        throw new Error('Request failed');
      }
    
      Logger.info(`[HttpApi] SUCCESS RESPONSE ${response.statusText} ${response.status}`);

      return response.json() as T;
    } catch (error) {
      const err = error as Error;

      Logger.error(`[HttpApi] ERROR RESPONSE - ${err.message}`);

      throw error;
    }
  }
}