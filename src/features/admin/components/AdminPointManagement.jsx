import React, { useState, useEffect } from 'react';
import pointService from '../../../services/pointService';
import { adminService } from '../services/adminService';
import Loading from '../../../components/common/Loading';
import moment from 'moment';

const AdminPointManagement = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userPoints, setUserPoints] = useState(null);
  const [pointHistory, setPointHistory] = useState([]);
  const [allPointHistory, setAllPointHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [currentTab, setCurrentTab] = useState('adjust'); // adjust, user-history, all-history
  
  // Form states
  const [adjustForm, setAdjustForm] = useState({
    userId: '',
    points: '',
    type: 'ADD',
    description: ''
  });

  // Pagination states
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Filter states
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
      console.log('Loading users...');
      const response = await adminService.getAllUsers();
      console.log('Users response:', response);
      
      if (response.success) {
        // The endpoint returns List<UserResponse> directly, not paginated
        const userList = Array.isArray(response.data) ? response.data : [];
        console.log('User list:', userList);
        setUsers(userList);
        setError(''); // Clear any previous errors
      } else {
        throw new Error(response.message || 'Không thể tải danh sách người dùng');
      }
    } catch (error) {
      console.error('Error loading users:', error);
      setError('Lỗi khi tải danh sách người dùng: ' + error.message);
      setUsers([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const loadUserPoints = async (userId) => {
    try {
      setLoading(true);
      
      // Thử gọi API trực tiếp để lấy user info (có points)
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
            lifetimeEarned: 0, // Có thể lấy từ API khác sau
            lifetimeSpent: 0   // Có thể lấy từ API khác sau
          });
          return;
        }
      }
      
      // Fallback: gọi pointService
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
      console.log('Loading all point history with filters:', filters);
      const response = await pointService.getAllPointHistory(page, 10, filters);
      console.log('Point history response:', response);
      
      if (response.success) {
        const historyData = response.data?.content || response.data || [];
        setAllPointHistory(historyData);
        setCurrentPage(response.data?.number || page);
        setTotalPages(response.data?.totalPages || 1);
        setError(''); // Clear any previous errors
      } else {
        throw new Error(response.message || 'Không thể tải lịch sử điểm tổng quan');
      }
    } catch (error) {
      console.error('Error loading point history:', error);
      setError('Lỗi khi tải lịch sử điểm: ' + error.message);
      setAllPointHistory([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    setAdjustForm({ ...adjustForm, userId: user.id });
    loadUserPoints(user.id);
    if (currentTab === 'user-history') {
      loadUserPointHistory(user.id);
    }
  };

  const handleAdjustSubmit = async (e) => {
    e.preventDefault();
    if (!adjustForm.userId || !adjustForm.points || !adjustForm.description) {
      setError('Vui lòng điền đầy đủ thông tin');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccess('');
      
      const response = await pointService.adjustUserPoints({
        userId: parseInt(adjustForm.userId),
        points: parseInt(adjustForm.points),
        type: adjustForm.type,
        description: adjustForm.description
      });

      if (response.success) {
        setSuccess(`Điều chỉnh điểm thành công! ${adjustForm.type === 'ADD' ? 'Cộng' : 'Trừ'} ${adjustForm.points} điểm cho người dùng.`);
        setAdjustForm({ userId: '', points: '', type: 'ADD', description: '' });
        setSelectedUser(null);
        setUserPoints(null);
        
        // Reload data if needed
        if (currentTab === 'all-history') {
          loadAllPointHistory(currentPage);
        }
        
        // Reload user points to show updated value
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

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value });
  };

  const applyFilters = () => {
    setCurrentPage(0);
    loadAllPointHistory(0);
  };

  const formatPoints = (points) => {
    return new Intl.NumberFormat('vi-VN').format(Math.abs(points || 0));
  };

  const getTransactionTypeColor = (type) => {
    switch (type) {
      case 'EARN':
      case 'DEPOSIT_BONUS':
      case 'ADMIN_ADD':
        return 'text-green-600';
      case 'SPEND':
      case 'ADMIN_SUBTRACT':
        return 'text-red-600';
      case 'REFUND':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header với tiêu đề */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Quản lý điểm</h1>
        <p className="text-gray-600">Điều chỉnh điểm và xem lịch sử thay đổi điểm của người dùng</p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
          {success}
        </div>
      )}

      {/* Tabs */}
      <div className="mb-8">
        <nav className="flex space-x-8">
          <button
            onClick={() => handleTabChange('adjust')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
                currentTab === 'adjust'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Điều chỉnh điểm
            </button>
          <button
            onClick={() => handleTabChange('user-history')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              currentTab === 'user-history'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Lịch sử người dùng
          </button>
          <button
            onClick={() => handleTabChange('all-history')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              currentTab === 'all-history'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Lịch sử tổng quan
          </button>
          </nav>
        </div>

        {/* Điều chỉnh điểm */}
        {currentTab === 'adjust' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Điều chỉnh điểm người dùng</h2>
            
            <form onSubmit={handleAdjustSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Chọn người dùng
                    {loading && <span className="text-blue-500 ml-2">(Đang tải...)</span>}
                    {users.length === 0 && !loading && <span className="text-red-500 ml-2">(Không có dữ liệu)</span>}
                  </label>
                  <select
                    value={adjustForm.userId}
                    onChange={(e) => {
                      const userId = e.target.value;
                      const user = users.find(u => u.id.toString() === userId);
                      setAdjustForm({ ...adjustForm, userId });
                      if (user) {
                        handleUserSelect(user);
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                    disabled={loading}
                  >
                    <option value="">
                      {loading ? 'Đang tải danh sách...' : users.length === 0 ? 'Không có người dùng nào' : '-- Chọn người dùng --'}
                    </option>
                    {users.map(user => (
                      <option key={user.id} value={user.id}>
                        {user.username} - {user.fullName || 'N/A'} (ID: {user.id})
                      </option>
                    ))}
                  </select>
                  {users.length === 0 && !loading && (
                    <p className="text-sm text-red-600 mt-1">
                      Không thể tải danh sách người dùng. Vui lòng kiểm tra kết nối API.
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Loại điều chỉnh
                  </label>
                  <select
                    value={adjustForm.type}
                    onChange={(e) => setAdjustForm({ ...adjustForm, type: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="ADD">Cộng điểm</option>
                    <option value="SUBTRACT">Trừ điểm</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Số điểm
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={adjustForm.points}
                    onChange={(e) => setAdjustForm({ ...adjustForm, points: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Nhập số điểm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Lý do điều chỉnh
                  </label>
                  <input
                    type="text"
                    value={adjustForm.description}
                    onChange={(e) => setAdjustForm({ ...adjustForm, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Nhập lý do điều chỉnh"
                    required
                  />
                </div>
              </div>

              {/* Hiển thị thông tin điểm hiện tại */}
              {userPoints && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Thông tin điểm hiện tại của {selectedUser?.username}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <span className="text-sm text-gray-500">Tổng điểm hiện tại:</span>
                      <p className="text-lg font-bold text-blue-600">
                        {formatPoints(userPoints.totalPoints)} điểm
                      </p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Tổng điểm đã nhận:</span>
                      <p className="text-lg font-bold text-green-600">
                        {formatPoints(userPoints.lifetimeEarned)} điểm
                      </p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Tổng điểm đã dùng:</span>
                      <p className="text-lg font-bold text-red-600">
                        {formatPoints(userPoints.lifetimeSpent)} điểm
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Đang xử lý...' : 'Điều chỉnh điểm'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Lịch sử người dùng */}
        {currentTab === 'user-history' && (
          <div className="bg-white rounded-lg shadow-md">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Lịch sử điểm người dùng</h2>
              {selectedUser && (
                <p className="text-sm text-gray-600 mt-1">
                  Người dùng: {selectedUser.username} - {selectedUser.fullName || 'N/A'}
                </p>
              )}
            </div>

            {!selectedUser ? (
              <div className="p-6 text-center text-gray-500">
                Vui lòng chọn người dùng từ tab "Điều chỉnh điểm" trước
              </div>
            ) : (
              <div className="overflow-x-auto">
                {loading ? (
                  <div className="text-center py-8">
                    <Loading />
                  </div>
                ) : pointHistory.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    Người dùng này chưa có lịch sử thay đổi điểm
                  </div>
                ) : (
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Mã giao dịch
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Loại
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Điểm thay đổi
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Số dư sau
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Mô tả
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Người tạo
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Thời gian
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {pointHistory.map((transaction) => (
                        <tr key={transaction.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {transaction.transactionCode}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              transaction.type.includes('ADD') || transaction.type.includes('EARN') || transaction.type.includes('BONUS')
                                ? 'bg-green-100 text-green-800'
                                : transaction.type.includes('SUBTRACT') || transaction.type.includes('SPEND')
                                ? 'bg-red-100 text-red-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}>
                              {transaction.typeDisplayName}
                            </span>
                          </td>
                          <td className={`px-6 py-4 whitespace-nowrap text-sm font-bold ${getTransactionTypeColor(transaction.type)}`}>
                            {transaction.points >= 0 ? '+' : ''}{formatPoints(transaction.points)} điểm
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatPoints(transaction.balanceAfter)} điểm
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                            {transaction.description}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {transaction.createdByUsername || 'Hệ thống'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {moment(transaction.createdAt).format('DD/MM/YYYY HH:mm')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}
          </div>
        )}

        {/* Lịch sử tổng quan */}
        {currentTab === 'all-history' && (
          <div className="bg-white rounded-lg shadow-md">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 sm:mb-0">
                  Lịch sử thay đổi điểm tổng quan
                </h2>
                
                {/* Filters */}
                <div className="flex flex-wrap gap-2">
                  <input
                    type="date"
                    value={filters.startDate}
                    onChange={(e) => handleFilterChange('startDate', e.target.value)}
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm"
                    placeholder="Từ ngày"
                  />
                  <input
                    type="date"
                    value={filters.endDate}
                    onChange={(e) => handleFilterChange('endDate', e.target.value)}
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm"
                    placeholder="Đến ngày"
                  />
                  <select
                    value={filters.userId}
                    onChange={(e) => handleFilterChange('userId', e.target.value)}
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm"
                  >
                    <option value="">Tất cả người dùng</option>
                    {users.map(user => (
                      <option key={user.id} value={user.id}>
                        {user.username}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={applyFilters}
                    className="px-4 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
                  >
                    Lọc
                  </button>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              {loading ? (
                <div className="text-center py-8">
                  <Loading />
                </div>
              ) : allPointHistory.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  Không có lịch sử thay đổi điểm
                </div>
              ) : (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Mã giao dịch
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Người dùng
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Loại
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Điểm thay đổi
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Số dư sau
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Mô tả
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Người tạo
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Thời gian
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {allPointHistory.map((transaction) => (
                      <tr key={transaction.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {transaction.transactionCode}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div>
                            <div className="font-medium">{transaction.user.username}</div>
                            <div className="text-gray-500 text-xs">{transaction.user.fullName}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            transaction.type.includes('ADD') || transaction.type.includes('EARN') || transaction.type.includes('BONUS')
                              ? 'bg-green-100 text-green-800'
                              : transaction.type.includes('SUBTRACT') || transaction.type.includes('SPEND')
                              ? 'bg-red-100 text-red-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {transaction.typeDisplayName}
                          </span>
                        </td>
                        <td className={`px-6 py-4 whitespace-nowrap text-sm font-bold ${getTransactionTypeColor(transaction.type)}`}>
                          {transaction.points >= 0 ? '+' : ''}{formatPoints(transaction.points)} điểm
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatPoints(transaction.balanceAfter)} điểm
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                          {transaction.description}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {transaction.createdByUsername || 'Hệ thống'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {moment(transaction.createdAt).format('DD/MM/YYYY HH:mm')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 0}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Trước
                  </button>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages - 1}
                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Sau
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Trang <span className="font-medium">{currentPage + 1}</span> / {' '}
                      <span className="font-medium">{totalPages}</span>
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 0}
                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span className="sr-only">Previous</span>
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </button>
                      
                      {[...Array(Math.min(totalPages, 5))].map((_, index) => {
                        let pageNumber;
                        if (totalPages <= 5) {
                          pageNumber = index;
                        } else if (currentPage < 3) {
                          pageNumber = index;
                        } else if (currentPage > totalPages - 4) {
                          pageNumber = totalPages - 5 + index;
                        } else {
                          pageNumber = currentPage - 2 + index;
                        }
                        
                        return (
                          <button
                            key={pageNumber}
                            onClick={() => handlePageChange(pageNumber)}
                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                              pageNumber === currentPage
                                ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                            }`}
                          >
                            {pageNumber + 1}
                          </button>
                        );
                      })}
                      
                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage >= totalPages - 1}
                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span className="sr-only">Next</span>
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
    </div>
  );
};

export default AdminPointManagement;