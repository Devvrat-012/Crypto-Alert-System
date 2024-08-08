# Crypto Alert System

## Overview

This is a real-time cryptocurrency price monitoring and alerting system built with Node.js, TypeScript, MongoDB, Redis, and React. This application allows users to monitor cryptocurrency prices, set alerts based on price changes, and receive notifications when their criteria are met. It also includes a basic frontend built with React and styled using Tailwind CSS.

## Features

- **Real-Time Price Monitoring**: Continuously fetches and updates cryptocurrency prices.
- **Alerting System**: Users can set alerts based on price changes and receive notifications.
- **Caching Mechanism**: Uses Redis to cache recent price updates for efficiency.
- **Real-Time Communication**: Utilizes Socket.IO for real-time alerts.
- **Frontend Interface**: A React-based UI for interacting with the system.


## Backend Setup

### Installation

1. Navigate to the `backend` directory:
   ```bash
   cd backend
2. Install the dependencies:
   ```bash
   npm install
3. Set environment variable:
   ```bash
   MONGO_URI
   PORT
   REDIS_URI
   REDIS_PASS
   COINGECKO_API_BASE
   COINGECKO_API_KEY
   JWT_SECRET
4. Run the backend:
   ```bash
   npm run dev

## Frontend Setup

### Installation
1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
2. Install the dependencies:
   ```bash
   npm install
3. Set environment variable:
   ```bash
   VITE_API_URL
   VITE_SOCKET_URL
4. Run the frontend:
   ```bash
   npm run dev
