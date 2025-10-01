import { Form, Input, Button, Card, App } from 'antd';
import { UserOutlined, LockOutlined, HomeOutlined, CustomerServiceOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';

const LoginForm = ({ onClose, onSwitchToRegister }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { message } = App.useApp();

  const onFinish = async (values) => {
    setLoading(true);
    
    // Test thông báo trước
    message.info('Đang xử lý đăng nhập...');
    
    try {
      const response = await authService.login(values);
      
      // Lưu token, refreshToken và user info
      localStorage.setItem('token', response.token);
      localStorage.setItem('refreshToken', response.refreshToken);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      message.success('Đăng nhập thành công!');
      
      // Đóng modal và reload để cập nhật UI
      setTimeout(() => {
        onClose && onClose();
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error('Login error:', error);
      message.error(error.message || 'Đăng nhập thất bại!');
    } finally {
      setLoading(false);
    }
  };

  const onFinishFailed = (errorInfo) => {
    // Hiển thị thông báo lỗi đầu tiên thay vì hiển thị inline
    const firstError = errorInfo.errorFields[0];
    if (firstError && firstError.errors[0]) {
      message.error(firstError.errors[0]);
    }
  };

  const handleSwitchToRegister = () => {
    onSwitchToRegister && onSwitchToRegister();
  };

  return (
    <div className="flex h-[700px]" onClick={(e) => e.stopPropagation()}>
      {/* Left Side - Image */}
      <div className="w-1/2 relative overflow-hidden">
        <div 
          className="w-full h-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://th2club.net/images/1717680076846848.png.avif')`
          }}
        >
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-1/2 p-8 bg-white flex items-start pt-12 relative">
        <div className="w-full">
          <div className="text-center mb-8">
            <div className="text-3xl font-bold text-blue-600 mb-2">TH2</div>
            <h2 className="text-2xl font-bold text-gray-800">ĐĂNG NHẬP</h2>
          </div>

          <Form
            name="login"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            layout="vertical"
            size="large"
            className="space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <Form.Item
              name="usernameOrEmail"
              rules={[
                { required: true, message: 'Vui lòng nhập tên đăng nhập hoặc email!' }
              ]}
              className="mb-4"
              validateStatus=""
              help=""
            >
              <Input 
                prefix={<UserOutlined className="text-blue-400" />} 
                placeholder="Tên đăng nhập hoặc email"
                className="rounded-2xl border-gray-200 placeholder:text-gray-400 w-full h-12"
                style={{ 
                  borderRadius: '16px',
                  border: '1px solid #e5e7eb'
                }}
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                { required: true, message: 'Vui lòng nhập mật khẩu!' },
                { min: 6, message: 'Mật khẩu tối thiểu 6 ký tự!' }
              ]}
              className="mb-6"
              validateStatus=""
              help=""
            >
              <Input.Password 
                prefix={<LockOutlined className="text-blue-400" />} 
                placeholder="Mật khẩu"
                className="rounded-2xl border-gray-200 placeholder:text-gray-400 w-full h-12"
                style={{ 
                  borderRadius: '16px',
                  border: '1px solid #e5e7eb'
                }}
              />
            </Form.Item>

            <div className="flex justify-between items-center my-6">
              <Button 
                type="link" 
                className="text-blue-500 p-0"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSwitchToRegister();
                }}
              >
                Đăng ký
              </Button>
              <Button 
                type="link" 
                className="text-blue-500 p-0"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                Quên mật khẩu
              </Button>
            </div>

            <Form.Item className="mb-6">
              <Button 
                type="primary" 
                htmlType="submit" 
                className="w-full bg-blue-500 hover:bg-blue-600 font-semibold h-12"
                style={{
                  borderRadius: '16px',
                  border: 'none'
                }}
                loading={loading}
              >
                ĐĂNG NHẬP
              </Button>
            </Form.Item>
          </Form>
        </div>

        {/* Bottom Navigation */}
        <div className="absolute bottom-8 left-0 right-0 flex justify-between px-8">
          <Button 
            type="text" 
            icon={<HomeOutlined />}
            onClick={(e) => {
              e.stopPropagation();
              onClose && onClose();
              navigate('/');
            }}
            className="text-blue-500 flex items-center gap-2 font-medium"
          >
            TRANG CHỦ
          </Button>
          <Button 
            type="text"
            icon={<CustomerServiceOutlined />}
            onClick={(e) => {
              e.stopPropagation();
            }}
            className="text-blue-500 flex items-center gap-2 font-medium"
          >
            CSKH
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
