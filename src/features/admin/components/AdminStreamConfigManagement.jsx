import React, { useState, useEffect } from 'react';
import { message } from 'antd';
import streamConfigService from '../../../services/streamConfigService';
import StreamConfigInfo from './stream-config/StreamConfigInfo';
import StreamConfigTable from './stream-config/StreamConfigTable';
import StreamConfigModal from './stream-config/StreamConfigModal';
import Alert from '../../../components/ui/Alert';
import { Card } from '../../../components/ui/Card';

const AdminStreamConfigManagement = () => {
  const [configs, setConfigs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' or 'edit'
  const [editingConfig, setEditingConfig] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [notification, setNotification] = useState(null);

  const gameTypes = [
    { value: 'XOC_DIA', label: 'Xóc Đĩa' },
    { value: 'SICBO', label: 'Tài Xỉu' }
  ];

  useEffect(() => {
    loadConfigs();
  }, []);

  const loadConfigs = async () => {
    setLoading(true);
    try {
      const response = await streamConfigService.getAllStreamConfigs();
      if (response.success) {
        setConfigs(response.data || []);
      } else {
        showNotification(response.message || 'Lỗi khi tải danh sách stream config', 'error');
      }
    } catch (error) {
      console.error('Error loading stream configs:', error);
      showNotification('Lỗi khi tải danh sách stream config', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingConfig(null);
    setModalMode('create');
    setModalVisible(true);
  };

  const handleEdit = (config) => {
    setEditingConfig(config);
    setModalMode('edit');
    setModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      const response = await streamConfigService.deleteStreamConfig(id);
      if (response.success) {
        showNotification('Xóa stream config thành công', 'success');
        loadConfigs();
      } else {
        showNotification(response.message || 'Lỗi khi xóa stream config', 'error');
      }
    } catch (error) {
      console.error('Error deleting stream config:', error);
      showNotification('Lỗi khi xóa stream config', 'error');
    }
  };

  const handleSubmit = async (configData) => {
    setSubmitting(true);
    try {
      let response;
      if (modalMode === 'edit' && editingConfig) {
        response = await streamConfigService.updateStreamConfig(editingConfig.id, configData);
      } else {
        response = await streamConfigService.createStreamConfig(configData);
      }

      if (response.success) {
        showNotification(
          modalMode === 'edit' ? 'Cập nhật stream config thành công' : 'Tạo stream config thành công',
          'success'
        );
        setModalVisible(false);
        setEditingConfig(null);
        loadConfigs();
      } else {
        showNotification(response.message || 'Lỗi khi lưu stream config', 'error');
      }
    } catch (error) {
      console.error('Error saving stream config:', error);
      showNotification('Lỗi khi lưu stream config', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const showNotification = (message, type = 'info') => {
    setNotification({ message, type });
  };

  useEffect(() => {
    let timer;
    if (notification) {
      timer = setTimeout(() => {
        setNotification(null);
      }, 5000);
    }
    return () => clearTimeout(timer);
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

      <Card className="rounded-2xl bg-white p-4 shadow-sm">
        <div className="mb-4">
          <StreamConfigInfo />
        </div>

          <StreamConfigTable
            configs={configs}
            loading={loading}
            gameTypes={gameTypes}
            onEdit={handleEdit}
            onDelete={handleDelete}
          onCreate={handleCreate}
          />
      </Card>

      <StreamConfigModal
        open={modalVisible}
        onClose={() => {
          setModalVisible(false);
          setEditingConfig(null);
        }}
        mode={modalMode}
        config={editingConfig}
        gameTypes={gameTypes}
        onSubmit={handleSubmit}
        loading={submitting}
      />
    </div>
  );
};

export default AdminStreamConfigManagement;
