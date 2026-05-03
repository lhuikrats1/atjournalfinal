import axios from "axios";

export class TradovateAPI {
  baseUrl: string;
  token: string | null;

  constructor(isDemo: boolean = true) {
    this.baseUrl = isDemo ? "https://demo.tradovateapi.com/v1" : "https://live.tradovateapi.com/v1";
    this.token = null;
  }

  setToken(token: string) {
    this.token = token;
  }

  getHeaders() {
    return {
      "Content-Type": "application/json",
      "Accept": "application/json",
      ...(this.token ? { "Authorization": `Bearer ${this.token}` } : {}),
    };
  }

  async authenticate(name: string, password: string, appId: string, appVersion: string, deviceId: string = "browser") {
    const response = await axios.post(
      `${this.baseUrl}/auth/accesstokenrequest`,
      {
        name,
        password,
        appId,
        appVersion,
        cid: 0,
        sec: "string", // Placeholder
        deviceId,
      },
      { headers: this.getHeaders() }
    );
    return response.data;
  }

  async getAccountList() {
    const response = await axios.get(`${this.baseUrl}/account/list`, {
      headers: this.getHeaders(),
    });
    return response.data;
  }

  async getFills() {
    const response = await axios.get(`${this.baseUrl}/fill/list`, {
      headers: this.getHeaders(),
    });
    return response.data;
  }

  async getOrders() {
    const response = await axios.get(`${this.baseUrl}/order/list`, {
      headers: this.getHeaders(),
    });
    return response.data;
  }

  async getContractItem(id: number) {
    const response = await axios.get(`${this.baseUrl}/contract/item?id=${id}`, {
      headers: this.getHeaders(),
    });
    return response.data;
  }
}
