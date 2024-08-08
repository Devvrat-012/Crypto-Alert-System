import React from "react";
import PriceList from "../components/PriceList";

const HomePage: React.FC = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Welcome to CryptoMonitor</h1>
      <PriceList />
    </div>
  );
};

export default HomePage;
