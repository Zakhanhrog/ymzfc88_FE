import { useState, useEffect } from 'react';
import { Percent, PercentCircle } from 'lucide-react';
import { adminService } from '../services/adminService';
import Tabs from '../../../components/ui/Tabs';
import { message } from '../../../utils/notification';
import CommissionSettingsTab from './system-settings/CommissionSettingsTab';
import GameRefundTab from './system-settings/GameRefundTab';

const AdminSystemSettings = () => {
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({});
  const [activeTab, setActiveTab] = useState('commission');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const response = await adminService.getAllSystemSettings();
      if (response.success) {
        // Convert array to object by settingKey
        const settingsMap = {};
        response.data.forEach(setting => {
          settingsMap[setting.settingKey] = setting.settingValue;
        });
        setSettings(settingsMap);
      } else {
        message.error(response.message || 'Không thể tải cài đặt');
      }
    } catch (error) {
      message.error(error.message || 'Lỗi khi tải cài đặt');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  const tabItems = [
    {
      key: 'commission',
      label: 'Cài đặt hoa hồng',
      icon: <Percent className="h-4 w-4" />,
      children: (
        <div className="space-y-4">
          <CommissionSettingsTab
            settings={settings}
            loading={loading}
            onRefresh={loadSettings}
          />
        </div>
      )
    },
    {
      key: 'game-refund',
      label: 'Hoàn trả trò chơi',
      icon: <PercentCircle className="h-4 w-4" />,
      children: (
        <div className="space-y-4">
          <GameRefundTab
            settings={settings}
            loading={loading}
            onRefresh={loadSettings}
          />
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <Tabs
          items={tabItems}
          activeKey={activeTab}
          onChange={handleTabChange}
          tabBarClassName="border-0 mb-4"
          contentClassName="pt-0"
        />
      </div>
    </div>
  );
};

export default AdminSystemSettings;
