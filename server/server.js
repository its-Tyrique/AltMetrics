import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env from parent-directory
dotenv.config({ path: join(__dirname, '../local.env') });

import axios from 'axios';
import { createClient } from 'redis';
import express from 'express';
import mysql from 'mysql2';
import cors from 'cors';

// Redis client configuration
const redis = createClient({
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379
});

const corsOptions = {
    origin: "http://localhost:5173",
}

// Connect to Redis
redis.on('error', (err) => console.log('Redis Client Error', err));
await redis.connect();
console.log('Connected to Redis');

const app = express();
app.use(cors(corsOptions));

// MySQL/MariaDB connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// Test database connection
db.connect((error) => {
    if (error) {
        console.error('Database connection failed:', error);
        return;
    }
    console.log('Connected to MariaDB');
});

app.get("/api/testApi", (request, response) => {
    response.json({
        data: [
            {
                title: "Sample Title",
                author: "Author Name",
                year: 2024,
                journal: "Journal Name"
            },
            {
                title: "Another Title",
                author: "Second Author",
                year: 2023,
                journal: "Another Journal"
            }
        ]
    });
});

app.get("/api/crypto", async (request, response) => {
    try {
        // Check Redis cache first
        const cachedData = await redis.get('crypto_data');

        if (cachedData) {
            console.log('Serving from Redis cache');
            return response.json({
                data: JSON.parse(cachedData),
                source: 'cache'
            });
        }

        console.log('Cache miss: Fetching fresh data from external API');

        // If cache is stale/missing, fetch fresh data from external API
        const cryptoResponse = await axios.get('https://api.coingecko.com/api/v3/simple/price', {
            params: {
                ids: 'bitcoin,ethereum,dogecoin,solana,cardano',
                vs_currencies: 'usd',
                include_market_cap: true,
            },
        });

        const cryptoData = cryptoResponse.data;
        const snapshots = [];

        // Create snapshots for each coin
        Object.entries(cryptoData).forEach(([coin, data]) => {
            const snapshot = {
                coin: coin,
                price_usd: data.usd,
                market_cap_usd: data.usd_market_cap,
                timestamp: new Date().toISOString()
            };
            snapshots.push(snapshot);
        });

        // Store fresh data in Redis cache with a TTL of 60 seconds
        await redis.setEx('crypto_data', 60, JSON.stringify(snapshots));
        console.log('Cache updated with fresh data (60s TTL)');

        // Persist new data into MariaDB (historical record/snapshot log)
        Object.entries(cryptoData).forEach(([coin, data]) => {
            const sql = "INSERT INTO crypto_snapshots (coin, price_usd, market_cap_usd) VALUES (?, ?, ?)";
            db.query(sql, [coin, data.usd, data.usd_market_cap], (error) => {
                if (error) {
                    console.error(`Error persisting ${coin} data to database:`, error);
                } else {
                    console.log(`${coin} data persisted to database`);
                }
            });
        });

        // Return fresh data
        response.json({
            data: snapshots,
            source: 'fresh_api'
        });

    } catch (error) {
        console.error('Error in /api/crypto:', error);
        response.status(500).json({ error: 'Internal server error' });
    }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});