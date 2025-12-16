import { useState, useEffect } from 'react';
import { message } from 'antd';
import adminBettingOddsService from '../services/adminBettingOddsService';
import BettingOddsHeader from './betting-odds/BettingOddsHeader';
import BettingOddsTabs from './betting-odds/BettingOddsTabs';
import BettingOddsTable from './betting-odds/BettingOddsTable';
import BettingOddsStats from './betting-odds/BettingOddsStats';
import Alert from '../../../components/ui/Alert';

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
        message.error(response.message);
        setNotification({ type: 'error', message: response.message });
      }
    } catch (error) {
      message.error('Lỗi khi tải dữ liệu tỷ lệ cược');
      setNotification({ type: 'error', message: 'Lỗi khi tải dữ liệu tỷ lệ cược' });
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
        message.success('Cập nhật tỷ lệ cược thành công!');
        setEditMode(false);
        await loadBettingOdds();
        setNotification({ type: 'success', message: 'Cập nhật tỷ lệ cược thành công!' });
      } else {
        message.error(response.message);
        setNotification({ type: 'error', message: response.message });
      }
    } catch (error) {
      message.error('Lỗi khi lưu thay đổi');
      setNotification({ type: 'error', message: 'Lỗi khi lưu thay đổi' });
    } finally {
      setSaving(false);
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
        <div className="flex justify-between items-center mb-4">
          <BettingOddsTabs
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
          <BettingOddsHeader
            editMode={editMode}
            saving={saving}
            loading={loading}
            onEditToggle={handleEditToggle}
            onSaveChanges={handleSaveChanges}
          />
        </div>

        <BettingOddsTable
          bettingOdds={bettingOdds}
          editMode={editMode}
          editedData={editedData}
          loading={loading}
          onFieldChange={handleFieldChange}
        />
      </div>

      <BettingOddsStats bettingOdds={bettingOdds} />
    </div>
  );
};

export default AdminBettingOddsManagement;

