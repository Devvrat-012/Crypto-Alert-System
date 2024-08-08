import React, { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io(import.meta.env.VITE_SOCKET_URL);

const GetAlert: React.FC = () => {
  const [alert, setAlert] = useState<any>(null);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to WebSocket server");
    });

    socket.on("connect_error", (err) => {
      console.error("Connection Error:", err);
    });

    socket.on("priceAlert", (newAlert) => {
      setAlert(newAlert);
    });

    return () => {
      socket.off("priceAlert");
      socket.off("connect");
      socket.off("connect_error");
    };
  }, []);

  return (
    <div className="fixed bottom-0 right-0 p-4 space-y-2">
      {alert && (
        <div className="bg-red-600 text-white p-3 rounded shadow-lg">
          <p className="font-bold">{alert.currency.toUpperCase()} Alert!</p>
          <p>
            Current Price: ${alert.currentPrice.toFixed(2)} is {alert.direction}{" "}
            the target of ${alert.targetPrice.toFixed(2)}
          </p>
        </div>
      )}
    </div>
  );
};

export default GetAlert;
