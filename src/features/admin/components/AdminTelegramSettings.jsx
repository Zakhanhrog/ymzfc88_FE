import { useState, useEffect } from 'react';
import Alert from '../../../components/ui/Alert';
import TelegramConfigForm from './telegram/TelegramConfigForm';
import TelegramConfigTable from './telegram/TelegramConfigTable';
import { adminService } from '../services/adminService';
import { message } from '../../../utils/notification';

const AdminTelegramSettings = () => {
  const [configs, setConfigs] = useState([]);
  const [activeConfig, setActiveConfig] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editingConfig, setEditingConfig] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchConfigs();
    fetchActiveConfig();
  }, []);

  const fetchConfigs = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await adminService.getAllTelegramConfigs();
      if (data.success) {
        setConfigs(data.data);
      }
    } catch (error) {
      setError(error.message || 'Không thể tải danh sách cấu hình');
    } finally {
      setLoading(false);
    }
  };

  const fetchActiveConfig = async () => {
    try {
      const data = await adminService.getActiveTelegramConfig();
      if (data.success && data.data) {
        setActiveConfig(data.data);
      }
    } catch (error) {
      // Don't show error for this
    }
  };

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      let data;
      if (editingConfig) {
        data = await adminService.updateTelegramConfig(editingConfig.id, formData);
      } else {
        data = await adminService.createTelegramConfig(formData);
      }
      
      if (data.success) {
        message.success(editingConfig ? 'Cập nhật thành công!' : 'Tạo mới thành công!');
        setEditingConfig(null);
        setShowForm(false);
        fetchConfigs();
        fetchActiveConfig();
      } else {
        message.error(data.message || 'Có lỗi xảy ra!');
      }
    } catch (error) {
      message.error(error.message || 'Có lỗi xảy ra!');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (config) => {
    setEditingConfig(config);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      const data = await adminService.deleteTelegramConfig(id);
      
      if (data.success) {
        message.success('Xóa thành công!');
        fetchConfigs();
        fetchActiveConfig();
      } else {
        message.error(data.message || 'Có lỗi xảy ra!');
      }
    } catch (error) {
      message.error(error.message || 'Có lỗi xảy ra!');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditingConfig(null);
    setShowForm(false);
  };

  const handleCreate = () => {
    setEditingConfig(null);
    setShowForm(true);
  };

  return (
    <div className="space-y-6">
      {error && (
        <Alert
          type="error"
          description={error}
          closable
          onClose={() => setError('')}
          className="rounded-2xl"
        />
      )}

      {/* Active Config Alert */}
      {activeConfig && (
        <Alert
          type="success"
          message="Cấu hình đang hoạt động"
          description={
            <div className="text-sm space-y-1 mt-2">
              <p><strong>Chat ID:</strong> {activeConfig.chatId}</p>
              <p><strong>Bot Token:</strong> {activeConfig.botToken?.substring(0, 10)}...</p>
              <p><strong>Mô tả:</strong> {activeConfig.description || 'Không có mô tả'}</p>
              <p><strong>Cập nhật lần cuối:</strong> {new Date(activeConfig.updatedAt).toLocaleString('vi-VN')}</p>
            </div>
          }
          className="rounded-2xl"
        />
      )}

      {/* Form Section */}
      {showForm && (
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {editingConfig ? 'Chỉnh sửa cấu hình' : 'Thêm cấu hình mới'}
          </h2>
          <TelegramConfigForm
            config={editingConfig}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            loading={loading}
          />
        </div>
      )}

      {/* Config List */}
      <TelegramConfigTable
        configs={configs}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onCreate={handleCreate}
      />
    </div>
  );
};

export default AdminTelegramSettings;

