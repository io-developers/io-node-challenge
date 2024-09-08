import axios from 'axios';

export default abstract class BaseHttpClient {
  protected baseUrl: string = '';

  protected async post(path: string, params: object = {}) {
    const url: string = `${this.baseUrl}${path}`;
    const response = await axios.post(url, params).then(({ data }) => data);
    return response;
  }
}
