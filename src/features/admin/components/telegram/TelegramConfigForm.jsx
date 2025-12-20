import { useState, useEffect } from 'react';
import { Button } from '../../../../components/ui/Button';
import { Input } from '../../../../components/ui/Input';
import { Textarea } from '../../../../components/ui/Textarea';
import Switch from '../../../../components/ui/Switch';

const TelegramConfigForm = ({ config, onSubmit, onCancel, loading }) => {
  const [formData, setFormData] = useState({
    botToken: '',
    chatId: '',
    enabled: true,
    description: ''
  });

  useEffect(() => {
    if (config) {
      setFormData({
        botToken: config.botToken || '',
        chatId: config.chatId || '',
        enabled: config.enabled !== undefined ? config.enabled : true,
        description: config.description || ''
      });
    } else {
      setFormData({
        botToken: '',
        chatId: '',
        enabled: true,
        description: ''
      });
    }
  }, [config]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Bot Token *
          </label>
          <Input
            type="text"
            value={formData.botToken}
            onChange={(e) => setFormData(prev => ({ ...prev, botToken: e.target.value }))}
            placeholder="Nhập bot token..."
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Chat ID *
          </label>
          <Input
            type="text"
            value={formData.chatId}
            onChange={(e) => setFormData(prev => ({ ...prev, chatId: e.target.value }))}
            placeholder="Nhập chat ID..."
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Mô tả
        </label>
        <Textarea
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Mô tả cấu hình..."
          rows={3}
        />
      </div>

      <div className="flex items-center">
        <Switch
          checked={formData.enabled}
          onChange={(checked) => setFormData(prev => ({ ...prev, enabled: checked }))}
        />
        <label className="ml-2 block text-sm text-gray-700">
          Kích hoạt cấu hình này
        </label>
      </div>

      <div className="flex gap-3 pt-4 border-t">
        {config && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={loading}
          >
            Hủy
          </Button>
        )}
        <Button
          type="submit"
          disabled={loading}
          className="ml-auto"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              Đang xử lý...
            </>
          ) : (
            config ? 'Cập nhật' : 'Tạo mới'
          )}
        </Button>
      </div>
    </form>
  );
};

export default TelegramConfigForm;

