import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { adminService } from '../services/adminService';

const TelegramSettings = () => {
  const [configs, setConfigs] = useState([]);
  const [activeConfig, setActiveConfig] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    botToken: '',
    chatId: '',
    enabled: true,
    description: ''
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchConfigs();
    fetchActiveConfig();
  }, []);

  const fetchConfigs = async () => {
    try {
      const data = await adminService.getAllTelegramConfigs();
      if (data.success) {
        setConfigs(data.data);
      }
    } catch (error) {
      console.error('Error fetching configs:', error);
      toast.error(error.message);
    }
  };

  const fetchActiveConfig = async () => {
    try {
      const data = await adminService.getActiveTelegramConfig();
      if (data.success && data.data) {
        setActiveConfig(data.data);
      }
    } catch (error) {
      console.error('Error fetching active config:', error);
      // Don't show error toast for this as it's expected when no config exists
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let data;
      if (editingId) {
        data = await adminService.updateTelegramConfig(editingId, formData);
      } else {
        data = await adminService.createTelegramConfig(formData);
      }
      
      if (data.success) {
        toast.success(editingId ? 'Cập nhật thành công!' : 'Tạo mới thành công!');
        setFormData({ botToken: '', chatId: '', enabled: true, description: '' });
        setEditingId(null);
        fetchConfigs();
        fetchActiveConfig();
      } else {
        toast.error(data.message || 'Có lỗi xảy ra!');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.message || 'Có lỗi xảy ra!');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (config) => {
    setFormData({
      botToken: config.botToken,
      chatId: config.chatId,
      enabled: config.enabled,
      description: config.description || ''
    });
    setEditingId(config.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa cấu hình này?')) {
      return;
    }

    try {
      const data = await adminService.deleteTelegramConfig(id);
      
      if (data.success) {
        toast.success('Xóa thành công!');
        fetchConfigs();
        fetchActiveConfig();
      } else {
        toast.error(data.message || 'Có lỗi xảy ra!');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.message || 'Có lỗi xảy ra!');
    }
  };

  const handleCancel = () => {
    setFormData({ botToken: '', chatId: '', enabled: true, description: '' });
    setEditingId(null);
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Cài đặt Telegram</h1>
        <p className="text-gray-600">Quản lý cấu hình bot Telegram để nhận thông báo</p>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4">
          {editingId ? 'Chỉnh sửa cấu hình' : 'Thêm cấu hình mới'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bot Token *
              </label>
              <input
                type="text"
                value={formData.botToken}
                onChange={(e) => setFormData({...formData, botToken: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nhập bot token..."
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Chat ID *
              </label>
              <input
                type="text"
                value={formData.chatId}
                onChange={(e) => setFormData({...formData, chatId: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nhập chat ID..."
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mô tả
            </label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Mô tả cấu hình..."
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="enabled"
              checked={formData.enabled}
              onChange={(e) => setFormData({...formData, enabled: e.target.checked})}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="enabled" className="ml-2 block text-sm text-gray-700">
              Kích hoạt cấu hình này
            </label>
          </div>

          <div className="flex space-x-3">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Đang xử lý...' : (editingId ? 'Cập nhật' : 'Tạo mới')}
            </button>
            
            {editingId && (
              <button
                type="button"
                onClick={handleCancel}
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
              >
                Hủy
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Active Config */}
      {activeConfig && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold text-green-800 mb-2">Cấu hình đang hoạt động</h3>
          <div className="text-sm text-green-700">
            <p><strong>Chat ID:</strong> {activeConfig.chatId}</p>
            <p><strong>Bot Token:</strong> {activeConfig.botToken.substring(0, 10)}...</p>
            <p><strong>Mô tả:</strong> {activeConfig.description || 'Không có mô tả'}</p>
            <p><strong>Cập nhật lần cuối:</strong> {new Date(activeConfig.updatedAt).toLocaleString('vi-VN')}</p>
          </div>
        </div>
      )}

      {/* Config List */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Danh sách cấu hình</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Chat ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bot Token
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mô tả
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày tạo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {configs.map((config) => (
                <tr key={config.id} className={config.enabled ? 'bg-green-50' : ''}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {config.chatId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {config.botToken.substring(0, 15)}...
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      config.enabled 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {config.enabled ? 'Hoạt động' : 'Tạm dừng'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {config.description || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(config.createdAt).toLocaleDateString('vi-VN')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => handleEdit(config)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Chỉnh sửa
                    </button>
                    <button
                      onClick={() => handleDelete(config.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {configs.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Chưa có cấu hình nào
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TelegramSettings;
