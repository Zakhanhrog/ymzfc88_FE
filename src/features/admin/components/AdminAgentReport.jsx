import { useEffect, useMemo, useState, useCallback } from 'react';
import dayjs from 'dayjs';
import { message } from '../../../utils/notification';
import { adminService } from '../services/adminService';
import AgentReportStats from './agent-report/AgentReportStats';
import AgentReportFilters from './agent-report/AgentReportFilters';
import AgentReportTable from './agent-report/AgentReportTable';
import PayoutHistoryModal from './agent-report/PayoutHistoryModal';

const AdminAgentReport = () => {
  const [selectedMonth, setSelectedMonth] = useState(dayjs());
  const [ipSearch, setIpSearch] = useState('');
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [payoutLoading, setPayoutLoading] = useState({});
  const [noteLoading, setNoteLoading] = useState({});
  const [customCommissions, setCustomCommissions] = useState({});
  const [notes, setNotes] = useState({});
  const [payoutHistoryModal, setPayoutHistoryModal] = useState({ 
    open: false, 
    agentId: null, 
    history: [] 
  });
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });

  const loadReport = useCallback(async (monthValue, ipValue) => {
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
        setPagination(prev => ({
          ...prev,
          total: response.data?.agents?.length || 0
        }));
      } else {
        message.error(response?.message || 'Không thể tải báo cáo đại lý');
      }
    } catch (error) {
      message.error(error.message || 'Không thể tải báo cáo đại lý');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadReport(selectedMonth, ipSearch);
  }, [selectedMonth, ipSearch, loadReport]);

  const handleMonthChange = (value) => {
    if (value) {
      setSelectedMonth(value);
      setPagination(prev => ({ ...prev, current: 1 }));
    }
  };

  const handleIpSearchChange = (value) => {
    setIpSearch(value);
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  const handlePayout = useCallback(async (agent) => {
    try {
      const customCommission = customCommissions[agent.agentId];
      if (!customCommission || Number(customCommission) <= 0) {
        message.warning('Vui lòng nhập số tiền hoa hồng trước khi chia');
        return;
      }
      
      setPayoutLoading((prev) => ({ ...prev, [agent.agentId]: true }));
      const note = notes[agent.agentId] || '';
      const response = await adminService.payoutAgentCommission(agent.agentId, {
        month: selectedMonth.format('YYYY-MM'),
        customCommissionAmount: Number(customCommission),
        note: note
      });
      if (response?.success) {
        message.success('Chia hoa hồng thành công');
        // Clear custom values
        setCustomCommissions((prev) => {
          const newState = { ...prev };
          delete newState[agent.agentId];
          return newState;
        });
        setNotes((prev) => {
          const newState = { ...prev };
          delete newState[agent.agentId];
          return newState;
        });
        await loadReport(selectedMonth, ipSearch);
      } else {
        message.error(response?.message || 'Không thể chia hoa hồng');
      }
    } catch (error) {
      message.error(error.message || 'Không thể chia hoa hồng');
    } finally {
      setPayoutLoading((prev) => ({ ...prev, [agent.agentId]: false }));
    }
  }, [selectedMonth, ipSearch, customCommissions, notes, loadReport]);

  const handleShowPayoutHistory = useCallback(async (agentId) => {
    try {
      const month = selectedMonth.format('YYYY-MM');
      const response = await adminService.getAgentPayoutHistory(agentId, month);
      if (response?.success) {
        setPayoutHistoryModal({
          open: true,
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

  const handleCustomCommissionChange = (agentId, value) => {
    setCustomCommissions((prev) => ({
      ...prev,
      [agentId]: value
    }));
  };

  const handleNoteChange = (agentId, value) => {
    setNotes((prev) => ({
      ...prev,
      [agentId]: value
    }));
  };

  const handlePaginationChange = (page, pageSize) => {
    setPagination(prev => ({
      ...prev,
      current: page,
      pageSize: pageSize || prev.pageSize
    }));
  };

  // Paginate data
  const paginatedData = useMemo(() => {
    if (!report?.agents) return [];
    const start = (pagination.current - 1) * pagination.pageSize;
    const end = start + pagination.pageSize;
    return report.agents.slice(start, end);
  }, [report, pagination]);

  return (
    <div className="space-y-4">
      <AgentReportFilters
        selectedMonth={selectedMonth}
        onMonthChange={handleMonthChange}
        ipSearch={ipSearch}
        onIpSearchChange={handleIpSearchChange}
        onRefresh={() => loadReport(selectedMonth, ipSearch)}
        loading={loading}
      />

      <AgentReportStats report={report} />

      <AgentReportTable
        data={paginatedData}
        loading={loading}
        pagination={pagination}
        customCommissions={customCommissions}
        onCustomCommissionChange={handleCustomCommissionChange}
        notes={notes}
        onNoteChange={handleNoteChange}
        onSaveNote={handleSaveNote}
        noteLoading={noteLoading}
        onPayout={handlePayout}
        payoutLoading={payoutLoading}
        selectedMonth={selectedMonth}
        onShowPayoutHistory={handleShowPayoutHistory}
        onPaginationChange={handlePaginationChange}
      />

      <PayoutHistoryModal
        open={payoutHistoryModal.open}
        onClose={() => setPayoutHistoryModal({ open: false, agentId: null, history: [] })}
        history={payoutHistoryModal.history}
      />
    </div>
  );
};

export default AdminAgentReport;
