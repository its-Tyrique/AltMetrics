-- Clean up and create
DROP TABLE IF EXISTS crypto_snapshots;

CREATE TABLE crypto_snapshots (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    Coin VARCHAR(50),
    Price_usd DECIMAL(18, 8),
    Market_cap_usd BIGINT,
    Timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);