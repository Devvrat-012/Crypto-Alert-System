import React from "react";
import AlertForm from "../components/AlertForm";

const AlertsPage: React.FC = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Set Price Alerts</h1>
      <AlertForm />
    </div>
  );
};

export default AlertsPage;
