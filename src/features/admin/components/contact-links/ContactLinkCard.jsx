import { useState } from 'react';
import { Button } from '../../../../components/ui/Button';
import { Input } from '../../../../components/ui/Input';
import { Save, X, Edit } from 'lucide-react';

const ContactLinkCard = ({ card, link, onUpdate, updating }) => {
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState(link || '');

  const handleSave = () => {
    if (editValue.trim()) {
      onUpdate(card.id, editValue.trim());
      setEditing(false);
    }
  };

  const handleCancel = () => {
    setEditValue(link || '');
    setEditing(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200">
      <div className="p-3">
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div className="flex-shrink-0">
            <img src={card.icon} alt={card.title} className="w-10 h-10" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3 className={`text-sm font-semibold ${card.textColor} mb-0.5`}>
              {card.title}
            </h3>
            <p className="text-xs text-gray-500 mb-2">
              {card.description}
            </p>

            {/* Link Section */}
            {editing ? (
              <div className="space-y-2">
                <Input
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  placeholder="Nhập link..."
                  disabled={updating}
                  className="text-sm h-8"
                />
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={handleSave}
                    disabled={updating}
                    className="flex-1 h-8 text-xs"
                  >
                    {updating ? (
                      <>
                        <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin mr-1" />
                        Đang lưu...
                      </>
                    ) : (
                      <>
                        <Save className="h-3 w-3 mr-1" />
                        Lưu
                      </>
                    )}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleCancel}
                    disabled={updating}
                    className="h-8"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ) : (
              <div>
                <div className="mb-1">
                  <span className="text-xs font-medium text-gray-700">Link hiện tại:</span>
                </div>
                <div className="p-1.5 bg-gray-50 rounded mb-1.5">
                  <p className="text-xs text-gray-600 break-all">
                    {link || 'Chưa có link'}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setEditing(true)}
                  className="w-full h-8 text-xs"
                >
                  <Edit className="h-3 w-3 mr-1" />
                  Chỉnh sửa
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactLinkCard;

