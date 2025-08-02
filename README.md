# AltMetrics

AltMetrics is a lightweight crypto data dashboard that displays up-to-date cryptocurrency market data. It uses a React frontend, a Node.js backend, Redis caching, and a MySQL-compatible database (MariaDB or MySQL).

## ✨ Features

- View real-time data for top cryptocurrencies
- Data fetched from CoinGecko or CoinMarketCap APIs
- Redis caching layer to avoid unnecessary API calls
- MySQL/MariaDB database for storing metadata or user data
- Optimized for performance with a simple user interface

## 🧱 Tech Stack

- **Frontend:** React.js (with Axios for HTTP)
- **Backend:** Node.js (Express)
- **External API:** CoinGecko / CoinMarketCap
- **Cache:** Redis (60-second cache TTL)
- **Database:** MariaDB / MySQL

## 📦 Installation

### Prerequisites

- Node.js v18+
- Redis
- MySQL or MariaDB
- npm or yarn

---

### 1. Clone the repo

```bash
git clone https://github.com/your-username/altmetrics.git
cd altmetrics
