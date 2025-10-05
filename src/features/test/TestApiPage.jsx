import { useState } from 'react';
import { Button, Card, message, Space, Input } from 'antd';
import walletService from '../features/wallet/services/walletService';

const TestApiPage = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || '');

  const testWalletBalance = async () => {
    try {
      setLoading(true);
      const response = await walletService.getWalletBalance();
      setResult(JSON.stringify(response, null, 2));
      message.success('API call successful');
    } catch (error) {
      setResult(`Error: ${error.message}`);
      message.error('API call failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const testPaymentMethods = async () => {
    try {
      setLoading(true);
      const response = await walletService.getPaymentMethods();
      setResult(JSON.stringify(response, null, 2));
      message.success('API call successful');
    } catch (error) {
      setResult(`Error: ${error.message}`);
      message.error('API call failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTokenChange = (e) => {
    const newToken = e.target.value;
    setToken(newToken);
    localStorage.setItem('token', newToken);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">API Test Page</h1>
      
      <Card title="Authentication Token" className="mb-6">
        <Space direction="vertical" style={{ width: '100%' }}>
          <Input.TextArea
            rows={2}
            value={token}
            onChange={handleTokenChange}
            placeholder="Enter your JWT token here..."
          />
          <small className="text-gray-500">
            Token will be stored in localStorage and used for API calls
          </small>
        </Space>
      </Card>

      <Card title="API Tests" className="mb-6">
        <Space wrap>
          <Button 
            type="primary" 
            onClick={testWalletBalance} 
            loading={loading}
          >
            Test Wallet Balance
          </Button>
          <Button 
            onClick={testPaymentMethods} 
            loading={loading}
          >
            Test Payment Methods
          </Button>
        </Space>
      </Card>

      {result && (
        <Card title="API Response">
          <pre className="bg-gray-100 p-4 rounded overflow-auto text-sm">
            {result}
          </pre>
        </Card>
      )}
    </div>
  );
};

export default TestApiPage;