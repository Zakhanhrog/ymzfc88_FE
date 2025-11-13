import { useEffect, useMemo, useState, useCallback } from 'react';
import { Card, Table, Button, Space, Tag, message } from 'antd';
import dayjs from 'dayjs';
import TabPageHeader from './TabPageHeader';
import { adminService } from '../services/adminService';
import { diceFaceIconMap } from './AdminSicboResultManagement';

const parseResultCode = (code) => {
  if (!code || typeof code !== 'string') {
    return [];
  }
  const faces = code
    .split(/[-_,\s]+/)
    .map((value) => Number.parseInt(value, 10))
    .filter((value) => !Number.isNaN(value) && value >= 1 && value <= 6);
  return faces.length === 3 ? faces : [];
};

const sumFaces = (faces) => faces.reduce((acc, value) => acc + value, 0);

const renderResultFaces = (faces) => (
  <Space>
    {faces.map((face, index) => (
      <div
        key={`sicbo-history-face-${index}`}
        className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white shadow-sm"
      >
        <img
          src={diceFaceIconMap[face]}
          alt={`Mặt ${face}`}
          className="h-8 w-8 object-contain"
          draggable={false}
        />
      </div>
    ))}
  </Space>
);

const categoryColor = (category) => {
  switch (category) {
    case 'TRIPLE':
      return 'magenta';
    case 'BIG':
      return 'green';
    case 'SMALL':
      return 'blue';
    default:
      return 'default';
  }
};

const StaffSicboHistory = ({ tableNumber }) => {
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  const title = useMemo(
    () => `Lịch sử kết quả bàn TX${tableNumber}`,
    [tableNumber]
  );

  const loadHistory = useCallback(
    async (limit = 120) => {
      setLoading(true);
      try {
        const response = await adminService.getSicboResultHistory({
          table: tableNumber,
          limit,
        });
        if (response.success) {
          setHistory(response.data || []);
        }
      } catch (error) {
        message.error(error.message || 'Không thể tải lịch sử kết quả');
      } finally {
        setLoading(false);
      }
    },
    [tableNumber]
  );

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const columns = useMemo(
    () => [
      {
        title: 'Thời gian',
        dataIndex: 'recordedAt',
        key: 'recordedAt',
        width: 160,
        render: (value) =>
          value ? dayjs(value).format('DD/MM/YYYY HH:mm:ss') : '--',
      },
      {
        title: 'Kết quả',
        dataIndex: 'resultCode',
        key: 'resultCode',
        render: (_, record) => {
          const faces = parseResultCode(record.resultCode);
          if (faces.length !== 3) {
            return record.resultCode || '--';
          }
          return renderResultFaces(faces);
        },
      },
      {
        title: 'Tổng',
        dataIndex: 'resultSum',
        key: 'resultSum',
        width: 80,
        render: (value, record) => {
          if (value != null) {
            return value;
          }
          const faces = parseResultCode(record.resultCode);
          return faces.length === 3 ? sumFaces(faces) : '--';
        },
      },
      {
        title: 'Phân loại',
        dataIndex: 'category',
        key: 'category',
        width: 120,
        render: (value) =>
          value ? (
            <Tag color={categoryColor(value)}>{value}</Tag>
          ) : (
            <Tag>Không xác định</Tag>
          ),
      },
      {
        title: 'Phiên',
        dataIndex: 'sessionId',
        key: 'sessionId',
        width: 120,
        render: (value) => value || '--',
      },
    ],
    []
  );

  return (
    <div className="space-y-6">
      <TabPageHeader
        title={title}
        description="Theo dõi lịch sử kết quả bàn Tài Xỉu theo thời gian thực (mới nhất trước)"
      />

      <Card
        title="Lịch sử kết quả"
        extra={
          <Space>
            <Button onClick={() => loadHistory()} loading={loading}>
              Tải lại
            </Button>
          </Space>
        }
      >
        <Table
          rowKey={(record, index) =>
            `${record.sessionId || 'session'}-${record.recordedAt || index}`
          }
          loading={loading}
          dataSource={history}
          columns={columns}
          pagination={{
            pageSize: 20,
            showSizeChanger: false,
          }}
          scroll={{ x: 720 }}
        />
      </Card>
    </div>
  );
};

export default StaffSicboHistory;

