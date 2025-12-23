import React, { useState, useEffect } from 'react';
import { message } from '../../../utils/notification';
import streamConfigService from '../../../services/streamConfigService';
import StreamConfigInfo from './stream-config/StreamConfigInfo';
import StreamConfigTable from './stream-config/StreamConfigTable';
import StreamConfigModal from './stream-config/StreamConfigModal';
import { Card } from '../../../components/ui/Card';

const AdminStreamConfigManagement = () => {
  const [configs, setConfigs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' or 'edit'
  const [editingConfig, setEditingConfig] = useState(null);
  const [submitting, setSubmitting] = useState(false);

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
        message.error(response.message || 'Lỗi khi tải danh sách stream config');
      }
    } catch (error) {
      console.error('Error loading stream configs:', error);
      message.error(error.message || 'Lỗi khi tải danh sách stream config');
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
        message.success('Xóa stream config thành công');
        loadConfigs();
      } else {
        message.error(response.message || 'Lỗi khi xóa stream config');
      }
    } catch (error) {
      console.error('Error deleting stream config:', error);
      message.error(error.message || 'Lỗi khi xóa stream config');
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
        message.success(
          modalMode === 'edit' ? 'Cập nhật stream config thành công' : 'Tạo stream config thành công'
        );
        setModalVisible(false);
        setEditingConfig(null);
        loadConfigs();
      } else {
        message.error(response.message || 'Lỗi khi lưu stream config');
      }
    } catch (error) {
      console.error('Error saving stream config:', error);
      message.error(error.message || 'Lỗi khi lưu stream config');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
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
