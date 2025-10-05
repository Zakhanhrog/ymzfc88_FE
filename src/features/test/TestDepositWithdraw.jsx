import { useState } from 'react';
import { Button, Card, message, Space, Input, Form, InputNumber, Select } from 'antd';
import walletService from '../wallet/services/walletService';

const { Option } = Select;

const TestDepositWithdraw = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [form] = Form.useForm();

  const loadPaymentMethods = async () => {
    try {
      setLoading(true);
      const response = await walletService.getPaymentMethods();
      console.log('Payment methods response:', response);
      
      if (response.success) {
        setPaymentMethods(response.data);
        setResult(`Loaded ${response.data.length} payment methods`);
        message.success('Đã tải phương thức thanh toán');
      } else {
        setResult('Error: ' + JSON.stringify(response));
        message.error('Lỗi tải phương thức thanh toán');
      }
    } catch (error) {
      setResult(`Error: ${error.message}`);
      message.error('Lỗi: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const testDeposit = async (values) => {
    try {
      setLoading(true);
      
      const depositData = {
        paymentMethodId: values.paymentMethodId,
        amount: values.amount,
        description: values.description || '',
        referenceCode: values.referenceCode || '',
        billImage: ''
      };
      
      console.log('Testing deposit with data:', depositData);
      
      const response = await walletService.createDepositOrder(depositData);
      console.log('Deposit response:', response);
      
      setResult(JSON.stringify(response, null, 2));
      
      if (response.success) {
        message.success('Tạo lệnh nạp tiền thành công!');
      } else {
        message.error('Lỗi: ' + (response.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Deposit test error:', error);
      setResult(`Error: ${error.message}\nStack: ${error.stack}`);
      message.error('Lỗi: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const testWithdraw = async (values) => {
    try {
      setLoading(true);
      
      const withdrawData = {
        paymentMethodId: values.paymentMethodId,
        amount: values.amount,
        accountNumber: values.accountNumber,
        accountName: values.accountName,
        bankCode: values.bankCode || '',
        description: values.description || ''
      };
      
      console.log('Testing withdraw with data:', withdrawData);
      
      const response = await walletService.createWithdrawOrder(withdrawData);
      console.log('Withdraw response:', response);
      
      setResult(JSON.stringify(response, null, 2));
      
      if (response.success) {
        message.success('Tạo lệnh rút tiền thành công!');
      } else {
        message.error('Lỗi: ' + (response.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Withdraw test error:', error);
      setResult(`Error: ${error.message}\nStack: ${error.stack}`);
      message.error('Lỗi: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Test Deposit & Withdraw Flow</h1>
      
      <div className="space-y-6">
        {/* Load Payment Methods */}
        <Card title="Load Payment Methods">
          <Button 
            type="primary" 
            onClick={loadPaymentMethods} 
            loading={loading}
          >
            Load Payment Methods
          </Button>
          {paymentMethods.length > 0 && (
            <div className="mt-4">
              <p>Available Payment Methods:</p>
              <ul>
                {paymentMethods.map(method => (
                  <li key={method.id}>
                    {method.id}: {method.name} ({method.type})
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Card>

        {/* Test Deposit */}
        <Card title="Test Deposit">
          <Form
            form={form}
            layout="vertical"
            onFinish={testDeposit}
          >
            <Form.Item 
              name="paymentMethodId" 
              label="Payment Method"
              rules={[{ required: true }]}
            >
              <Select placeholder="Select payment method">
                {paymentMethods.map(method => (
                  <Option key={method.id} value={method.id}>
                    {method.name} ({method.type})
                  </Option>
                ))}
              </Select>
            </Form.Item>
            
            <Form.Item 
              name="amount" 
              label="Amount"
              rules={[
                { required: true },
                { type: 'number', min: 10000, max: 100000000 }
              ]}
            >
              <InputNumber 
                style={{ width: '100%' }}
                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
              />
            </Form.Item>
            
            <Form.Item name="description" label="Description">
              <Input.TextArea rows={2} />
            </Form.Item>
            
            <Form.Item name="referenceCode" label="Reference Code">
              <Input />
            </Form.Item>
            
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading}
              disabled={paymentMethods.length === 0}
            >
              Test Deposit
            </Button>
          </Form>
        </Card>

        {/* Test Withdraw */}
        <Card title="Test Withdraw">
          <Form
            layout="vertical"
            onFinish={testWithdraw}
          >
            <Form.Item 
              name="paymentMethodId" 
              label="Payment Method"
              rules={[{ required: true }]}
            >
              <Select placeholder="Select payment method">
                {paymentMethods.map(method => (
                  <Option key={method.id} value={method.id}>
                    {method.name} ({method.type})
                  </Option>
                ))}
              </Select>
            </Form.Item>
            
            <Form.Item 
              name="amount" 
              label="Amount"
              rules={[
                { required: true },
                { type: 'number', min: 50000, max: 50000000 }
              ]}
            >
              <InputNumber 
                style={{ width: '100%' }}
                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
              />
            </Form.Item>
            
            <Form.Item 
              name="accountNumber" 
              label="Account Number"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
            
            <Form.Item 
              name="accountName" 
              label="Account Name"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
            
            <Form.Item name="bankCode" label="Bank Code">
              <Input />
            </Form.Item>
            
            <Form.Item name="description" label="Description">
              <Input.TextArea rows={2} />
            </Form.Item>
            
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading}
              disabled={paymentMethods.length === 0}
            >
              Test Withdraw
            </Button>
          </Form>
        </Card>

        {/* Results */}
        {result && (
          <Card title="Test Results">
            <pre className="bg-gray-100 p-4 rounded overflow-auto text-sm max-h-96">
              {result}
            </pre>
          </Card>
        )}
      </div>
    </div>
  );
};

export default TestDepositWithdraw;