import React, { useState, useEffect } from 'react';
import { Card, Statistic, Row, Col, Table, Tag, Empty, Spin, message } from 'antd';
import { TrophyOutlined, StarOutlined, ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { HEADING_STYLES, BODY_STYLES, FONT_SIZE, FONT_WEIGHT, TEXT_COLORS } from '../../../utils/typography';
import { THEME_COLORS } from '../../../utils/theme';
import pointService from '../../../services/pointService';
import moment from 'moment';

const UserPointsPage = () => {
  const [pointData, setPointData] = useState(null);
  const [pointHistory, setPointHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });

  useEffect(() => {
    loadUserPoints();
    loadPointHistory();
  }, []);

  const loadUserPoints = async () => {
    try {
      setLoading(true);
      const response = await pointService.getMyPoints();
      if (response.success) {
        setPointData(response.data);
      } else {
        message.error('Không thể tải thông tin điểm thưởng');
      }
    } catch (error) {
      message.error('Lỗi khi tải thông tin điểm: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const loadPointHistory = async (page = 0) => {
    try {
      setHistoryLoading(true);
      const response = await pointService.getMyPointHistory(page, pagination.pageSize);
      if (response.success) {
        setPointHistory(response.data?.content || []);
        setPagination(prev => ({
          ...prev,
          current: page + 1,
          total: response.data?.totalElements || 0
        }));
      } else {
        message.error('Không thể tải lịch sử điểm thưởng');
      }
    } catch (error) {
      message.error('Lỗi khi tải lịch sử điểm: ' + error.message);
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleTableChange = (paginationData) => {
    const page = paginationData.current - 1;
    loadPointHistory(page);
  };

  const formatPoints = (points) => {
    return new Intl.NumberFormat('vi-VN').format(Math.abs(points || 0));
  };

  const getTransactionTypeColor = (type) => {
    switch (type) {
      case 'EARN':
      case 'DEPOSIT_BONUS':
      case 'ADMIN_ADD':
        return 'green';
      case 'SPEND':
      case 'ADMIN_SUBTRACT':
        return 'red';
      case 'REFUND':
        return 'blue';
      default:
        return 'default';
    }
  };

  const getTransactionIcon = (type) => {
    switch (type) {
      case 'EARN':
      case 'DEPOSIT_BONUS':
      case 'ADMIN_ADD':
        return <ArrowUpOutlined />;
      case 'SPEND':
      case 'ADMIN_SUBTRACT':
        return <ArrowDownOutlined />;
      default:
        return null;
    }
  };

  const columns = [
    {
      title: <span style={{ ...HEADING_STYLES.h6 }}>Mã giao dịch</span>,
      dataIndex: 'transactionCode',
      key: 'transactionCode',
      width: 150,
      render: (text) => <span style={{ fontSize: FONT_SIZE.sm, fontWeight: FONT_WEIGHT.medium }}>{text}</span>
    },
    {
      title: <span style={{ ...HEADING_STYLES.h6 }}>Loại</span>,
      dataIndex: 'type',
      key: 'type',
      width: 120,
      render: (type, record) => (
        <Tag 
          color={getTransactionTypeColor(type)} 
          icon={getTransactionIcon(type)}
          style={{ fontSize: FONT_SIZE.sm, fontWeight: FONT_WEIGHT.medium }}
        >
          {record.typeDisplayName || type}
        </Tag>
      ),
    },
    {
      title: <span style={{ ...HEADING_STYLES.h6 }}>Điểm thay đổi</span>,
      dataIndex: 'points',
      key: 'points',
      width: 120,
      render: (points) => (
        <span 
          className={points >= 0 ? 'text-green-600' : 'text-red-600'}
          style={{ fontSize: FONT_SIZE.md, fontWeight: FONT_WEIGHT.bold }}
        >
          {points >= 0 ? '+' : ''}{formatPoints(points)} điểm
        </span>
      ),
    },
    {
      title: <span style={{ ...HEADING_STYLES.h6 }}>Số dư sau</span>,
      dataIndex: 'balanceAfter',
      key: 'balanceAfter',
      width: 120,
      render: (balance) => (
        <span style={{ fontSize: FONT_SIZE.base, fontWeight: FONT_WEIGHT.semibold }}>
          {formatPoints(balance)} điểm
        </span>
      ),
    },
    {
      title: <span style={{ ...HEADING_STYLES.h6 }}>Mô tả</span>,
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
      render: (text) => <span style={{ ...BODY_STYLES.base }}>{text}</span>
    },
    {
      title: <span style={{ ...HEADING_STYLES.h6 }}>Thời gian</span>,
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 150,
      render: (date) => <span style={{ fontSize: FONT_SIZE.sm }}>{moment(date).format('DD/MM/YYYY HH:mm')}</span>,
    },
  ];

  const {
    totalPoints = 0,
    lifetimeEarned = 0,
    lifetimeSpent = 0
  } = pointData || {};

  return (
    <div className="space-y-6">
      {/* Header thông tin điểm */}
      <Card 
        className="shadow-sm"
        style={{ 
          borderRadius: '12px',
          background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
          border: 'none'
        }}
      >
        <div className="text-center">
          <div className="text-orange-900/40 text-6xl mb-4">
            <TrophyOutlined />
          </div>
          <h1 className="text-orange-900 mb-2" style={{ ...HEADING_STYLES.h2 }}>Điểm của tôi</h1>
          <p className="text-orange-800/70 mb-4" style={{ ...BODY_STYLES.base }}>Quản lý và theo dõi điểm của bạn</p>
        </div>
      </Card>

      {/* Thống kê điểm */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={8}>
          <Card className="shadow-sm" style={{ borderRadius: '12px' }}>
            <Statistic
              title={<span style={{ fontSize: FONT_SIZE.sm, fontWeight: FONT_WEIGHT.medium }}>Tổng điểm hiện tại</span>}
              value={totalPoints}
              formatter={(value) => formatPoints(value) + ' điểm'}
              prefix={<StarOutlined className="text-yellow-500" />}
              valueStyle={{ color: '#1890ff', fontSize: FONT_SIZE.xl, fontWeight: FONT_WEIGHT.bold }}
              loading={loading}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card className="shadow-sm" style={{ borderRadius: '12px' }}>
            <Statistic
              title={<span style={{ fontSize: FONT_SIZE.sm, fontWeight: FONT_WEIGHT.medium }}>Tổng điểm đã nhận</span>}
              value={lifetimeEarned}
              formatter={(value) => formatPoints(value) + ' điểm'}
              prefix={<ArrowUpOutlined className="text-green-500" />}
              valueStyle={{ color: '#52c41a', fontSize: FONT_SIZE.lg, fontWeight: FONT_WEIGHT.bold }}
              loading={loading}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card className="shadow-sm" style={{ borderRadius: '12px' }}>
            <Statistic
              title={<span style={{ fontSize: FONT_SIZE.sm, fontWeight: FONT_WEIGHT.medium }}>Tổng điểm đã dùng</span>}
              value={lifetimeSpent}
              formatter={(value) => formatPoints(value) + ' điểm'}
              prefix={<ArrowDownOutlined className="text-red-500" />}
              valueStyle={{ color: '#f5222d', fontSize: FONT_SIZE.lg, fontWeight: FONT_WEIGHT.bold }}
              loading={loading}
            />
          </Card>
        </Col>
      </Row>

      {/* Quy đổi điểm */}
      <Card 
        title={<span style={{ ...HEADING_STYLES.h5 }}>Quy đổi điểm</span>} 
        className="shadow-sm" 
        style={{ borderRadius: '12px' }}
      >
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="text-blue-800 mb-2" style={{ fontSize: FONT_SIZE.md, fontWeight: FONT_WEIGHT.semibold }}>
            <StarOutlined className="mr-2" />
            Quy tắc điểm
          </h4>
          <ul className="text-blue-700 space-y-1" style={{ fontSize: FONT_SIZE.sm }}>
            <li>• Nạp tiền: 1.000 VNĐ = 1 điểm</li>
            <li>• Điểm sẽ được cộng tự động khi giao dịch nạp tiền được duyệt</li>
            <li>• Điểm có thể được sử dụng để đổi quà hoặc ưu đãi đặc biệt</li>
          </ul>
        </div>
      </Card>

      {/* Lịch sử thay đổi điểm */}
      <Card 
        title={<span style={{ ...HEADING_STYLES.h5 }}>Lịch sử thay đổi điểm</span>}
        className="shadow-sm" 
        style={{ borderRadius: '12px' }}
      >
        {historyLoading ? (
          <div className="text-center py-8">
            <Spin size="large" />
            <p className="mt-4" style={{ ...BODY_STYLES.base, color: TEXT_COLORS.secondary }}>Đang tải lịch sử...</p>
          </div>
        ) : pointHistory.length === 0 ? (
          <Empty 
            description={<span style={{ ...BODY_STYLES.base }}>Chưa có lịch sử thay đổi điểm</span>}
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        ) : (
          <Table
            columns={columns}
            dataSource={pointHistory}
            rowKey="id"
            pagination={{
              ...pagination,
              showSizeChanger: false,
              showQuickJumper: true,
              showTotal: (total, range) => 
                <span style={{ fontSize: FONT_SIZE.sm }}>{`${range[0]}-${range[1]} của ${total} giao dịch`}</span>,
            }}
            onChange={handleTableChange}
            scroll={{ x: 800 }}
          />
        )}
      </Card>
    </div>
  );
};

export default UserPointsPage;
