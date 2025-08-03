import { useEffect, useState } from 'react';
import { Container, Table, Spinner, Alert, Badge } from 'react-bootstrap';
import { fetchCryptoData, type ApiResponse } from './services/coingecko.service';

function App() {
  const [apiData, setApiData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const result = await fetchCryptoData();
        setApiData(result);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch crypto data');
      } finally {
        setLoading(false);
      }
    };

    loadData();

    // Auto-refresh every 30 seconds
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
      <Container className="py-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>📊 Real-Time Crypto Prices</h2>
          {apiData && (
              <Badge bg={apiData.source === 'cache' ? 'info' : 'success'}>
                {apiData.source === 'cache' ? '⚡ Cached Data' : '🔄 Fresh Data'}
              </Badge>
          )}
        </div>

        {loading && <Spinner animation="border" />}
        {error && <Alert variant="danger">{error}</Alert>}

        {apiData && (
            <>
              <Table striped bordered hover responsive>
                <thead>
                <tr>
                  <th>Coin</th>
                  <th>Price (USD)</th>
                  <th>Market Cap (USD)</th>
                  <th>Last Updated</th>
                </tr>
                </thead>
                <tbody>
                {apiData.data.map((snapshot) => (
                    <tr key={snapshot.coin}>
                      <td>{snapshot.coin.toUpperCase()}</td>
                      <td>${snapshot.price_usd.toLocaleString()}</td>
                      <td>${snapshot.market_cap_usd.toLocaleString()}</td>
                      <td>{new Date(snapshot.timestamp).toLocaleTimeString()}</td>
                    </tr>
                ))}
                </tbody>
              </Table>
              <small className="text-muted">
                Data refreshes automatically every 30 seconds
              </small>
            </>
        )}
      </Container>
  );
}

export default App;