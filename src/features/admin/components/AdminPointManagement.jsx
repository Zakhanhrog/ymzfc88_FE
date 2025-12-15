import React, { useState, useEffect } from 'react';
import pointService from '../../../services/pointService';
import { adminService } from '../services/adminService';
import Tabs from '../../../components/ui/Tabs';
import Alert from '../../../components/ui/Alert';
import PointAdjustForm from './point-management/PointAdjustForm';
import PointHistoryTable from './point-management/PointHistoryTable';
import PointHistoryFilters from './point-management/PointHistoryFilters';

const AdminPointManagement = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userPoints, setUserPoints] = useState(null);
  const [pointHistory, setPointHistory] = useState([]);
  const [allPointHistory, setAllPointHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [currentTab, setCurrentTab] = useState('adjust');
  
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    userId: ''
  });

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    if (currentTab === 'all-history') {
      loadAllPointHistory();
    }
  }, [currentTab, currentPage, filters]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await adminService.getAllUsers();
      
      if (response.success) {
        const userList = Array.isArray(response.data) ? response.data : [];
        setUsers(userList);
        setError('');
      } else {
        throw new Error(response.message || 'Không thể tải danh sách người dùng');
      }
    } catch (error) {
      setError('Lỗi khi tải danh sách người dùng: ' + error.message);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const loadUserPoints = async (userId) => {
    try {
      setLoading(true);
      
      const userResponse = await fetch(`http://localhost:8080/api/admin/users/${userId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (userResponse.ok) {
        const userData = await userResponse.json();
        if (userData.success && userData.data.points !== undefined) {
          setUserPoints({
            totalPoints: userData.data.points || 0,
            lifetimeEarned: 0,
            lifetimeSpent: 0
          });
          return;
        }
      }
      
      const response = await pointService.getUserPoints(userId);
      if (response.success) {
        setUserPoints(response.data);
      } else {
        setError(response.message || 'Không thể tải thông tin điểm người dùng');
      }
    } catch (error) {
      setError('Lỗi khi tải thông tin điểm: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const loadUserPointHistory = async (userId, page = 0) => {
    try {
      setLoading(true);
      const response = await pointService.getUserPointHistory(userId, page, 10);
      if (response.success) {
        setPointHistory(response.data.content);
        setCurrentPage(response.data.number);
        setTotalPages(response.data.totalPages);
      } else {
        setError(response.message || 'Không thể tải lịch sử điểm');
      }
    } catch (error) {
      setError('Lỗi khi tải lịch sử điểm: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const loadAllPointHistory = async (page = 0) => {
    try {
      setLoading(true);
      const response = await pointService.getAllPointHistory(page, 10, filters);
      
      if (response.success) {
        const historyData = response.data?.content || response.data || [];
        setAllPointHistory(historyData);
        setCurrentPage(response.data?.number || page);
        setTotalPages(response.data?.totalPages || 1);
        setError('');
      } else {
        throw new Error(response.message || 'Không thể tải lịch sử điểm tổng quan');
      }
    } catch (error) {
      setError('Lỗi khi tải lịch sử điểm: ' + error.message);
      setAllPointHistory([]);
    } finally {
      setLoading(false);
    }
  };

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    loadUserPoints(user.id);
    if (currentTab === 'user-history') {
      loadUserPointHistory(user.id);
    }
  };

  const handleAdjustSubmit = async (data) => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      
      const response = await pointService.adjustUserPoints(data);

      if (response.success) {
        setSuccess(`Điều chỉnh điểm thành công! ${data.type === 'ADD' ? 'Cộng' : 'Trừ'} ${data.points} điểm cho người dùng.`);
        setSelectedUser(null);
        setUserPoints(null);
        
        if (currentTab === 'all-history') {
          loadAllPointHistory(currentPage);
        }
        
        if (selectedUser) {
          loadUserPoints(selectedUser.id);
        }
      } else {
        setError(response.message || 'Điều chỉnh điểm thất bại');
      }
    } catch (error) {
      setError('Lỗi khi điều chỉnh điểm: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (tab) => {
    setCurrentTab(tab);
    setCurrentPage(0);
    setError('');
    setSuccess('');
    
    if (tab === 'user-history' && selectedUser) {
      loadUserPointHistory(selectedUser.id);
    } else if (tab === 'all-history') {
      loadAllPointHistory();
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    if (currentTab === 'user-history' && selectedUser) {
      loadUserPointHistory(selectedUser.id, newPage);
    } else if (currentTab === 'all-history') {
      loadAllPointHistory(newPage);
    }
  };

  const handleApplyFilters = () => {
    setCurrentPage(0);
    loadAllPointHistory(0);
  };

  const tabItems = [
    {
      key: 'adjust',
      label: 'Điều chỉnh điểm',
      children: (
        <PointAdjustForm
          users={users}
          selectedUser={selectedUser}
          userPoints={userPoints}
          loading={loading}
          onSubmit={handleAdjustSubmit}
          onUserSelect={handleUserSelect}
        />
      )
    },
    {
      key: 'user-history',
      label: 'Lịch sử người dùng',
      disabled: !selectedUser,
      children: !selectedUser ? (
        <div className="p-6 text-center text-gray-500">
          Vui lòng chọn người dùng từ tab "Điều chỉnh điểm" trước
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Lịch sử điểm người dùng</h2>
            <p className="text-sm text-gray-600">
              Người dùng: {selectedUser.username} - {selectedUser.fullName || 'N/A'}
            </p>
          </div>
          <PointHistoryTable
            data={pointHistory}
            loading={loading}
            currentPage={currentPage}
            pageSize={10}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            showUserColumn={false}
          />
        </div>
      )
    },
    {
      key: 'all-history',
      label: 'Lịch sử tổng quan',
      children: (
        <div className="space-y-4">
          <PointHistoryFilters
            users={users}
            filters={filters}
            onFiltersChange={setFilters}
            onApply={handleApplyFilters}
          />
          <PointHistoryTable
            data={allPointHistory}
            loading={loading}
            currentPage={currentPage}
            pageSize={10}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            showUserColumn={true}
          />
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {error && (
        <Alert 
          type="error" 
          description={error}
          className="rounded-2xl"
        />
      )}

      {success && (
        <Alert 
          type="success" 
          description={success}
          className="rounded-2xl"
        />
      )}

      <Tabs
        items={tabItems}
        activeKey={currentTab}
        onChange={handleTabChange}
        className="bg-white rounded-2xl shadow-sm"
      />
    </div>
  );
};

export default AdminPointManagement;
