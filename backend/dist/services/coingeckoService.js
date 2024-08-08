var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import axios from 'axios';
export const fetchCryptoPrice = (currency) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    if (!currency || typeof currency !== 'string') {
        throw new Error('Currency parameter is required and must be a valid string.');
    }
    try {
        // Make the request to the CoinGecko API
        const response = yield axios.get(`${process.env.COINGECKO_API_BASE}/simple/price`, {
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
        }
        else {
            throw new Error(`Unexpected response structure or missing data for currency ${currency}.`);
        }
    }
    catch (error) {
        if (axios.isAxiosError(error)) {
            console.error(`Axios error fetching price for ${currency}:`, {
                message: error.message,
                status: (_a = error.response) === null || _a === void 0 ? void 0 : _a.status,
                data: (_b = error.response) === null || _b === void 0 ? void 0 : _b.data,
            });
        }
        else {
            console.error(`General error fetching price for ${currency}:`, error);
        }
        throw new Error('Failed to fetch price from CoinGecko API.');
    }
});
