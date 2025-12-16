import { Card, CardContent } from '../../../../components/ui/Card';
import { MessageSquare } from 'lucide-react';

const XocDiaResultChat = () => {
  return (
    <Card className="h-full">
      <CardContent className="p-4 h-full flex flex-col">
        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-200">
          <MessageSquare className="h-4 w-4 text-gray-600" />
          <h3 className="text-sm font-semibold text-gray-900">Chat Live</h3>
        </div>
        <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
          Chức năng chat sẽ được phát triển sau
        </div>
      </CardContent>
    </Card>
  );
};

export default XocDiaResultChat;

