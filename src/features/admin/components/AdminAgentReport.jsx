import { useEffect, useMemo, useState, useCallback } from 'react';
import {
  Card,
  DatePicker,
  Table,
  Tag,
  Space,
  Button,
  Typography,
  message,
  Popconfirm,
  Row,
  Col,
  Statistic,
  Input,
  InputNumber,
  Modal,
  Drawer
} from 'antd';
import { DollarOutlined, ReloadOutlined, UsergroupAddOutlined, SearchOutlined, HistoryOutlined, SaveOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { adminService } from '../services/adminService';
import TabPageHeader from './TabPageHeader';
import { formatCurrency, formatPointsDisplay, formatPoints } from '../../../utils/helpers';

const { Text } = Typography;

const AdminAgentReport = () => {
  const [selectedMonth, setSelectedMonth] = useState(dayjs());
  const [ipSearch, setIpSearch] = useState('');
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [payoutLoading, setPayoutLoading] = useState({});
  const [noteLoading, setNoteLoading] = useState({});
  const [customCommissions, setCustomCommissions] = useState({}); // { agentId: commissionAmount }
  const [notes, setNotes] = useState({}); // { agentId: note }
  const [payoutHistoryDrawer, setPayoutHistoryDrawer] = useState({ visible: false, agentId: null, history: [] });

  const loadReport = async (monthValue, ipValue) => {
    try {
      setLoading(true);
      const params = {
        month: monthValue.format('YYYY-MM')
      };
      if (ipValue && ipValue.trim()) {
        params.ip = ipValue.trim();
      }
      const response = await adminService.getAgentCommissionReport(params);
      if (response?.success) {
        setReport(response.data);
        // Load ghi chú từ response
        const notesMap = {};
        if (response.data?.agents) {
          response.data.agents.forEach(agent => {
            if (agent.agentNote) {
              notesMap[agent.agentId] = agent.agentNote;
            }
          });
        }
        setNotes(notesMap);
      } else {
        message.error(response?.message || 'Không thể tải báo cáo đại lý');
      }
    } catch (error) {
      message.error(error.message || 'Không thể tải báo cáo đại lý');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReport(selectedMonth, ipSearch);
  }, [selectedMonth, ipSearch]);

  const handleMonthChange = (value) => {
    if (value) {
      setSelectedMonth(value);
    }
  };

  const handlePayout = useCallback(async (record) => {
    try {
      const customCommission = customCommissions[record.agentId];
      // Kiểm tra đã điền hoa hồng chưa
      if (!customCommission || Number(customCommission) <= 0) {
        message.warning('Vui lòng nhập số tiền hoa hồng trước khi chia');
        return;
      }
      
      setPayoutLoading((prev) => ({ ...prev, [record.agentId]: true }));
      const note = notes[record.agentId] || '';
      const response = await adminService.payoutAgentCommission(record.agentId, {
        month: selectedMonth.format('YYYY-MM'),
        customCommissionAmount: Number(customCommission),
        note: note
      });
      if (response?.success) {
        message.success('Chia hoa hồng thành công');
        // Clear custom values
        setCustomCommissions((prev) => {
          const newState = { ...prev };
          delete newState[record.agentId];
          return newState;
        });
        setNotes((prev) => {
          const newState = { ...prev };
          delete newState[record.agentId];
          return newState;
        });
        await loadReport(selectedMonth, ipSearch);
      } else {
        message.error(response?.message || 'Không thể chia hoa hồng');
      }
    } catch (error) {
      message.error(error.message || 'Không thể chia hoa hồng');
    } finally {
      setPayoutLoading((prev) => ({ ...prev, [record.agentId]: false }));
    }
  }, [selectedMonth, ipSearch, customCommissions, notes, loadReport]);

  const handleShowPayoutHistory = useCallback(async (agentId) => {
    try {
      const month = selectedMonth.format('YYYY-MM');
      const response = await adminService.getAgentPayoutHistory(agentId, month);
      if (response?.success) {
        setPayoutHistoryDrawer({
          visible: true,
          agentId: agentId,
          history: response.data || []
        });
      } else {
        message.error(response?.message || 'Không thể tải lịch sử');
      }
    } catch (error) {
      message.error(error.message || 'Không thể tải lịch sử');
    }
  }, [selectedMonth]);

  const handleSaveNote = useCallback(async (agentId) => {
    try {
      setNoteLoading((prev) => ({ ...prev, [agentId]: true }));
      const month = selectedMonth.format('YYYY-MM');
      const note = notes[agentId] || '';
      const response = await adminService.saveAgentNote(agentId, month, note);
      if (response?.success) {
        message.success('Lưu ghi chú thành công');
      } else {
        message.error(response?.message || 'Không thể lưu ghi chú');
      }
    } catch (error) {
      message.error(error.message || 'Không thể lưu ghi chú');
    } finally {
      setNoteLoading((prev) => ({ ...prev, [agentId]: false }));
    }
  }, [selectedMonth, notes]);

  const summaryCards = useMemo(() => {
    if (!report) {
      return [];
    }
    return [
      {
        title: 'Tổng đại lý',
        value: report.totalAgents ?? 0,
        prefix: <UsergroupAddOutlined className="text-blue-400" />,
        formatter: (val) => val
      },
      {
        title: 'Tổng khách hàng',
        value: report.totalCustomers ?? 0,
        prefix: <UsergroupAddOutlined className="text-purple-400" />,
        formatter: (val) => val
      },
      {
        title: 'Tổng cược',
        value: Number(report.totalBetAmount ?? 0),
        prefix: <DollarOutlined className="text-indigo-400" />,
        formatter: formatPointsDisplay
      },
      {
        title: 'Tổng thua',
        value: Number(report.totalLostAmount ?? 0),
        prefix: <DollarOutlined className="text-red-400" />,
        formatter: formatPointsDisplay
      },
      {
        title: 'Hoa hồng dự kiến',
        value: Number(report.totalCalculatedCommission ?? 0),
        prefix: <DollarOutlined className="text-emerald-400" />,
        formatter: formatPointsDisplay
      },
      {
        title: 'Đã chia',
        value: Number(report.totalPaidCommission ?? 0),
        prefix: <DollarOutlined className="text-green-400" />,
        formatter: formatPointsDisplay
      },
      {
        title: 'Chưa chia',
        value: Number(report.totalPendingCommission ?? 0),
        prefix: <DollarOutlined className="text-orange-400" />,
        formatter: formatPointsDisplay
      }
    ];
  }, [report]);

  const columns = useMemo(() => [
    {
      title: 'Đại lý',
      dataIndex: 'username',
      key: 'username',
      width: 150,
      fixed: 'left',
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <Text strong>{record.username}</Text>
          {record.fullName && <Text type="secondary" style={{ fontSize: '12px' }}>{record.fullName}</Text>}
        </Space>
      )
    },
    {
      title: 'Mã giới thiệu',
      dataIndex: 'referralCode',
      key: 'referralCode',
      width: 120,
      render: (value) => <Text copyable={{ text: value || '' }}>{value || '-'}</Text>
    },
    {
      title: 'Khách hàng',
      dataIndex: 'customerCount',
      key: 'customerCount',
      width: 100,
      align: 'right'
    },
    {
      title: 'Tổng cược',
      dataIndex: 'totalBetAmount',
      key: 'totalBetAmount',
      width: 130,
      align: 'right',
      render: (value) => formatPointsDisplay(Number(value ?? 0))
    },
    {
      title: 'Tổng thua',
      dataIndex: 'totalLostAmount',
      key: 'totalLostAmount',
      width: 130,
      align: 'right',
      render: (value) => formatPointsDisplay(Number(value ?? 0))
    },
    {
      title: 'Tổng Nạp',
      dataIndex: 'totalDepositAmount',
      key: 'totalDepositAmount',
      width: 130,
      align: 'right',
      render: (value) => formatPoints(Number(value ?? 0)) // VND, cần chia 1000
    },
    {
      title: 'Tổng Rút',
      dataIndex: 'totalWithdrawAmount',
      key: 'totalWithdrawAmount',
      width: 130,
      align: 'right',
      render: (value) => formatPoints(Number(value ?? 0)) // VND, cần chia 1000
    },
    {
      title: 'Tổng hoàn thua',
      dataIndex: 'totalDailyLossRefund',
      key: 'totalDailyLossRefund',
      width: 140,
      align: 'right',
      render: (value) => formatPointsDisplay(Number(value ?? 0))
    },
    {
      title: 'Tổng hoàn cược',
      dataIndex: 'totalRefund',
      key: 'totalRefund',
      width: 140,
      align: 'right',
      render: (value) => formatPointsDisplay(Number(value ?? 0))
    },
    {
      title: 'Tổng KM',
      dataIndex: 'totalPromotionalMoney',
      key: 'totalPromotionalMoney',
      width: 120,
      align: 'right',
      render: (value) => formatPointsDisplay(Number(value ?? 0))
    },
    {
      title: 'Số dư cuối',
      dataIndex: 'finalBalance',
      key: 'finalBalance',
      width: 140,
      align: 'right',
      render: (value) => {
        const balance = Number(value ?? 0);
        return (
          <span style={{ color: balance >= 0 ? '#16a34a' : '#dc2626', fontWeight: 'bold' }}>
            {formatPointsDisplay(balance)}
          </span>
        );
      }
    },
    {
      title: 'IP',
      dataIndex: 'firstLoginIp',
      key: 'firstLoginIp',
      width: 180,
      render: (value) => <Text ellipsis={{ tooltip: value || '-' }} style={{ maxWidth: 180 }}>{value || '-'}</Text>
    },
    {
      title: 'Hoa hồng',
      key: 'commission',
      width: 180,
      align: 'right',
      render: (_, record) => {
        const calculated = Number(record.calculatedCommissionAmount ?? 0);
        const custom = customCommissions[record.agentId];
        return (
          <Space direction="vertical" size={4} style={{ width: '100%' }}>
            <Text type="secondary" style={{ fontSize: '12px', whiteSpace: 'nowrap' }}>
              Tự động: {formatPointsDisplay(calculated)}
            </Text>
            <InputNumber
              style={{ width: '100%' }}
              placeholder="Nhập hoa hồng"
              value={custom}
              onChange={(value) => {
                setCustomCommissions((prev) => ({
                  ...prev,
                  [record.agentId]: value
                }));
              }}
              min={0}
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
            />
          </Space>
        );
      }
    },
    {
      title: 'Đã chia',
      key: 'paidHistory',
      width: 140,
      align: 'center',
      render: (_, record) => {
        const paidAmount = Number(record.paidCommissionAmount ?? 0);
        return (
          <Space direction="vertical" size={4} align="center">
            <Text>{formatPointsDisplay(paidAmount)}</Text>
            <Button
              type="link"
              size="small"
              icon={<HistoryOutlined />}
              onClick={() => handleShowPayoutHistory(record.agentId)}
            >
              Lịch sử
            </Button>
          </Space>
        );
      }
    },
    {
      title: 'Ghi chú',
      key: 'note',
      width: 250,
      render: (_, record) => (
        <Space direction="vertical" size={4} style={{ width: '100%' }}>
          <Input.TextArea
            rows={2}
            placeholder="Nhập ghi chú cho đại lý"
            value={notes[record.agentId] || ''}
            onChange={(e) => {
              setNotes((prev) => ({
                ...prev,
                [record.agentId]: e.target.value
              }));
            }}
            style={{ minWidth: 200 }}
          />
          <Button
            type="primary"
            size="small"
            icon={<SaveOutlined />}
            onClick={() => handleSaveNote(record.agentId)}
            loading={!!noteLoading[record.agentId]}
          >
            Lưu
          </Button>
        </Space>
      )
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 120,
      fixed: 'right',
      align: 'center',
      render: (_, record) => {
        const customCommission = customCommissions[record.agentId];
        const hasCustomCommission = customCommission && Number(customCommission) > 0;
        
        return (
          <Popconfirm
            title="Xác nhận chia hoa hồng?"
            description={`Chia hoa hồng ${formatPointsDisplay(Number(customCommission || 0))} tháng ${selectedMonth.format('YYYY-MM')} cho đại lý ${record.username}`}
            okText="Chia"
            cancelText="Hủy"
            onConfirm={() => handlePayout(record)}
            disabled={!hasCustomCommission}
          >
            <Button
              type="primary"
              disabled={!hasCustomCommission}
              loading={!!payoutLoading[record.agentId]}
              size="small"
            >
              Chia
            </Button>
          </Popconfirm>
        );
      }
    }
  ], [report, selectedMonth, customCommissions, notes, payoutLoading, noteLoading, handlePayout, handleShowPayoutHistory, handleSaveNote]);

  return (
    <div className="space-y-6">
      <TabPageHeader
        title="Báo cáo đại lý"
        description="Theo dõi hoa hồng theo tháng và thực hiện chia hoa hồng cho từng đại lý"
      />

      <Card>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} md={6}>
            <Space direction="vertical" size={2}>
              <Text type="secondary">Tháng báo cáo</Text>
              <DatePicker
                picker="month"
                format="YYYY-MM"
                value={selectedMonth}
                onChange={handleMonthChange}
              />
            </Space>
          </Col>
          <Col xs={24} md={8}>
            <Space direction="vertical" size={2}>
              <Text type="secondary">Tìm kiếm theo IP</Text>
              <Input
                placeholder="Nhập IP để tìm kiếm"
                value={ipSearch}
                onChange={(e) => setIpSearch(e.target.value)}
                prefix={<SearchOutlined />}
                allowClear
              />
            </Space>
          </Col>
          <Col xs={24} md={10} className="flex justify-end">
            <Button
              icon={<ReloadOutlined />}
              onClick={() => loadReport(selectedMonth, ipSearch)}
              loading={loading}
            >
              Làm mới
            </Button>
          </Col>
        </Row>
      </Card>

      <Row gutter={[16, 16]}>
        {summaryCards.map((item) => (
          <Col xs={24} sm={12} md={8} lg={6} xl={4} key={item.title}>
            <Card>
              <Statistic
                title={item.title}
                value={item.formatter(item.value)}
                prefix={item.prefix}
              />
            </Card>
          </Col>
        ))}
      </Row>

      <Card bodyStyle={{ overflowX: 'auto' }}>
        <div style={{ width: '100%', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
          <Table
            loading={loading}
            dataSource={report?.agents || []}
            columns={columns}
            rowKey="agentId"
            tableLayout="auto"
            style={{ minWidth: 1600 }}
            scroll={{ x: 2200, y: 'calc(100vh - 400px)' }}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              pageSizeOptions: ['10', '20', '50', '100'],
              showTotal: (total) => `Tổng ${total} đại lý`
            }}
            locale={{
              emptyText: 'Chưa có dữ liệu đại lý cho tháng này'
            }}
            size="small"
          />
        </div>
      </Card>

      <Drawer
        title="Lịch sử chia hoa hồng"
        placement="right"
        width={600}
        open={payoutHistoryDrawer.visible}
        onClose={() => setPayoutHistoryDrawer({ visible: false, agentId: null, history: [] })}
      >
        <Table
          dataSource={payoutHistoryDrawer.history}
          rowKey="id"
          scroll={{ x: 'max-content' }}
          columns={[
            {
              title: 'Tháng',
              dataIndex: 'periodMonth',
              key: 'periodMonth'
            },
            {
              title: 'Số tiền',
              dataIndex: 'commissionAmount',
              key: 'commissionAmount',
              align: 'right',
              render: (value) => formatPointsDisplay(Number(value ?? 0))
            },
            {
              title: 'Ngày chia',
              dataIndex: 'paidAt',
              key: 'paidAt',
              render: (value) => value ? dayjs(value).format('DD/MM/YYYY HH:mm') : '-'
            },
            {
              title: 'Ghi chú',
              dataIndex: 'notes',
              key: 'notes',
              render: (value) => value || '-'
            }
          ]}
          pagination={false}
          locale={{
            emptyText: 'Chưa có lịch sử chia hoa hồng'
          }}
        />
      </Drawer>
    </div>
  );
};

export default AdminAgentReport;

