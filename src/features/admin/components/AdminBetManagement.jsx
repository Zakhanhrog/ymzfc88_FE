import React, { useState, useEffect } from 'react';
import { message } from 'antd';
import adminBetService from '../services/adminBetService';
import BetManagementHeader from './bet-management/BetManagementHeader';
import BetManagementFilters from './bet-management/BetManagementFilters';
import BetManagementTable from './bet-management/BetManagementTable';
import BetEditModal from './bet-management/BetEditModal';
import Alert from '../../../components/ui/Alert';

/**
 * Component quản lý bet cho admin
 */
const AdminBetManagement = () => {
  const [bets, setBets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 0,
    size: 20,
    totalPages: 0,
    totalElements: 0
  });
  const [filters, setFilters] = useState({
    status: '',
    betType: '',
    region: '',
    userId: '',
    searchTerm: ''
  });
  const [selectedBet, setSelectedBet] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    selectedNumbers: '',
    groupedNumbers: [] // Mảng các cụm số
  });
  const [notification, setNotification] = useState(null);

  // Load bets
  useEffect(() => {
    loadBets();
  }, [pagination.page, filters]);

  const loadBets = async () => {
    try {
      setLoading(true);
      const response = await adminBetService.getAllBets({
        ...filters,
        page: pagination.page,
        size: pagination.size
      });

      if (response.success) {
        setBets(response.data.content);
        setPagination(prev => ({
          ...prev,
          totalPages: response.data.totalPages,
          totalElements: response.data.totalElements
        }));
      }
    } catch (error) {
      message.error('Không thể tải danh sách bet');
      setNotification({ type: 'error', message: 'Không thể tải danh sách bet' });
    } finally {
      setLoading(false);
    }
  };


  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, page: 0 }));
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };


  const handleEditBet = (bet) => {
    // CHỈ cho phép edit bet có status = PENDING
    if (bet.status !== 'PENDING') {
      message.error('Chỉ có thể chỉnh sửa bet đang chờ (PENDING)');
      setNotification({ type: 'error', message: 'Chỉ có thể chỉnh sửa bet đang chờ (PENDING)' });
      return;
    }
    
    setSelectedBet(bet);
    
    // Parse số đã chọn thành các cụm
    const currentNumbers = Array.isArray(bet.selectedNumbers) 
      ? bet.selectedNumbers 
      : (bet.selectedNumbers || '').split(',').map(n => n.trim()).filter(n => n);
    
    const groupedNumbers = parseNumbersIntoGroups(bet.betType, currentNumbers);
    
    setEditForm({
      selectedNumbers: adminBetService.formatSelectedNumbers(bet.betType, currentNumbers),
      groupedNumbers: groupedNumbers
    });
    setShowEditModal(true);
  };

  const handleGroupNumberChange = (groupIndex, numberIndex, value) => {
    const newGroupedNumbers = [...editForm.groupedNumbers];
    if (newGroupedNumbers[groupIndex]) {
      newGroupedNumbers[groupIndex][numberIndex] = value;
      setEditForm(prev => ({
        ...prev,
        groupedNumbers: newGroupedNumbers
      }));
    }
  };


  // Parse số thành các cụm theo loại cược
  const parseNumbersIntoGroups = (betType, numbers) => {
    if (!numbers || numbers.length === 0) return [];
    
    // Các loại cược xiên - chia thành cụm
    if (betType === 'loto-xien-2') {
      // Xiên 2: mỗi cụm 2 số
      const groups = [];
      for (let i = 0; i < numbers.length; i += 2) {
        const group = numbers.slice(i, i + 2);
        groups.push(group);
      }
      return groups;
    }
    
    if (betType === 'loto-xien-3') {
      // Xiên 3: mỗi cụm 3 số
      const groups = [];
      for (let i = 0; i < numbers.length; i += 3) {
        const group = numbers.slice(i, i + 3);
        groups.push(group);
      }
      return groups;
    }
    
    if (betType === 'loto-xien-4') {
      // Xiên 4: mỗi cụm 4 số
      const groups = [];
      for (let i = 0; i < numbers.length; i += 4) {
        const group = numbers.slice(i, i + 4);
        groups.push(group);
      }
      return groups;
    }
    
    // Các loại cược trượt - chia thành cụm theo số lượng
    if (betType === 'loto-truot-4') {
      // Trượt 4: mỗi cụm 4 số
      const groups = [];
      for (let i = 0; i < numbers.length; i += 4) {
        const group = numbers.slice(i, i + 4);
        groups.push(group);
      }
      return groups;
    }
    
    if (betType === 'loto-truot-8') {
      // Trượt 8: mỗi cụm 8 số
      const groups = [];
      for (let i = 0; i < numbers.length; i += 8) {
        const group = numbers.slice(i, i + 8);
        groups.push(group);
      }
      return groups;
    }
    
    if (betType === 'loto-truot-10') {
      // Trượt 10: mỗi cụm 10 số
      const groups = [];
      for (let i = 0; i < numbers.length; i += 10) {
        const group = numbers.slice(i, i + 10);
        groups.push(group);
      }
      return groups;
    }
    
    // Các loại cược khác - mỗi số 1 cụm
    return numbers.map(num => [num]);
  };

  const handleSubmitEdit = async () => {
    try {
      if (!selectedBet) return;

      // Flatten các cụm thành array số
      const selectedNumbers = editForm.groupedNumbers
        .flat()
        .filter(num => num && num.trim().length > 0);

      if (selectedNumbers.length === 0) {
        message.error('Vui lòng nhập ít nhất 1 số');
        setNotification({ type: 'error', message: 'Vui lòng nhập ít nhất 1 số' });
        return;
      }

      // Gửi số đã chọn mới
      const response = await adminBetService.updateBetSelectedNumbers(
        selectedBet.id,
        selectedNumbers
      );

      if (response.success) {
        message.success('Đã cập nhật số đã chọn thành công');
        setNotification({ type: 'success', message: 'Đã cập nhật số đã chọn thành công' });
        setShowEditModal(false);
        setSelectedBet(null);
        loadBets();
      }
    } catch (error) {
      message.error(error.message || 'Không thể chỉnh sửa bet');
      setNotification({ type: 'error', message: error.message || 'Không thể chỉnh sửa bet' });
    }
  };

  const handleDeleteBet = async (bet) => {
    // CHỈ cho phép xóa bet có status = PENDING
    if (bet.status !== 'PENDING') {
      message.error('Chỉ có thể xóa bet đang chờ (PENDING)');
      setNotification({ type: 'error', message: 'Chỉ có thể xóa bet đang chờ (PENDING)' });
      return;
    }

    if (!window.confirm(`Bạn có chắc muốn xóa bet #${bet.id}? Tiền sẽ được hoàn lại cho user.`)) {
      return;
    }

    try {
      const response = await adminBetService.deleteBet(bet.id);
      if (response.success) {
        message.success('Xóa bet và hoàn tiền thành công');
        setNotification({ type: 'success', message: 'Xóa bet và hoàn tiền thành công' });
        loadBets();
      }
    } catch (error) {
      message.error(error.message || 'Không thể xóa bet');
      setNotification({ type: 'error', message: error.message || 'Không thể xóa bet' });
    }
  };

  const handleCheckAllResults = async () => {
    try {
      const response = await adminBetService.checkAllBetResults();
      if (response.success) {
        message.success('Đã kiểm tra kết quả tất cả bet đang chờ');
        setNotification({ type: 'success', message: 'Đã kiểm tra kết quả tất cả bet đang chờ' });
        loadBets(); // Refresh để hiển thị kết quả mới
      }
    } catch (error) {
      message.error(error.message || 'Không thể kiểm tra kết quả');
      setNotification({ type: 'error', message: error.message || 'Không thể kiểm tra kết quả' });
    }
  };

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  return (
    <div className="space-y-6">
      {notification && (
        <Alert
          type={notification.type}
          message={notification.message}
          closable
          onClose={() => setNotification(null)}
        />
      )}

      <div className="rounded-2xl bg-white p-4 shadow-sm">
        <div className="flex justify-end items-center mb-4">
          <BetManagementHeader
            loading={loading}
            onRefresh={loadBets}
            onCheckAllResults={handleCheckAllResults}
          />
        </div>

        <BetManagementFilters
          filters={filters}
          onFilterChange={handleFilterChange}
        />

        <div className="mt-4">
          <BetManagementTable
            bets={bets}
            loading={loading}
            pagination={pagination}
            onPageChange={handlePageChange}
            onEdit={handleEditBet}
            onDelete={handleDeleteBet}
          />
        </div>
      </div>

      <BetEditModal
        open={showEditModal}
        bet={selectedBet}
        editForm={editForm}
        onClose={() => {
          setShowEditModal(false);
          setSelectedBet(null);
        }}
        onSubmit={handleSubmitEdit}
        onGroupNumberChange={handleGroupNumberChange}
      />
    </div>
  );
};

export default AdminBetManagement;

