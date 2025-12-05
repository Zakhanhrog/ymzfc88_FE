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

      <div className="h-[calc(100%-64px)] overflow-y-auto px-3 sm:px-4 md:px-6 py-6 space-y-6 text-gray-700">
        
        {/* Giới thiệu trò chơi */}
        <section className="space-y-3">
          <h3 className="text-base font-semibold text-gray-900">Giới thiệu trò chơi</h3>
          <p className="text-sm leading-relaxed">
            Xóc Đĩa là một trò chơi rất phổ biến ở khắp các ngõ hẻm ở Việt Nam, trò chơi dùng 4 đồng xu có mặt đỏ và trắng, đặt chung vào đĩa, sau đó dùng bát tay kín. Tiếp theo lắc/xóc đĩa với tốc độ nhanh, lắc ra con số chính là kết quả của tổ hợp cược trò chơi. Người chơi có thể đặt cược nhiều khu vực cược khác nhau cùng một lúc, tỷ lệ cược tất nhiên sẽ khác nhau.
          </p>
        </section>

        {/* Cách chơi */}
        <section className="space-y-3">
          <h3 className="text-base font-semibold text-gray-900">Cách chơi</h3>
          <ol className="space-y-2 text-sm leading-relaxed">
            <li>• Khi bắt đầu trận đấu sẽ xuất hiện thời gian đếm ngược cho việc đặt cược.</li>
            <li>• Khi đang đếm ngược, nhà cái sẽ để 4 đồng xu vào bát và bắt đầu lắc.</li>
            <li>• Kết thúc đếm ngược, nhà cái sẽ mở bát và công bố kết quả, sẽ hiển thị kết quả những hình ảnh tượng trưng mà người chơi đã cược.</li>
            <li>• Nếu kết quả đặt cược của người chơi giống với kết quả trong bát thì sẽ chiến thắng.</li>
          </ol>
        </section>

        {/* Tỷ lệ cược - Cược tổ hợp */}
        <section className="space-y-3">
          <h3 className="text-base font-semibold text-gray-900">Tỷ lệ cược</h3>
          
          {/* Table với 3 cột */}
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            {/* Table header */}
            <div className="bg-gray-100 p-3 grid grid-cols-[2fr_1.5fr_1fr] gap-2 text-xs font-semibold text-gray-700 border-b border-gray-300">
              <div>Cược tổ hợp</div>
              <div>Giải thích</div>
              <div className="text-right">Tỷ lệ thưởng</div>
            </div>

            <div className="p-3 space-y-3">
              {/* 4 xu đỏ */}
              <div className="grid grid-cols-[2fr_1.5fr_1fr] gap-2 items-center border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <span className="w-5 h-5 rounded-full bg-red-500"></span>
                    <span className="w-5 h-5 rounded-full bg-red-500"></span>
                    <span className="w-5 h-5 rounded-full bg-red-500"></span>
                    <span className="w-5 h-5 rounded-full bg-red-500"></span>
                  </div>
                </div>
                <div className="text-xs text-gray-600">4 xu đỏ</div>
                <div className="text-sm font-semibold text-green-600 text-right">1:12</div>
              </div>

              {/* 4 xu trắng */}
              <div className="grid grid-cols-[2fr_1.5fr_1fr] gap-2 items-center border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <span className="w-5 h-5 rounded-full bg-white border-2 border-gray-300"></span>
                    <span className="w-5 h-5 rounded-full bg-white border-2 border-gray-300"></span>
                    <span className="w-5 h-5 rounded-full bg-white border-2 border-gray-300"></span>
                    <span className="w-5 h-5 rounded-full bg-white border-2 border-gray-300"></span>
                  </div>
                </div>
                <div className="text-xs text-gray-600">4 xu trắng</div>
                <div className="text-sm font-semibold text-green-600 text-right">1:12</div>
              </div>

              {/* 3 xu đỏ + 1 xu trắng */}
              <div className="grid grid-cols-[2fr_1.5fr_1fr] gap-2 items-center border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <span className="w-5 h-5 rounded-full bg-red-500"></span>
                    <span className="w-5 h-5 rounded-full bg-red-500"></span>
                    <span className="w-5 h-5 rounded-full bg-red-500"></span>
                    <span className="w-5 h-5 rounded-full bg-white border-2 border-gray-300"></span>
                  </div>
                </div>
                <div className="text-xs text-gray-600">3 xu đỏ + 1 xu trắng</div>
                <div className="text-sm font-semibold text-green-600 text-right">1:2.6</div>
              </div>

              {/* 3 xu trắng + 1 xu đỏ */}
              <div className="grid grid-cols-[2fr_1.5fr_1fr] gap-2 items-center border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <span className="w-5 h-5 rounded-full bg-white border-2 border-gray-300"></span>
                    <span className="w-5 h-5 rounded-full bg-white border-2 border-gray-300"></span>
                    <span className="w-5 h-5 rounded-full bg-white border-2 border-gray-300"></span>
                    <span className="w-5 h-5 rounded-full bg-red-500"></span>
                  </div>
                </div>
                <div className="text-xs text-gray-600">3 xu trắng + 1 xu đỏ</div>
                <div className="text-sm font-semibold text-green-600 text-right">1:2.6</div>
              </div>

              {/* 2 xu đỏ + 2 xu trắng */}
              <div className="grid grid-cols-[2fr_1.5fr_1fr] gap-2 items-center border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <span className="w-5 h-5 rounded-full bg-red-500"></span>
                    <span className="w-5 h-5 rounded-full bg-red-500"></span>
                    <span className="w-5 h-5 rounded-full bg-white border-2 border-gray-300"></span>
                    <span className="w-5 h-5 rounded-full bg-white border-2 border-gray-300"></span>
                  </div>
                </div>
                <div className="text-xs text-gray-600">2 xu đỏ + 2 xu trắng</div>
                <div className="text-sm font-semibold text-green-600 text-right">1:1.5</div>
              </div>

              {/* 4 xu đỏ + 4 xu trắng */}
              <div className="grid grid-cols-[2fr_1.5fr_1fr] gap-2 items-center">
                <div className="flex items-center gap-2">
                  <div className="space-y-1">
                    <div className="flex gap-1">
                      <span className="w-5 h-5 rounded-full bg-red-500"></span>
                      <span className="w-5 h-5 rounded-full bg-red-500"></span>
                      <span className="w-5 h-5 rounded-full bg-red-500"></span>
                      <span className="w-5 h-5 rounded-full bg-red-500"></span>
                    </div>
                    <div className="flex gap-1">
                      <span className="w-5 h-5 rounded-full bg-white border-2 border-gray-300"></span>
                      <span className="w-5 h-5 rounded-full bg-white border-2 border-gray-300"></span>
                      <span className="w-5 h-5 rounded-full bg-white border-2 border-gray-300"></span>
                      <span className="w-5 h-5 rounded-full bg-white border-2 border-gray-300"></span>
                    </div>
                  </div>
                </div>
                <div className="text-xs text-gray-600">4 xu đỏ + 4 xu trắng</div>
                <div className="text-sm font-semibold text-green-600 text-right">1:6.5</div>
              </div>
            </div>
          </div>
        </section>

        {/* Hướng dẫn Lớn, Nhỏ, Lẻ, Chẵn */}
        <section className="space-y-3">
          <h3 className="text-base font-semibold text-gray-900">Hướng dẫn Lớn, Nhỏ, Lẻ, Chẵn</h3>
          <div className="space-y-2 text-sm leading-relaxed">
            <div className="py-1">
              <p><strong>Lớn:</strong> 2 trắng 2 đỏ, coi như không thắng không thua, tiền sẽ được hoàn trả lại cho người chơi của ván đó. <span className="text-green-600 font-semibold">Tỷ lệ thưởng: 1:0.97</span></p>
            </div>
            <div className="py-1">
              <p><strong>Nhỏ:</strong> 2 trắng 2 đỏ, coi như không thắng không thua, tiền sẽ được hoàn trả lại cho người chơi của ván đó. <span className="text-green-600 font-semibold">Tỷ lệ thưởng: 1:0.97</span></p>
            </div>
            <div className="py-1">
              <p><strong>Lẻ:</strong> <span className="text-green-600 font-semibold">Tỷ lệ thưởng: 1:0.97</span></p>
            </div>
            <div className="py-1">
              <p><strong>Chẵn:</strong> <span className="text-green-600 font-semibold">Tỷ lệ thưởng: 1:0.97</span></p>
            </div>
          </div>
        </section>

        {/* Tỷ lệ thưởng ngẫu nhiên */}
        <section className="space-y-3 bg-amber-50 rounded-xl p-4 border border-amber-200">
          <h3 className="text-base font-semibold text-amber-900">Tỷ lệ thưởng ngẫu nhiên</h3>
          <p className="text-sm leading-relaxed">
            Trò chơi chúng tôi cung cấp có tỉ lệ thưởng ngẫu nhiên cao hơn, nhằm cao tinh thần giải trí và phần thưởng, khi dùng thời gian cược, thì khu vực sẽ hiển thị tỉ lệ cược ngẫu nhiên. Nếu người chơi cược vào khu có tỷ lệ cược ngẫu nhiên, và kết quả mở thường là bên thắng, thì người chơi sẽ nhận được phần thưởng cao hơn.
          </p>
        </section>

        {/* Các mục cần chú ý */}
        <section className="space-y-3">
          <h3 className="text-base font-semibold text-gray-900">Các mục cần chú ý</h3>
          <ul className="space-y-2 text-sm leading-relaxed">
            <li className="flex gap-2">
              <span className="text-orange-500 font-bold">•</span>
              <p>Sau khi nhà cái lắc/xóc xong, mở bát ra sẽ xảy ra trường hợp "Các đồng xu xếp chồng lên nhau", không thể xác định kết quả. Nhà cái sẽ tách các xu đĩa lên nhau bằng một cây gậy chuyên dụng, sau đó sẽ xác định kết quả xóc đĩa của ván đó.</p>
            </li>
            <li className="flex gap-2">
              <span className="text-orange-500 font-bold">•</span>
              <p>Nếu sau khi xóc đĩa xong, nhà cái mở bát ra và chạm tay vào lắc/xóc đĩa khiến thay đổi, thì màu của đồng xu rơi xuống đất (hoặc trên bàn) chính là kết quả cuối cùng, các cược của ván đó được tính hợp lệ.</p>
            </li>
            <li className="flex gap-2">
              <span className="text-orange-500 font-bold">•</span>
              <p>Nếu nhà cái chưa lắc bát và xu trong khi chơi, hoặc mở bát trước khi đặt cược, thì ván đó sẽ không tính, tất cả tiền cược sẽ được trả lại.</p>
            </li>
            <li className="flex gap-2">
              <span className="text-orange-500 font-bold">•</span>
              <p>Nếu bất kỳ lỗi nào xuất hiện trong game, nhà cái sẽ hoàn trả tất cả tiền cược.</p>
            </li>
          </ul>
        </section>

        {/* Tuyên bố miễn trách nhiệm */}
        <section className="space-y-3 bg-gray-100 rounded-xl p-4">
          <h3 className="text-base font-semibold text-gray-900">Tuyên bố miễn trách nhiệm</h3>
          <p className="text-sm leading-relaxed">
            Không có lỗi phát sinh, toàn bộ tiền đặt cược và tiền thắng cược sẽ được hiển thị.
          </p>
        </section>

      </div>
    </aside>
  </>
);

export default XocDiaHelpDrawer;

