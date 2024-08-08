import React, { useEffect, useState } from "react";
import axios from "axios";

interface Price {
  currency: string;
  price: number;
}

const PriceList: React.FC = () => {
  const [prices, setPrices] = useState<Price[]>([]);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const currencies = ["bitcoin", "ethereum", "litecoin"];
        const promises = currencies.map((currency) =>
          axios.get(`${import.meta.env.VITE_API_URL}/prices/${currency}`)
        );
        const responses = await Promise.all(promises);
        const pricesData = responses.map((res) => ({
          currency: res.data.currency,
          price: res.data.price,
        }));
        setPrices(pricesData);
      } catch (error) {
        console.error("Failed to fetch prices:", error);
      }
    };

    fetchPrices();
  }, []);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">
        Current Cryptocurrency Prices
      </h2>
      <ul>
        {prices.map((price) => (
          <li key={price.currency} className="mb-2">
            {price.currency.toUpperCase()}: ${price.price.toFixed(2)}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PriceList;
