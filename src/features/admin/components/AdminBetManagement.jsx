import React, { useState, useEffect } from 'react';
import adminBetService from '../services/adminBetService';

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
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updateForm, setUpdateForm] = useState({
    winningNumbers: ''
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
      console.error('Error loading bets:', error);
      showNotification('Không thể tải danh sách bet', 'error');
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

  const handleUpdateBet = (bet) => {
    // CHỈ cho phép update bet có status = PENDING
    if (bet.status !== 'PENDING') {
      showNotification('Chỉ có thể thay đổi kết quả của bet đang chờ (PENDING)', 'error');
      return;
    }
    
    setSelectedBet(bet);
    setUpdateForm({
      winningNumbers: ''
    });
    setShowUpdateModal(true);
  };

  const handleSubmitUpdate = async () => {
    try {
      if (!selectedBet) return;

      const winningNumbers = updateForm.winningNumbers
        .split(',')
        .map(n => n.trim())
        .filter(n => n.length > 0);

      // Gửi chỉ có winningNumbers, backend sẽ tự động tính thắng/thua
      const response = await adminBetService.updateBetResult(
        selectedBet.id,
        winningNumbers
      );

      if (response.success) {
        showNotification('Đã nhập kết quả xổ số thành công', 'success');
        setShowUpdateModal(false);
        setSelectedBet(null);
        loadBets();
      }
    } catch (error) {
      console.error('Error updating bet:', error);
      showNotification(error.message || 'Không thể cập nhật bet', 'error');
    }
  };

  const handleDeleteBet = async (bet) => {
    // CHỈ cho phép xóa bet có status = PENDING
    if (bet.status !== 'PENDING') {
      showNotification('Chỉ có thể xóa bet đang chờ (PENDING)', 'error');
      return;
    }

    if (!window.confirm(`Bạn có chắc muốn xóa bet #${bet.id}? Tiền sẽ được hoàn lại cho user.`)) {
      return;
    }

    try {
      const response = await adminBetService.deleteBet(bet.id);
      if (response.success) {
        showNotification('Xóa bet và hoàn tiền thành công', 'success');
        loadBets();
        loadStatistics();
      }
    } catch (error) {
      console.error('Error deleting bet:', error);
      showNotification(error.message || 'Không thể xóa bet', 'error');
    }
  };

  const showNotification = (message, type = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <button
          onClick={loadBets}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Làm mới
        </button>
      </div>

      {/* Notification */}
      {notification && (
        <div
          className={`p-4 rounded-lg ${
            notification.type === 'success'
              ? 'bg-green-100 text-green-800'
              : notification.type === 'error'
              ? 'bg-red-100 text-red-800'
              : 'bg-blue-100 text-blue-800'
          }`}
        >
          {notification.message}
        </div>
      )}


      {/* Filters */}
      <div className="bg-white border border-gray-200 p-4 rounded-lg space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {/* Status filter */}
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="PENDING">Đang chờ</option>
            <option value="WON">Thắng</option>
            <option value="LOST">Thua</option>
            <option value="CANCELLED">Đã hủy</option>
          </select>

          {/* Region filter */}
          <select
            value={filters.region}
            onChange={(e) => handleFilterChange('region', e.target.value)}
            className="border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Tất cả khu vực</option>
            <option value="mienBac">Miền Bắc</option>
            <option value="mienTrungNam">Miền Trung Nam</option>
          </select>

          {/* Bet type filter */}
          <select
            value={filters.betType}
            onChange={(e) => handleFilterChange('betType', e.target.value)}
            className="border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Tất cả loại cược</option>
            <option value="loto2s">Lô 2 số</option>
            <option value="loto3s">Lô 3 số</option>
            <option value="loto4s">Lô 4 số</option>
            <option value="loto-xien-2">Xiên 2</option>
            <option value="loto-xien-3">Xiên 3</option>
            <option value="loto-xien-4">Xiên 4</option>
            <option value="3s-dac-biet">3 số đặc biệt</option>
            <option value="4s-dac-biet">4 số đặc biệt</option>
          </select>

          {/* User ID filter */}
          <input
            type="number"
            placeholder="User ID"
            value={filters.userId}
            onChange={(e) => handleFilterChange('userId', e.target.value)}
            className="border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />

          {/* Search */}
          <input
            type="text"
            placeholder="Tìm username hoặc bet ID"
            value={filters.searchTerm}
            onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
            className="border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-gray-700 font-semibold">ID</th>
                <th className="px-4 py-3 text-left text-gray-700 font-semibold">User</th>
                <th className="px-4 py-3 text-left text-gray-700 font-semibold">Khu vực</th>
                <th className="px-4 py-3 text-left text-gray-700 font-semibold">Loại cược</th>
                <th className="px-4 py-3 text-left text-gray-700 font-semibold">Số đã chọn</th>
                <th className="px-4 py-3 text-right text-gray-700 font-semibold">Tiền cược</th>
                <th className="px-4 py-3 text-right text-gray-700 font-semibold">Tiền thắng</th>
                <th className="px-4 py-3 text-center text-gray-700 font-semibold">Trạng thái</th>
                <th className="px-4 py-3 text-left text-gray-700 font-semibold">Thời gian</th>
                <th className="px-4 py-3 text-center text-gray-700 font-semibold">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="10" className="px-4 py-8 text-center text-gray-400">
                    Đang tải...
                  </td>
                </tr>
              ) : bets.length === 0 ? (
                <tr>
                  <td colSpan="10" className="px-4 py-8 text-center text-gray-400">
                    Không có bet nào
                  </td>
                </tr>
              ) : (
                bets.map((bet) => (
                  <tr key={bet.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-900">#{bet.id}</td>
                    <td className="px-4 py-3 text-gray-900">
                      <div>{bet.username}</div>
                      <div className="text-xs text-gray-500">ID: {bet.userId}</div>
                    </td>
                    <td className="px-4 py-3 text-gray-900">
                      {adminBetService.getRegionName(bet.region)}
                    </td>
                    <td className="px-4 py-3 text-gray-900">
                      {adminBetService.getBetTypeName(bet.betType)}
                    </td>
                    <td className="px-4 py-3 text-gray-900">
                      <div className="text-sm">
                        {Array.isArray(bet.selectedNumbers)
                          ? bet.selectedNumbers.join(', ')
                          : bet.selectedNumbers}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right text-gray-900">
                      {adminBetService.formatMoney(bet.totalAmount)}
                    </td>
                    <td className="px-4 py-3 text-right text-green-600">
                      {bet.winAmount ? adminBetService.formatMoney(bet.winAmount) : '-'}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${adminBetService.getStatusClass(
                          bet.status
                        )}`}
                      >
                        {adminBetService.getStatusLabel(bet.status)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-900 text-sm">
                      {adminBetService.formatDateTime(bet.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-center gap-2">
                        {bet.status === 'PENDING' && (
                          <>
                            <button
                              onClick={() => handleUpdateBet(bet)}
                              className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 flex items-center justify-center"
                              title="Nhập kết quả xổ số"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDeleteBet(bet)}
                              className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 flex items-center justify-center"
                              title="Xóa và hoàn tiền"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </>
                        )}
                        {bet.status !== 'PENDING' && (
                          <span className="text-xs text-gray-400">Đã có kết quả</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Hiển thị {bets.length} / {pagination.totalElements} bet
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 0}
                className="px-3 py-1 bg-white border border-gray-300 text-gray-700 rounded hover:bg-gray-50 disabled:opacity-50"
              >
                ← Trước
              </button>
              <span className="px-3 py-1 text-gray-700">
                Trang {pagination.page + 1} / {pagination.totalPages}
              </span>
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page >= pagination.totalPages - 1}
                className="px-3 py-1 bg-white border border-gray-300 text-gray-700 rounded hover:bg-gray-50 disabled:opacity-50"
              >
                Sau →
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Update Modal */}
      {showUpdateModal && selectedBet && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Nhập kết quả xổ số cho Bet #{selectedBet.id}
            </h2>

            <div className="space-y-4">
              {/* Bet info */}
              <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
                <div className="text-gray-600">
                  <strong>User:</strong> {selectedBet.username} (ID: {selectedBet.userId})
                </div>
                <div className="text-gray-600">
                  <strong>Loại cược:</strong>{' '}
                  {adminBetService.getBetTypeName(selectedBet.betType)}
                </div>
                <div className="text-gray-600">
                  <strong>Số đã chọn:</strong>{' '}
                  {Array.isArray(selectedBet.selectedNumbers)
                    ? selectedBet.selectedNumbers.join(', ')
                    : selectedBet.selectedNumbers}
                </div>
                <div className="text-gray-600">
                  <strong>Tiền cược:</strong> {adminBetService.formatMoney(selectedBet.totalAmount)}
                </div>
              </div>

              {/* Winning numbers */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kết quả xổ số (cách nhau bởi dấu phẩy)
                </label>
                <input
                  type="text"
                  value={updateForm.winningNumbers}
                  onChange={(e) =>
                    setUpdateForm((prev) => ({ ...prev, winningNumbers: e.target.value }))
                  }
                  placeholder="Ví dụ: 12, 34, 56"
                  className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Nhập kết quả xổ số thực tế. Hệ thống sẽ tự động so sánh với số đã chọn của user để xác định thắng/thua.
                </p>
              </div>

              {/* Warning */}
              <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
                <p className="text-yellow-800 text-sm">
                  ⚠️ Admin chỉ nhập kết quả xổ số. Hệ thống sẽ tự động check thắng/thua khi đến thời gian quy định.
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowUpdateModal(false);
                    setSelectedBet(null);
                  }}
                  className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                >
                  Hủy
                </button>
                <button
                  onClick={handleSubmitUpdate}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Xác nhận
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBetManagement;

