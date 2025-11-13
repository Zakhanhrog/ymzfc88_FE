import { useEffect, useState, useCallback } from 'react';
import {
  Card,
  Row,
  Col,
  Statistic,
  Table,
  message,
  Typography,
  Tag,
  Space,
} from 'antd';
import { TrophyOutlined, DollarOutlined, FundOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import TabPageHeader from './TabPageHeader';
import { staffService } from '../services/staffService';
import { formatCurrency } from '../../../utils/helpers';

const { Text } = Typography;

const StaffMktGameOverview = () => {
  const [loading, setLoading] = useState(false);
  const [overview, setOverview] = useState(null);

  const loadOverview = useCallback(async () => {
    try {
      setLoading(true);
      const response = await staffService.getMktGameOverview();
      if (response?.success) {
        setOverview(response.data);
      } else {
        message.error(response?.message || 'Không thể tải báo cáo game');
      }
    } catch (error) {
      message.error(error.message || 'Không thể tải báo cáo game');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOverview();
  }, [loadOverview]);

  const renderSummaryCard = (title, summary) => (
    <Card loading={loading} className="h-full">
      <Space direction="vertical" size="middle">
        <Statistic
          title={`${title} - Tổng lượt cược`}
          value={summary?.totalBets ?? 0}
          prefix={<TrophyOutlined className="text-emerald-400" />}
        />
        <Statistic
          title="Tổng điểm đặt"
          value={formatCurrency(Number(summary?.totalStakeAmount ?? 0))}
          prefix={<DollarOutlined className="text-blue-400" />}
        />
        <Statistic
          title="Tổng tiền thắng"
          value={formatCurrency(Number(summary?.totalWinAmount ?? 0))}
          prefix={<FundOutlined className="text-indigo-400" />}
        />
      </Space>
    </Card>
  );

  const columns = [
    {
      title: 'Thời gian',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (value) => (value ? dayjs(value).format('DD/MM/YYYY HH:mm') : '-'),
    },
    {
      title: 'Game',
      dataIndex: 'gameType',
      key: 'gameType',
      render: (value) => {
        switch (value) {
          case 'LOTTERY':
            return <Tag color="geekblue">Xổ số</Tag>;
          case 'XOCDIA':
            return <Tag color="green">Xóc Đĩa</Tag>;
          case 'SICBO':
            return <Tag color="cyan">Tài xỉu</Tag>;
          default:
            return value || '-';
        }
      },
    },
    {
      title: 'Người chơi',
      dataIndex: 'username',
      key: 'username',
      render: (value) => <Text>{value || '-'}</Text>,
    },
    {
      title: 'Loại cược',
      dataIndex: 'betCode',
      key: 'betCode',
      render: (value) => value || '-',
    },
    {
      title: 'Điểm cược',
      dataIndex: 'stakeAmount',
      key: 'stakeAmount',
      align: 'right',
      render: (value) => formatCurrency(Number(value ?? 0)),
    },
    {
      title: 'Tiền thắng',
      dataIndex: 'winAmount',
      key: 'winAmount',
      align: 'right',
      render: (value) => formatCurrency(Number(value ?? 0)),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (value) => {
        if (!value) return '-';
        if (value === 'WON') return <Tag color="green">Thắng</Tag>;
        if (value === 'LOST') return <Tag color="red">Thua</Tag>;
        if (value === 'REFUNDED' || value === 'CANCELLED') return <Tag color="orange">Hoàn/Hủy</Tag>;
        return value;
      },
    },
  ];

  return (
    <div className="space-y-6">
      <TabPageHeader
        title="Nhân viên MKT - Quản lý game"
        description="Theo dõi hiệu suất các game trong hệ thống (chế độ chỉ xem)"
      />

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={8}>
          {renderSummaryCard('Xổ số', overview?.lottery)}
        </Col>
        <Col xs={24} lg={8}>
          {renderSummaryCard('Xóc Đĩa', overview?.xocdia)}
        </Col>
        <Col xs={24} lg={8}>
          {renderSummaryCard('Tài xỉu', overview?.sicbo)}
        </Col>
      </Row>

      <Card title="Lịch sử cược gần đây" loading={loading}>
        <Table
          dataSource={overview?.recentBets || []}
          columns={columns}
          pagination={false}
          rowKey={(record, index) => `${record.id}-${index}`}
        />
      </Card>
    </div>
  );
};

export default StaffMktGameOverview;

