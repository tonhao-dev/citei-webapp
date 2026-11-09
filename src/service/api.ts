import axios, { AxiosInstance } from 'axios';

class Client {
  api: AxiosInstance;

  constructor() {
    const baseURL = import.meta.env.VITE_API_URL ?? 'http://localhost:3123';

    this.api = axios.create({
      baseURL: baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}

export default new Client().api;
