import { useEffect, useMemo, useState } from 'react';
import {
  Card,
  Row,
  Col,
  Statistic,
  Button,
  Space,
  Table,
  Tag,
  message,
  Tooltip,
  Input,
  Divider
} from 'antd';
import {
  QrcodeOutlined,
  LinkOutlined,
  CopyOutlined,
  ReloadOutlined,
  UserAddOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { adminService } from '../services/adminService';
import TabPageHeader from './TabPageHeader';

const AgentInviteCodes = () => {
  const [loading, setLoading] = useState(false);
  const [inviteInfo, setInviteInfo] = useState(null);
  const [customLanding, setCustomLanding] = useState('');

  const inviteLink = useMemo(() => {
    if (!inviteInfo?.referralCode) return '';
    const baseUrl = 'https://tathiet168.com';
    const landingInput = (customLanding || '').trim();

    let url;
    try {
      if (landingInput.startsWith('http://') || landingInput.startsWith('https://')) {
        const landingUrl = new URL(landingInput);
        const normalizedPath = landingUrl.pathname || '/';
        url = new URL(normalizedPath, baseUrl);
        if (landingUrl.search) {
          const searchParams = new URLSearchParams(landingUrl.search);
          searchParams.forEach((value, key) => {
            url.searchParams.set(key, value);
          });
        }
      } else {
        const normalizedPath = landingInput ? `/${landingInput.replace(/^\/+/, '')}` : '/';
        url = new URL(normalizedPath, baseUrl);
      }
    } catch (error) {
      url = new URL('/', baseUrl);
    }

    url.searchParams.set('inviteCode', inviteInfo.referralCode);
    url.searchParams.set('register', '1');
    return url.toString();
  }, [inviteInfo?.referralCode, customLanding]);

  const loadInviteInfo = async () => {
    try {
      setLoading(true);
      const response = await adminService.getAgentInviteInfo();
      if (response?.success) {
        setInviteInfo(response.data);
      } else {
        message.error(response?.message || 'Không thể tải thông tin mã mời');
      }
    } catch (error) {
      message.error(error.message || 'Không thể tải thông tin mã mời');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInviteInfo();
  }, []);

  const handleCopy = async (value, successMessage) => {
    try {
      await navigator.clipboard.writeText(value);
      message.success(successMessage);
    } catch (error) {
      message.error('Sao chép thất bại, vui lòng thử lại');
    }
  };

  const referrals = inviteInfo?.recentReferrals || [];

  const columns = [
    {
      title: 'Tài khoản',
      dataIndex: 'username',
      key: 'username',
      render: (value) => (
        <Space>
          <UserAddOutlined className="text-blue-400" />
          <span className="font-medium">{value}</span>
        </Space>
      )
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'ACTIVE' ? 'green' : status === 'BANNED' ? 'red' : 'default'}>
          {status}
        </Tag>
      )
    },
    {
      title: 'Ngày đăng ký',
      dataIndex: 'joinedAt',
      key: 'joinedAt',
      render: (value) =>
        value ? dayjs(value).format('DD/MM/YYYY HH:mm') : '-',
      sorter: (a, b) =>
        dayjs(a.joinedAt).valueOf() - dayjs(b.joinedAt).valueOf(),
      defaultSortOrder: 'descend'
    }
  ];

  return (
    <div className="space-y-6">
      <TabPageHeader
        title="Quản lý mã mời"
        description="Chia sẻ mã mời để thu hút người chơi mới và nhận hoa hồng"
      />

      <Row gutter={[16, 16]}>
        <Col xs={24} md={12} lg={8}>
          <Card loading={loading} className="h-full">
            <Statistic
              title="Mã mời chính"
              value={inviteInfo?.referralCode || '---'}
              prefix={<QrcodeOutlined className="text-blue-500" />}
            />
            <Space className="mt-4">
              <Button
                icon={<CopyOutlined />}
                onClick={() =>
                  inviteInfo?.referralCode &&
                  handleCopy(inviteInfo.referralCode, 'Đã sao chép mã mời')
                }
                disabled={!inviteInfo?.referralCode}
              >
                Sao chép mã
              </Button>
            </Space>
          </Card>
        </Col>
        <Col xs={24} md={12} lg={8}>
          <Card loading={loading} className="h-full">
            <Statistic
              title="Lượt đăng ký qua mã mời"
              value={inviteInfo?.totalReferrals || 0}
              suffix="người"
            />
            <Statistic
              title="Đang hoạt động"
              value={inviteInfo?.activeReferrals || 0}
              suffix="người"
            />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card loading={loading} className="h-full space-y-4">
            <div>
              <div className="text-sm font-medium text-gray-500 mb-1">
                Tùy chỉnh trang đích (tùy chọn)
              </div>
              <Input
                placeholder="Ví dụ: /landing-agent"
                value={customLanding}
                onChange={(e) => setCustomLanding(e.target.value)}
                addonBefore={window?.origin || 'https://your-domain'}
              />
            </div>
            <Tooltip title="Đường dẫn sẽ tự động thêm mã mời của bạn">
              <Statistic
                title="Link giới thiệu"
                valueStyle={{ fontSize: 14 }}
                value={inviteLink || '---'}
                prefix={<LinkOutlined className="text-indigo-500" />}
              />
            </Tooltip>
            <Space>
              <Button
                type="primary"
                icon={<CopyOutlined />}
                onClick={() =>
                  inviteLink && handleCopy(inviteLink, 'Đã sao chép link giới thiệu')
                }
                disabled={!inviteLink}
              >
                Sao chép link
              </Button>
              <Button
                icon={<ReloadOutlined />}
                onClick={loadInviteInfo}
                loading={loading}
              >
                Làm mới
              </Button>
            </Space>

          </Card>
        </Col>
      </Row>

      <Card
        loading={loading}
        title={
          <Space>
            <UserAddOutlined />
            <span>Danh sách người đăng ký gần đây</span>
          </Space>
        }
        extra={
          <Tooltip title="Tải lại danh sách mới nhất">
            <Button icon={<ReloadOutlined />} onClick={loadInviteInfo} />
          </Tooltip>
        }
      >
        <Divider orientation="left" plain>
          {`Tổng ${inviteInfo?.totalReferrals || 0} người đăng ký qua mã mời`}
        </Divider>
        <Table
          columns={columns}
          dataSource={referrals}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          locale={{
            emptyText: 'Chưa có người chơi nào đăng ký qua mã mời'
          }}
        />
      </Card>
    </div>
  );
};

export default AgentInviteCodes;

