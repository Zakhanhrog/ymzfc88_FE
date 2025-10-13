import { useState } from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { adminAuthService } from '../services/adminAuthService';

const AdminLoginForm = ({ onLogin }) => {
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    
    // Test thông báo trước
    message.info('Đang xử lý đăng nhập admin...');
    
    try {
      const result = await adminAuthService.login(values);
      if (result.success) {
        message.success('Đăng nhập admin thành công!');
        setTimeout(() => {
          onLogin && onLogin();
        }, 1000);
      }
    } catch (error) {
      message.error(error.message || 'Đăng nhập thất bại!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4">
      <Card 
        className="w-full max-w-md shadow-2xl"
        style={{ 
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px'
        }}
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-4">
            <UserOutlined className="text-2xl text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">ADMIN LOGIN</h1>
          <p className="text-gray-600">Đăng nhập vào hệ thống quản trị</p>
        </div>

        <Form
          name="admin-login"
          onFinish={onFinish}
          layout="vertical"
          autoComplete="off"
        >
          <Form.Item
            name="username"
            rules={[
              {
                required: true,
                message: 'Vui lòng nhập tên đăng nhập!'
              }
            ]}
          >
            <Input
              prefix={<UserOutlined className="text-gray-400" />}
              placeholder="Tên đăng nhập"
              size="large"
              className="rounded-lg"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: 'Vui lòng nhập mật khẩu!'
              }
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="text-gray-400" />}
              placeholder="Mật khẩu"
              size="large"
              className="rounded-lg"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              size="large"
              className="bg-gradient-to-r from-blue-600 to-purple-600 border-0 rounded-lg h-12 text-base font-semibold"
            >
              {loading ? 'Đang đăng nhập...' : 'ĐĂNG NHẬP'}
            </Button>
          </Form.Item>
        </Form>

        <div className="text-center text-sm text-gray-500 mt-4">
          <p>Demo: admin / admin123</p>
        </div>
      </Card>
    </div>
  );
};

export default AdminLoginForm;
