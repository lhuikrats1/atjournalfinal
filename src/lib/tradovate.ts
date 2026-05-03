import axios from "axios";

const TRADOVATE_URLS = {
  LIVE: "https://live.tradovateapi.com/v1",
  DEMO: "https://demo.tradovateapi.com/v1",
};

interface TradovateAuthResponse {
  accessToken: string;
  expirationTime: string;
  userId: number;
}

export class TradovateService {
  private baseUrl: string;

  constructor(isDemo: boolean = true) {
    this.baseUrl = isDemo ? TRADOVATE_URLS.DEMO : TRADOVATE_URLS.LIVE;
  }

  async getAccessToken(credentials: {
    username: string;
    password: string;
    appId: string;
    appSecret: string;
  }): Promise<TradovateAuthResponse> {
    try {
      const response = await axios.post(`${this.baseUrl}/auth/accesstokenrequest`, {
        name: credentials.username,
        password: credentials.password,
        appId: credentials.appId,
        appSecret: credentials.appSecret,
      });

      return response.data;
    } catch (error: any) {
      console.error("Tradovate Auth Error:", error.response?.data || error.message);
      throw new Error("Failed to authenticate with Tradovate");
    }
  }

  async getFills(token: string, accountId: number) {
    try {
      const response = await axios.get(`${this.baseUrl}/fill/list`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          accountIds: [accountId],
        },
      });

      return response.data;
    } catch (error: any) {
      console.error("Tradovate Fill Error:", error.response?.data || error.message);
      throw new Error("Failed to fetch fills from Tradovate");
    }
  }

  async getAccounts(token: string) {
    try {
      const response = await axios.get(`${this.baseUrl}/account/list`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error: any) {
      console.error("Tradovate Account Error:", error.response?.data || error.message);
      throw new Error("Failed to fetch accounts from Tradovate");
    }
  }
  async syncAllTrades(credentials: {
    username: string;
    password: string;
    appId: string;
    appSecret: string;
  }) {
    // 1. Authenticate
    const auth = await this.getAccessToken(credentials);
    
    // 2. Get Accounts
    const accounts = await this.getAccounts(auth.accessToken);
    
    // 3. Fetch Fills for all accounts
    const allFills = [];
    for (const acc of accounts) {
      const fills = await this.getFills(auth.accessToken, acc.id);
      allFills.push(...fills);
    }

    return allFills;
  }
}
