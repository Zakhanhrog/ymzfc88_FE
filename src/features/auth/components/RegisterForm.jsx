import { Form, Input, Button, Card, App, Checkbox } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined, HomeOutlined, CustomerServiceOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { THEME_COLORS, getInputIconStyle, getFormButtonStyle, getButtonStyle } from '../../../utils/theme';

const RegisterForm = ({ onClose, onSwitchToLogin }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { message } = App.useApp();

  const onFinish = async (values) => {
    setLoading(true);
    
    // Test thông báo trước
    message.info('Đang xử lý đăng ký...');
    
    try {
      const { confirmPassword, ...userData } = values;
      await authService.register(userData);
      
      message.success('Đăng ký thành công! Vui lòng đăng nhập.');
      
      // Chuyển sang form đăng nhập thay vì tự động đăng nhập
      setTimeout(() => {
        handleSwitchToLogin();
      }, 1500);
    } catch (error) {
      console.error('Register error:', error);
      message.error(error.message || 'Đăng ký thất bại!');
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

  const handleSwitchToLogin = () => {
    onSwitchToLogin && onSwitchToLogin();
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

      {/* Right Side - Register Form */}
      <div className="w-1/2 p-8 bg-white flex items-start pt-8 relative">
        <div className="w-full">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">ĐĂNG KÝ</h2>
          </div>

          <Form
            name="register"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            layout="vertical"
            size="large"
            className="space-y-3"
            onClick={(e) => e.stopPropagation()}
          >
            <Form.Item
              name="name"
              rules={[
                { required: true, message: 'Vui lòng nhập họ tên!' },
                { min: 2, message: 'Họ tên tối thiểu 2 ký tự!' }
              ]}
              className="mb-4"
              validateStatus=""
              help=""
            >
              <Input 
                prefix={<UserOutlined style={getInputIconStyle()} />} 
                placeholder="Họ và tên"
                className="rounded-2xl border-gray-200 placeholder:text-gray-400 w-full h-12"
                style={{ 
                  borderRadius: '12px',
                  border: '1px solid #e5e7eb'
                }}
              />
            </Form.Item>

            <Form.Item
              name="email"
              rules={[
                { required: true, message: 'Vui lòng nhập email!' },
                { type: 'email', message: 'Email không hợp lệ!' }
              ]}
              className="mb-4"
              validateStatus=""
              help=""
            >
              <Input 
                prefix={<MailOutlined style={getInputIconStyle()} />} 
                placeholder="Email"
                className="rounded-2xl border-gray-200 placeholder:text-gray-400 w-full h-12"
                style={{ 
                  borderRadius: '12px',
                  border: '1px solid #e5e7eb'
                }}
              />
            </Form.Item>

            <Form.Item
              name="phone"
              rules={[
                { required: true, message: 'Vui lòng nhập số điện thoại!' },
                { pattern: /^[0-9]{10,11}$/, message: 'Số điện thoại không hợp lệ!' }
              ]}
              className="mb-4"
              validateStatus=""
              help=""
            >
              <Input 
                prefix={<PhoneOutlined style={getInputIconStyle()} />} 
                placeholder="Số điện thoại"
                className="rounded-2xl border-gray-200 placeholder:text-gray-400 w-full h-12"
                style={{ 
                  borderRadius: '12px',
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
              className="mb-4"
              validateStatus=""
              help=""
            >
              <Input.Password 
                prefix={<LockOutlined style={getInputIconStyle()} />} 
                placeholder="Mật khẩu"
                className="rounded-2xl border-gray-200 placeholder:text-gray-400 w-full h-12"
                style={{ 
                  borderRadius: '12px',
                  border: '1px solid #e5e7eb'
                }}
              />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              dependencies={['password']}
              rules={[
                { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Mật khẩu không khớp!'));
                  },
                }),
              ]}
              className="mb-4"
              validateStatus=""
              help=""
            >
              <Input.Password 
                prefix={<LockOutlined style={getInputIconStyle()} />} 
                placeholder="Xác nhận mật khẩu"
                className="rounded-2xl border-gray-200 placeholder:text-gray-400 w-full h-12"
                style={{ 
                  borderRadius: '12px',
                  border: '1px solid #e5e7eb'
                }}
              />
            </Form.Item>

            <Form.Item
              name="agreement"
              valuePropName="checked"
              rules={[
                { 
                  validator: (_, value) =>
                    value ? Promise.resolve() : Promise.reject(new Error('Vui lòng đồng ý với điều khoản!')),
                },
              ]}
              className="mb-4"
              validateStatus=""
              help=""
            >
              <div onClick={(e) => e.stopPropagation()}>
                <Checkbox className="text-sm">
                  Tôi đồng ý với{' '}
                  <a 
                    href="#" 
                    style={{ color: '#D30102' }}
                    className="hover:underline"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                  >
                    Điều khoản sử dụng
                  </a>
                </Checkbox>
              </div>
            </Form.Item>

            <div className="flex justify-center mb-4">
              <Button 
                type="link" 
                className="p-0"
                style={getButtonStyle('link')}
                onClick={(e) => {
                  e.stopPropagation();
                  handleSwitchToLogin();
                }}
              >
                Đã có tài khoản?
              </Button>
            </div>

            <Form.Item className="mb-6">
              <Button 
                type="primary" 
                htmlType="submit" 
                className="w-full font-semibold h-12"
                style={{
                  ...getFormButtonStyle().base,
                  borderRadius: '12px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = getFormButtonStyle().hover.backgroundColor;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = getFormButtonStyle().base.backgroundColor;
                }}
                loading={loading}
              >
                ĐĂNG KÝ
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
            className="flex items-center gap-2 font-medium"
            style={getButtonStyle('link')}
          >
            TRANG CHỦ
          </Button>
          <Button 
            type="text"
            icon={<CustomerServiceOutlined />}
            onClick={(e) => {
              e.stopPropagation();
            }}
            className="flex items-center gap-2 font-medium"
            style={getButtonStyle('link')}
          >
            CSKH
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
