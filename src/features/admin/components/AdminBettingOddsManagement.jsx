import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import adminBettingOddsService from '../services/adminBettingOddsService';

const AdminBettingOddsManagement = () => {
  const [activeTab, setActiveTab] = useState('MIEN_BAC');
  const [bettingOdds, setBettingOdds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editedData, setEditedData] = useState({});
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    loadBettingOdds();
  }, [activeTab]);

  const loadBettingOdds = async () => {
    try {
      setLoading(true);
      const response = await adminBettingOddsService.getBettingOddsByRegion(activeTab);
      
      if (response.success) {
        setBettingOdds(response.data || []);
        // Initialize edited data
        const initialEditedData = {};
        (response.data || []).forEach(odds => {
          initialEditedData[odds.id] = {
            ...odds
          };
        });
        setEditedData(initialEditedData);
      } else {
        showNotification('error', response.message);
      }
    } catch (error) {
      console.error('Error loading betting odds:', error);
      showNotification('error', 'Lỗi khi tải dữ liệu tỷ lệ cược');
    } finally {
      setLoading(false);
    }
  };

  const handleEditToggle = () => {
    if (editMode) {
      // Cancel edit - reset data
      const resetData = {};
      bettingOdds.forEach(odds => {
        resetData[odds.id] = { ...odds };
      });
      setEditedData(resetData);
    }
    setEditMode(!editMode);
  };

  const handleFieldChange = (id, field, value) => {
    setEditedData(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value
      }
    }));
  };

  const handleSaveChanges = async () => {
    try {
      setSaving(true);
      
      // Prepare data for batch update
      const updateList = Object.values(editedData).map(odds => ({
        region: odds.region,
        betType: odds.betType,
        betName: odds.betName,
        description: odds.description,
        odds: parseInt(odds.odds),
        pricePerPoint: parseInt(odds.pricePerPoint),
        isActive: odds.isActive
      }));

      const response = await adminBettingOddsService.batchUpdateBettingOdds(updateList);
      
      if (response.success) {
        showNotification('success', 'Cập nhật tỷ lệ cược thành công!');
        setEditMode(false);
        await loadBettingOdds();
      } else {
        showNotification('error', response.message);
      }
    } catch (error) {
      console.error('Error saving changes:', error);
      showNotification('error', 'Lỗi khi lưu thay đổi');
    } finally {
      setSaving(false);
    }
  };

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(value);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Quản lý Tỷ lệ Cược</h2>
          <p className="text-gray-600 mt-1">Cấu hình tỷ lệ cược và đơn giá cho các loại hình xổ số</p>
        </div>
        <div className="flex gap-2">
          {editMode ? (
            <>
              <button
                onClick={handleEditToggle}
                disabled={saving}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50"
              >
                Hủy
              </button>
              <button
                onClick={handleSaveChanges}
                disabled={saving}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {saving ? (
                  <>
                    <Icon icon="mdi:loading" className="w-5 h-5 animate-spin" />
                    Đang lưu...
                  </>
                ) : (
                  <>
                    <Icon icon="mdi:content-save" className="w-5 h-5" />
                    Lưu thay đổi
                  </>
                )}
              </button>
            </>
          ) : (
            <button
              onClick={handleEditToggle}
              disabled={loading}
              className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              <Icon icon="mdi:pencil" className="w-5 h-5" />
              Chỉnh sửa
            </button>
          )}
        </div>
      </div>

      {/* Notification */}
      {notification && (
        <div className={`mb-4 p-4 rounded-lg ${
          notification.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          <div className="flex items-center gap-2">
            <Icon 
              icon={notification.type === 'success' ? 'mdi:check-circle' : 'mdi:alert-circle'} 
              className="w-5 h-5" 
            />
            <span>{notification.message}</span>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab('MIEN_BAC')}
          className={`px-6 py-3 rounded-lg font-medium transition-colors ${
            activeTab === 'MIEN_BAC'
              ? 'bg-[#D30102] text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Miền Bắc
        </button>
        <button
          onClick={() => setActiveTab('MIEN_TRUNG_NAM')}
          className={`px-6 py-3 rounded-lg font-medium transition-colors ${
            activeTab === 'MIEN_TRUNG_NAM'
              ? 'bg-[#D30102] text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Miền Trung & Nam
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <Icon icon="mdi:loading" className="w-12 h-12 animate-spin mx-auto text-gray-400" />
            <p className="mt-4 text-gray-600">Đang tải dữ liệu...</p>
          </div>
        ) : bettingOdds.length === 0 ? (
          <div className="p-12 text-center">
            <Icon icon="mdi:database-off" className="w-12 h-12 mx-auto text-gray-400" />
            <p className="mt-4 text-gray-600">Chưa có dữ liệu tỷ lệ cược. Vui lòng tạo mới từng loại cược.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Loại cược
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tên
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mô tả
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tỷ lệ (1 ăn)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Đơn giá/điểm
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {bettingOdds.map((odds) => (
                  <tr key={odds.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                        {odds.betType}
                      </code>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editMode ? (
                        <input
                          type="text"
                          value={editedData[odds.id]?.betName || ''}
                          onChange={(e) => handleFieldChange(odds.id, 'betName', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <span className="text-sm font-medium text-gray-900">{odds.betName}</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {editMode ? (
                        <input
                          type="text"
                          value={editedData[odds.id]?.description || ''}
                          onChange={(e) => handleFieldChange(odds.id, 'description', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <span className="text-sm text-gray-600">{odds.description}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editMode ? (
                        <input
                          type="number"
                          min="1"
                          value={editedData[odds.id]?.odds || ''}
                          onChange={(e) => handleFieldChange(odds.id, 'odds', e.target.value)}
                          className="w-24 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <span className="text-sm font-semibold text-green-600">{odds.odds}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editMode ? (
                        <input
                          type="number"
                          min="1000"
                          step="1000"
                          value={editedData[odds.id]?.pricePerPoint || ''}
                          onChange={(e) => handleFieldChange(odds.id, 'pricePerPoint', e.target.value)}
                          className="w-32 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <span className="text-sm font-medium text-gray-900">
                          {formatCurrency(odds.pricePerPoint)}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editMode ? (
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={editedData[odds.id]?.isActive || false}
                            onChange={(e) => handleFieldChange(odds.id, 'isActive', e.target.checked)}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <span className="ml-2 text-sm text-gray-700">Active</span>
                        </label>
                      ) : (
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          odds.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {odds.isActive ? 'Active' : 'Inactive'}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Summary */}
      {bettingOdds.length > 0 && (
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center gap-2 text-blue-800">
            <Icon icon="mdi:information" className="w-5 h-5" />
            <span className="text-sm">
              Tổng số: <strong>{bettingOdds.length}</strong> loại cược | 
              Active: <strong>{bettingOdds.filter(o => o.isActive).length}</strong> | 
              Inactive: <strong>{bettingOdds.filter(o => !o.isActive).length}</strong>
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBettingOddsManagement;

