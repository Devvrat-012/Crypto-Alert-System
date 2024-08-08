import axios from 'axios';

export const fetchCryptoPrice = async (currency: string): Promise<number> => {
  if (!currency || typeof currency !== 'string') {
    throw new Error('Currency parameter is required and must be a valid string.');
  }

  try {
    // Make the request to the CoinGecko API
    const response = await axios.get(`${process.env.COINGECKO_API_BASE}/simple/price`, {
      headers: {
        'x-cg-demo-api-key': process.env.COINGECKO_API_KEY,
        'accept': 'application/json',
      },
      params: {
        ids: currency,
        vs_currencies: 'usd',
      },
    });

    if (response.data && response.data[currency] && typeof response.data[currency].usd === 'number') {
      return response.data[currency].usd;
    } else {
      throw new Error(`Unexpected response structure or missing data for currency ${currency}.`);
    }
  } catch (error) {

    if (axios.isAxiosError(error)) {
      console.error(`Axios error fetching price for ${currency}:`, {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });

    } else {
      console.error(`General error fetching price for ${currency}:`, error);
    }
    throw new Error('Failed to fetch price from CoinGecko API.');
  }
};
