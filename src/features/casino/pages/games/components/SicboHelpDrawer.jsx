import { Icon } from '@iconify/react';

const SicboHelpDrawer = ({ isOpen, onClose }) => (
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
          <h2 className="text-lg font-semibold text-gray-900">Hướng dẫn chơi Sicbo</h2>
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
            Sicbo sử dụng <strong>3 viên xúc xắc</strong>. Bạn đặt cược vào kết quả của mỗi phiên
            quay (tổng điểm, lớn/nhỏ, chẵn/lẻ, bộ ba, v.v.). Sau khi dealer công bố kết quả, hệ
            thống tự động xét thắng thua theo loại cược bạn chọn.
          </p>
        </section>

        <section className="space-y-3 rounded-2xl border border-emerald-100 bg-emerald-50/70 px-4 py-4">
          <h4 className="text-sm font-semibold text-emerald-700 uppercase tracking-wide">
            Các lựa chọn cược phổ biến
          </h4>
          <ul className="space-y-3 text-sm text-gray-700">
            <li>
              <p className="font-semibold text-gray-900">Tài / Xỉu</p>
              <p>
                Tổng điểm 3 viên nằm trong 11-17 là <strong>Tài</strong>, 4-10 là <strong>Xỉu</strong>.
                Nếu ra bộ ba (3/18) vẫn tính theo loại cược của bạn (bàn 2 hoàn tiền khi trúng bộ ba
                đặc biệt).
              </p>
            </li>
            <li>
              <p className="font-semibold text-gray-900">Chẵn / Lẻ</p>
              <p>
                Tổng điểm chẵn thắng cược <strong>Chẵn</strong>; tổng lẻ thắng cược <strong>Lẻ</strong>.
              </p>
            </li>
            <li>
              <p className="font-semibold text-gray-900">Tổng điểm cụ thể</p>
              <p>
                Chọn chính xác tổng (ví dụ 8, 13, 16...). Mỗi tổng có tỷ lệ trả thưởng riêng, lên đến{' '}
                <strong>30x</strong> khi hiếm gặp.
              </p>
            </li>
            <li>
              <p className="font-semibold text-gray-900">Cược một mặt</p>
              <p>
                Chọn mặt số cụ thể (1-6). Xuất hiện 1 lần ăn theo tỷ lệ gốc, ra bộ ba mặt đó sẽ được
                thưởng <strong>x3</strong>.
              </p>
            </li>
            <li>
              <p className="font-semibold text-gray-900">Bộ ba cụ thể</p>
              <p>
                Dự đoán cả 3 viên giống nhau (ví dụ 2-2-2). Nếu đúng, bạn nhận thưởng lớn (thường từ{' '}
                <strong>20x</strong> trở lên).
              </p>
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
            Cách chơi từng bước
          </h4>
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>Chọn mệnh giá phỉnh ở thanh bên dưới.</li>
            <li>Nhấn vào ô cược bạn muốn đặt. Có thể đặt nhiều ô cùng lúc.</li>
            <li>
              Nhấn <strong>“Chốt cược”</strong> để xác nhận trước khi hết thời gian.
            </li>
            <li>Khi dealer công bố kết quả, hệ thống sẽ tự động trả thưởng vào số điểm của bạn.</li>
          </ol>
        </section>

        <section className="space-y-2 text-sm">
          <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
            Lưu ý nhanh
          </h4>
          <ul className="list-disc list-inside space-y-1">
            <li>Có thể huỷ cược trước khi hết thời gian nếu muốn chỉnh lại.</li>
            <li>
              Bàn số 2 hoàn tiền Tài khi ra bộ ba lớn (4-5-6) và Xỉu khi ra bộ ba nhỏ (1-2-3).
            </li>
            <li>Lịch sử kết quả hiển thị bên phải giúp bạn theo dõi chuỗi gần nhất.</li>
          </ul>
        </section>
      </div>
    </aside>
  </>
);

export default SicboHelpDrawer;

