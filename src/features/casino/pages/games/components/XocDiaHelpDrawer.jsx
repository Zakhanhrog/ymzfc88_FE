import { Icon } from '@iconify/react';

const XocDiaHelpDrawer = ({ isOpen, onClose }) => (
  <>
    <div
      className={`fixed inset-0 z-[98] transition-opacity duration-300 ${
        isOpen ? 'visible opacity-100 bg-black/40' : 'invisible opacity-0'
      }`}
      onClick={onClose}
    />
    <aside
      className={`fixed inset-0 md:inset-y-0 md:right-0 md:left-auto h-full w-full md:w-full md:max-w-[420px] bg-white shadow-2xl z-[99] transform transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <header className="h-16 px-5 flex items-center justify-between border-b border-gray-200">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="md:hidden flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
            aria-label="Đóng hướng dẫn"
          >
            <Icon icon="mdi:arrow-left" className="w-5 h-5" />
          </button>
          <h2 className="text-lg font-semibold text-gray-900">Hướng dẫn chơi Xóc Đĩa</h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="hidden md:flex w-9 h-9 items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
        >
          <Icon icon="mdi:close" className="w-5 h-5" />
        </button>
      </header>

      <div className="h-[calc(100%-64px)] overflow-y-auto px-3 sm:px-4 md:px-6 py-6 space-y-5 text-gray-700">
        <section className="space-y-3">
          <h3 className="text-base font-semibold text-gray-900">Tổng quan nhanh</h3>
          <p className="text-sm leading-relaxed">
            Xóc Đĩa sử dụng <strong>4 đồng xu</strong> với hai mặt đỏ / trắng. Dealer xóc liên tục
            rồi úp xuống, người chơi dự đoán tổng số mặt đỏ xuất hiện (0, 1, 2, 3 hoặc 4). Dựa trên
            tổng số đỏ, hệ thống suy ra kết quả cược Chẵn / Lẻ và Tài / Xỉu.
          </p>
        </section>

        <section className="space-y-3 rounded-2xl border border-emerald-100 bg-emerald-50/70 px-4 py-4">
          <h4 className="text-sm font-semibold text-emerald-700 uppercase tracking-wide">
            Các lựa chọn cược phổ biến
          </h4>
          <ul className="space-y-3 text-sm text-gray-700">
            <li>
              <p className="font-semibold text-gray-900">Chẵn / Lẻ</p>
              <p>
                Tổng đỏ <strong>chẵn</strong> (0, 2, 4) thắng cược Chẵn; tổng đỏ <strong>lẻ</strong> (1,
                3) thắng cược Lẻ.
              </p>
            </li>
            <li>
              <p className="font-semibold text-gray-900">Tài / Xỉu</p>
              <p>
                Tổng đỏ &ge; 3 (3, 4) là <strong>Tài</strong>; tổng đỏ &le; 1 (0, 1) là <strong>Xỉu</strong>.
                Tổng đỏ = 2 (2 trắng 2 đỏ) gọi là <strong>Hòa</strong>.
              </p>
            </li>
            <li>
              <p className="font-semibold text-gray-900">Cược số đỏ chính xác</p>
              <p>
                Đặt vào 0, 1, 2, 3 hoặc 4 đỏ. Đây là loại cược có tỷ lệ trả thưởng cao nhất (ví dụ 0
                đỏ hoặc 4 đỏ trả tới <strong>15x</strong>), vì xác suất thấp hơn.
              </p>
            </li>
            <li>
              <p className="font-semibold text-gray-900">Cược bộ ba / bộ bốn</p>
              <p>
                Dự đoán 3 đỏ hoặc 4 đỏ (tương ứng 1 trắng hoặc 0 trắng). Nếu đúng, bạn nhận thưởng
                lớn (từ <strong>7x</strong> đến <strong>15x</strong> tùy bàn).
              </p>
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
            Cách chơi từng bước
          </h4>
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>Chọn mệnh giá phỉnh ở thanh dưới.</li>
            <li>Chạm vào ô cược muốn đặt (có thể đặt nhiều ô).</li>
            <li>Nhấn <strong>“Chốt cược”</strong> để xác nhận trước khi hết thời gian.</li>
            <li>
              Khi dealer mở bát, hệ thống sẽ xét tổng số đỏ và tự động trả thưởng vào số điểm của
              bạn.
            </li>
          </ol>
        </section>

        <section className="space-y-2 text-sm">
          <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Lưu ý nhanh</h4>
          <ul className="list-disc list-inside space-y-1">
            <li>Có thể huỷ hoặc lặp lại cược gần nhất ngay trong phiên hiện tại.</li>
            <li>
              Tổng 2 đỏ (Hòa) trả thưởng theo bàn chơi: có thể hoàn tiền hoặc trả tỷ lệ riêng tùy cấu
              hình.
            </li>
            <li>
              Bảng thống kê bên phải giúp theo dõi chuỗi đỏ / trắng và chuỗi Tài / Xỉu gần nhất.
            </li>
          </ul>
        </section>
      </div>
    </aside>
  </>
);

export default XocDiaHelpDrawer;

