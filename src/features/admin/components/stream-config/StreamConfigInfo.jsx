import Alert from '../../../../components/ui/Alert';
import { Info } from 'lucide-react';

const StreamConfigInfo = () => {
  return (
    <Alert
      type="info"
      message="Hướng dẫn sử dụng"
      description={
        <div className="space-y-2 text-sm">
          <div>
            <strong>Cấu hình OBS:</strong>
          </div>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Server: <code className="bg-gray-100 px-1 py-0.5 rounded">rtmp://rtmp.tathiet168.com/live</code></li>
            <li>Stream Key: Nhập stream key đã tạo ở bảng bên dưới (ví dụ: xocdia, sicbo-table1)</li>
          </ul>
          <div className="mt-2">
            <strong>Lưu ý:</strong> Stream key phải khớp với stream key trong OBS để video hiển thị đúng trên website.
          </div>
        </div>
      }
      showIcon
      closable={false}
    />
  );
};

export default StreamConfigInfo;

