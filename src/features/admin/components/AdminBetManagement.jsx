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


  const handleEditBet = (bet) => {
    // CHỈ cho phép edit bet có status = PENDING
    if (bet.status !== 'PENDING') {
      showNotification('Chỉ có thể chỉnh sửa bet đang chờ (PENDING)', 'error');
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

  // Cập nhật số trong cụm
  const updateGroupNumber = (groupIndex, numberIndex, value) => {
    const newGroupedNumbers = [...editForm.groupedNumbers];
    if (newGroupedNumbers[groupIndex]) {
      newGroupedNumbers[groupIndex][numberIndex] = value;
      setEditForm(prev => ({
        ...prev,
        groupedNumbers: newGroupedNumbers
      }));
    }
  };

  const handleSubmitEdit = async () => {
    try {
      if (!selectedBet) return;

      // Flatten các cụm thành array số
      const selectedNumbers = editForm.groupedNumbers
        .flat()
        .filter(num => num && num.trim().length > 0);

      if (selectedNumbers.length === 0) {
        showNotification('Vui lòng nhập ít nhất 1 số', 'error');
        return;
      }

      // Gửi số đã chọn mới
      const response = await adminBetService.updateBetSelectedNumbers(
        selectedBet.id,
        selectedNumbers
      );

      if (response.success) {
        showNotification('Đã cập nhật số đã chọn thành công', 'success');
        setShowEditModal(false);
        setSelectedBet(null);
        loadBets();
      }
    } catch (error) {
      showNotification(error.message || 'Không thể chỉnh sửa bet', 'error');
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
      showNotification(error.message || 'Không thể xóa bet', 'error');
    }
  };

  const handleCheckAllResults = async () => {
    try {
      const response = await adminBetService.checkAllBetResults();
      if (response.success) {
        showNotification('Đã kiểm tra kết quả tất cả bet đang chờ', 'success');
        loadBets(); // Refresh để hiển thị kết quả mới
      }
    } catch (error) {
      showNotification(error.message || 'Không thể kiểm tra kết quả', 'error');
    }
  };

  const showNotification = (message, type = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center gap-4">
        <button
          onClick={loadBets}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Làm mới
        </button>
        
        <button
          onClick={handleCheckAllResults}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
          title="Kiểm tra kết quả tất cả bet đang chờ"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Check Results
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
                        {adminBetService.formatSelectedNumbers(
                          bet.betType, 
                          Array.isArray(bet.selectedNumbers) 
                            ? bet.selectedNumbers 
                            : (bet.selectedNumbers || '').split(',').map(n => n.trim()).filter(n => n)
                        )}
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
                              onClick={() => handleEditBet(bet)}
                              className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 flex items-center justify-center"
                              title="Chỉnh sửa số đã chọn"
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


      {/* Edit Modal */}
      {showEditModal && selectedBet && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Chỉnh sửa số đã chọn - Bet #{selectedBet.id}
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
                  <strong>Tiền cược:</strong> {adminBetService.formatMoney(selectedBet.totalAmount)}
                </div>
              </div>

              {/* Selected numbers input - Grouped format */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Số đã chọn
                </label>
                
                {/* Hiển thị theo cụm hoặc 1 dòng */}
                {selectedBet.betType.includes('xien') || selectedBet.betType.includes('truot') ? (
                  // Hiển thị theo cụm cho xiên và trượt
                  editForm.groupedNumbers.map((group, groupIndex) => (
                    <div key={groupIndex} className="mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-medium text-gray-600">
                          Cụm {groupIndex + 1}:
                        </span>
                        <span className="text-xs text-gray-500">
                          ({group.length} số)
                        </span>
                      </div>
                      
                      {/* Các ô input cho cụm này */}
                      <div className="flex gap-2 flex-wrap">
                        {group.map((number, numberIndex) => (
                          <input
                            key={numberIndex}
                            type="text"
                            value={number || ''}
                            onChange={(e) => {
                              // Chỉ cho phép nhập số và giới hạn độ dài
                              const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 4);
                              updateGroupNumber(groupIndex, numberIndex, value);
                            }}
                            className="w-16 h-12 text-center border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg font-mono"
                            placeholder="00"
                            maxLength="4"
                          />
                        ))}
                      </div>
                    </div>
                  ))
                ) : (
                  // Hiển thị 1 dòng cho các loại cược khác (lô 2 số, 3 số, 4 số, etc.)
                  <div className="flex gap-2 flex-wrap">
                    {editForm.groupedNumbers.flat().map((number, index) => (
                      <input
                        key={index}
                        type="text"
                        value={number || ''}
                        onChange={(e) => {
                          // Chỉ cho phép nhập số và giới hạn độ dài
                          const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 4);
                          // Tìm group và index trong group
                          let currentIndex = 0;
                          for (let groupIndex = 0; groupIndex < editForm.groupedNumbers.length; groupIndex++) {
                            const group = editForm.groupedNumbers[groupIndex];
                            for (let numberIndex = 0; numberIndex < group.length; numberIndex++) {
                              if (currentIndex === index) {
                                updateGroupNumber(groupIndex, numberIndex, value);
                                return;
                              }
                              currentIndex++;
                            }
                          }
                        }}
                        className="w-16 h-12 text-center border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg font-mono"
                        placeholder="00"
                        maxLength="4"
                      />
                    ))}
                  </div>
                )}
                
                {/* Thông tin hướng dẫn */}
                <div className="text-xs text-gray-500 mt-3 space-y-1">
                  <p>
                    <strong>Hướng dẫn:</strong>
                  </p>
                  {selectedBet.betType.includes('xien') && (
                    <>
                      <p>• {selectedBet.betType === 'loto-xien-2' && 'Xiên 2: mỗi cụm 2 số, cả 2 số trong cụm phải trúng'}
                        {selectedBet.betType === 'loto-xien-3' && 'Xiên 3: mỗi cụm 3 số, cả 3 số trong cụm phải trúng'}
                        {selectedBet.betType === 'loto-xien-4' && 'Xiên 4: mỗi cụm 4 số, cả 4 số trong cụm phải trúng'}
                      </p>
                      <p>• Chỉ được sửa số, không được thêm/xóa cụm</p>
                    </>
                  )}
                  {selectedBet.betType.includes('truot') && (
                    <>
                      <p>• {selectedBet.betType === 'loto-truot-4' && 'Trượt 4: mỗi cụm 4 số, cả 4 số trong cụm đều không trúng'}
                        {selectedBet.betType === 'loto-truot-8' && 'Trượt 8: mỗi cụm 8 số, cả 8 số trong cụm đều không trúng'}
                        {selectedBet.betType === 'loto-truot-10' && 'Trượt 10: mỗi cụm 10 số, cả 10 số trong cụm đều không trúng'}
                      </p>
                      <p>• Chỉ được sửa số, không được thêm/xóa cụm</p>
                    </>
                  )}
                  {!selectedBet.betType.includes('xien') && !selectedBet.betType.includes('truot') && (
                    <>
                      <p>• Mỗi số được đánh riêng lẻ, hiển thị trên 1 dòng</p>
                      <p>• Chỉ được sửa số, không được thêm/xóa số</p>
                    </>
                  )}
                  <p>• Nhập tối đa 4 chữ số cho mỗi ô</p>
                </div>
              </div>

              {/* Warning */}
              <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
                <p className="text-yellow-800 text-sm">
                  ⚠️ Chỉ có thể chỉnh sửa số đã chọn của bet đang chờ (PENDING). 
                  Thay đổi này sẽ ảnh hưởng đến kết quả thắng/thua.
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedBet(null);
                  }}
                  className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                >
                  Hủy
                </button>
                <button
                  onClick={handleSubmitEdit}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Cập nhật
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

