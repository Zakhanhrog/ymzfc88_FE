import { useCallback, useEffect, useMemo, useState } from 'react';
import { Card, Table, Button, Space, Tag, message } from 'antd';
import dayjs from 'dayjs';
import TabPageHeader from './TabPageHeader';
import xocDiaResultHistoryService from '../../../services/xocDiaResultHistoryService';

const RESULT_LABELS = {
  'four-white': '4 Trắng',
  'three-white-one-red': '3 Trắng 1 Đỏ',
  'two-two': '2 Trắng 2 Đỏ',
  'three-red-one-white': '3 Đỏ 1 Trắng',
  'four-red': '4 Đỏ',
};

const RESULT_BADGE = {
  'four-white': { color: 'default', text: '4 Trắng' },
  'three-white-one-red': { color: 'processing', text: '3 Trắng 1 Đỏ' },
  'two-two': { color: 'blue', text: '2 Trắng 2 Đỏ' },
  'three-red-one-white': { color: 'volcano', text: '3 Đỏ 1 Trắng' },
  'four-red': { color: 'magenta', text: '4 Đỏ' },
};

const parityTag = (parity) => {
  switch (parity) {
    case 'CHAN':
      return <Tag color="green">Chẵn</Tag>;
    case 'LE':
      return <Tag color="red">Lẻ</Tag>;
    default:
      return <Tag>--</Tag>;
  }
};

const formatResultCode = (code) => RESULT_LABELS[code] || code || '--';

const StaffXocDiaHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadHistory = useCallback(async () => {
    setLoading(true);
    try {
      const response = await xocDiaResultHistoryService.fetchHistories({
        limit: 120,
        order: 'desc',
      });
      if (response.success) {
        setHistory(response.data || []);
      } else {
        message.error(response.message || 'Không thể tải lịch sử kết quả Xóc Đĩa');
      }
    } catch (error) {
      message.error(error?.message || 'Không thể tải lịch sử kết quả Xóc Đĩa');
    } finally {
      setLoading(false);
    }
  }, []);

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
        render: (value) => (value ? dayjs(value).format('DD/MM/YYYY HH:mm:ss') : '--'),
      },
      {
        title: 'Kết quả',
        dataIndex: 'normalizedResultCode',
        key: 'normalizedResultCode',
        render: (value) => {
          const badge = RESULT_BADGE[value];
          if (!badge) {
            return <Tag>{formatResultCode(value)}</Tag>;
          }
          return <Tag color={badge.color}>{badge.text}</Tag>;
        },
      },
      {
        title: 'Số quân đỏ',
        dataIndex: 'redCount',
        key: 'redCount',
        width: 120,
        render: (value) => value ?? '--',
      },
      {
        title: 'Chẵn / Lẻ',
        dataIndex: 'parity',
        key: 'parity',
        width: 120,
        render: (value) => parityTag(value),
      },
      {
        title: 'Mã phiên',
        dataIndex: 'sessionId',
        key: 'sessionId',
        width: 120,
        render: (value) => value ?? '--',
      },
    ],
    []
  );

  return (
    <div className="space-y-6">
      <TabPageHeader
        title="Lịch sử kết quả Xóc Đĩa"
        description="Theo dõi kết quả Xóc Đĩa theo thời gian, hiển thị theo thứ tự mới nhất"
      />

      <Card
        title="Lịch sử kết quả"
        extra={
          <Space>
            <Button onClick={loadHistory} loading={loading}>
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
          scroll={{ x: 680 }}
        />
      </Card>
    </div>
  );
};

export default StaffXocDiaHistory;

