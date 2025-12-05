import { Icon } from '@iconify/react';

const SicboHelpDrawer = ({ isOpen, onClose, tableType = 'table1' }) => {
  const isTable1 = tableType === 'table1';
  const title = isTable1 ? 'Hướng Dẫn Bàn Thu Phế' : 'Hướng Dẫn Bàn Thu Bão';
  
  return (
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
            <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
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
        
        {/* Cách chơi */}
        <section className="space-y-3">
          <h3 className="text-base font-semibold text-gray-900">Cách chơi</h3>
          <p className="text-sm leading-relaxed">
            Tài xỉu là trò chơi dự đoán số điểm hoặc tổng số điểm của xí ngầu. Tài xỉu có cách chơi rất đa dạng, người chơi có thể đặt cược đồng thời ở nhiều khu vực.
          </p>
        </section>

        {/* Tài xỉu */}
        <section className="space-y-3">
          <h3 className="text-base font-semibold text-gray-900">Tài xỉu</h3>
          <div className="text-sm leading-relaxed space-y-2">
            <p>Người chơi dự đoán tổng số điểm của 3 hạt xí ngầu là "Tài" hoặc "Xỉu".</p>
            {isTable1 ? (
              <>
                <p>• Tổng số điểm từ 11 đến 18 là <strong>Tài</strong></p>
                <p>• Tổng số điểm từ 3 đến 10 là <strong>Xỉu</strong></p>
              </>
            ) : (
              <>
                <p>• Tổng số điểm từ 11 đến 17 là <strong>Tài</strong></p>
                <p>• Tổng số điểm từ 4 đến 10 là <strong>Xỉu</strong></p>
                <div className="bg-amber-50 rounded-lg p-3 mt-2 border border-amber-200">
                  <p className="font-semibold text-gray-900 mb-2">Trường hợp đặc biệt với Bão:</p>
                  <p>• Nếu 3 hạt xí ngầu là 1,1,1 hoặc 2,2,2 hoặc 3,3,3: cược <strong>Xỉu</strong> sẽ <strong>Hòa</strong>, cược <strong>Tài</strong> sẽ <strong>Thua</strong></p>
                  <p>• Nếu 3 hạt xí ngầu là 4,4,4 hoặc 5,5,5 hoặc 6,6,6: cược <strong>Tài</strong> sẽ <strong>Hòa</strong>, cược <strong>Xỉu</strong> sẽ <strong>Thua</strong></p>
                </div>
              </>
            )}
          </div>
        </section>

        {/* Chẵn lẻ */}
        <section className="space-y-3">
          <h3 className="text-base font-semibold text-gray-900">Chẵn lẻ</h3>
          <div className="text-sm leading-relaxed space-y-2">
            <p>Người chơi dự đoán tổng số điểm của 3 hạt xí ngầu là "chẵn" hoặc "lẻ".</p>
            <p>• Tổng số điểm 3, 5, 7, 9, 11, 13, 15, 17 là <strong>Lẻ</strong></p>
            <p>• Tổng số điểm 4, 6, 8, 10, 12, 14, 16, 18 là <strong>Chẵn</strong></p>
          </div>
        </section>

        {/* Số điểm (Ba Quân) */}
        <section className="space-y-3">
          <h3 className="text-base font-semibold text-gray-900">Số điểm (Ba Quân)</h3>
          <p className="text-sm leading-relaxed">
            Người chơi chọn 1 số từ 1 đến 6 để tiến hành đặt cược. Nếu con số được chọn xuất hiện trên mặt xí ngầu, khi đó tiền thưởng sẽ được nhân lên.
          </p>
        </section>

        {/* Số cặp */}
        <section className="space-y-3">
          <h3 className="text-base font-semibold text-gray-900">Số cặp</h3>
          <p className="text-sm leading-relaxed">
            Trong 15 cặp tổ hợp chọn 1 cặp để tiến hành đặt cược (ví dụ: 3 và 4, 2 và 6 v.v...), nếu như 2 con số được chọn đồng thời xuất hiện thì sẽ thắng.
          </p>
        </section>

        {/* Tổng Số */}
        <section className="space-y-3">
          <h3 className="text-base font-semibold text-gray-900">Tổng Số</h3>
          <p className="text-sm leading-relaxed">
            Dự đoán tổng số điểm của 3 hạt xí ngầu để tiến hành đặt cược, khả năng sẽ xuất hiện tổng số từ 4 đến 17, <strong>Không bao gồm 3 và 18.</strong>
          </p>
        </section>

        {/* Cặp đôi */}
        <section className="space-y-3">
          <h3 className="text-base font-semibold text-gray-900">Cặp đôi</h3>
          <p className="text-sm leading-relaxed">
            Chọn các cặp đôi có thể xuất hiện để tiến hành đặt cược (ví dụ: đôi 3), nếu như cặp đôi đó được chọn xuất hiện thì sẽ được tính là thắng.
          </p>
        </section>

        {/* Bộ ba đồng nhất (Bão Đơn) */}
        <section className="space-y-3">
          <h3 className="text-base font-semibold text-gray-900">Bộ ba đồng nhất (Bão Đơn)</h3>
          <p className="text-sm leading-relaxed">
            Còn được gọi là "Bão". Dự đoán con số cùng lúc xuất hiện trên mặt xí ngầu để tiến hành đặt cược (ví dụ: Ba con 2). Nếu kết quả xuất hiện trùng với dự đoán sẽ được tính là thắng.
          </p>
        </section>

        {/* Bảng tỷ lệ cược */}
        <section className="space-y-3">
          <h3 className="text-base font-semibold text-gray-900">Tỷ lệ cược</h3>
          
          {/* Table */}
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            {/* Table header */}
            <div className="bg-gray-100 p-3 grid grid-cols-[1.5fr_2fr_1fr] gap-2 text-xs font-semibold text-gray-700 border-b border-gray-300">
              <div>Loại cược</div>
              <div>Chú thích</div>
              <div className="text-right">Tỉ lệ không bao gồm tiền cược</div>
            </div>

            <div className="p-3 space-y-2 text-xs">
              {/* Tài */}
              <div className="grid grid-cols-[1.5fr_2fr_1fr] gap-2 items-center border-b border-gray-100 pb-2">
                <div className="font-medium">Tài</div>
                <div className="text-gray-600">
                  {isTable1 ? 'Tổng số điểm 11 đến 18' : 'Tổng số điểm 11 đến 17 (Trừ bão)'}
                </div>
                <div className="text-sm font-semibold text-green-600 text-right">1:0.97</div>
              </div>

              {/* Xỉu */}
              <div className="grid grid-cols-[1.5fr_2fr_1fr] gap-2 items-center border-b border-gray-100 pb-2">
                <div className="font-medium">Xỉu</div>
                <div className="text-gray-600">
                  {isTable1 ? 'Tổng số điểm 3 đến 10' : 'Tổng số điểm 4 đến 10 (Trừ bão)'}
                </div>
                <div className="text-sm font-semibold text-green-600 text-right">1:0.97</div>
              </div>

              {/* Lẻ */}
              <div className="grid grid-cols-[1.5fr_2fr_1fr] gap-2 items-center border-b border-gray-100 pb-2">
                <div className="font-medium">Lẻ</div>
                <div className="text-gray-600">Tổng số điểm 3, 5, 7, 9, 11, 13, 15 & 17 (Trừ bão)</div>
                <div className="text-sm font-semibold text-green-600 text-right">1:0.97</div>
              </div>

              {/* Chẵn */}
              <div className="grid grid-cols-[1.5fr_2fr_1fr] gap-2 items-center border-b border-gray-100 pb-2">
                <div className="font-medium">Chẵn</div>
                <div className="text-gray-600">Tổng số điểm 4, 6, 8, 10, 12, 14, 16 & 18 (Trừ bão)</div>
                <div className="text-sm font-semibold text-green-600 text-right">1:0.97</div>
              </div>

              {/* Tổng số điểm header */}
              <div className="font-semibold text-gray-900 pt-2">Tổng số điểm</div>

              {/* 4 hoặc 17 */}
              <div className="grid grid-cols-[1.5fr_2fr_1fr] gap-2 items-center border-b border-gray-100 pb-2">
                <div className="font-medium">4 hoặc 17</div>
                <div className="text-gray-600">Tổng số điểm 4 hoặc 17</div>
                <div className="text-sm font-semibold text-green-600 text-right">1:30</div>
              </div>

              {/* 5 hoặc 16 */}
              <div className="grid grid-cols-[1.5fr_2fr_1fr] gap-2 items-center border-b border-gray-100 pb-2">
                <div className="font-medium">5 hoặc 16</div>
                <div className="text-gray-600">Tổng số điểm 5 hoặc 16</div>
                <div className="text-sm font-semibold text-green-600 text-right">1:18</div>
              </div>

              {/* 6 hoặc 15 */}
              <div className="grid grid-cols-[1.5fr_2fr_1fr] gap-2 items-center border-b border-gray-100 pb-2">
                <div className="font-medium">6 hoặc 15</div>
                <div className="text-gray-600">Tổng số điểm 6 hoặc 15</div>
                <div className="text-sm font-semibold text-green-600 text-right">1:14</div>
              </div>

              {/* 7 hoặc 14 */}
              <div className="grid grid-cols-[1.5fr_2fr_1fr] gap-2 items-center border-b border-gray-100 pb-2">
                <div className="font-medium">7 hoặc 14</div>
                <div className="text-gray-600">Tổng số điểm 7 hoặc 14</div>
                <div className="text-sm font-semibold text-green-600 text-right">1:12</div>
              </div>

              {/* 8 hoặc 13 */}
              <div className="grid grid-cols-[1.5fr_2fr_1fr] gap-2 items-center border-b border-gray-100 pb-2">
                <div className="font-medium">8 hoặc 13</div>
                <div className="text-gray-600">Tổng số điểm 8 hoặc 13</div>
                <div className="text-sm font-semibold text-green-600 text-right">1:8</div>
              </div>

              {/* 9, 10, 11 hoặc 12 */}
              <div className="grid grid-cols-[1.5fr_2fr_1fr] gap-2 items-center">
                <div className="font-medium">9, 10, 11 hoặc 12</div>
                <div className="text-gray-600">Tổng số điểm 9, 10, 11 hoặc 12</div>
                <div className="text-sm font-semibold text-green-600 text-right">1:6</div>
              </div>
            </div>
          </div>

          {/* Tỉ lệ Tổ Hợp */}
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden mt-3">
            <div className="bg-gray-100 p-3 grid grid-cols-[1.5fr_2fr_1fr] gap-2 text-xs font-semibold text-gray-700 border-b border-gray-300">
              <div>Loại cược</div>
              <div>Mô tả</div>
              <div className="text-right">Tỉ lệ</div>
            </div>

            <div className="p-3 space-y-2 text-xs">
              {/* Bộ ba đồng nhất */}
              <div className="grid grid-cols-[1.5fr_2fr_1fr] gap-2 items-center border-b border-gray-100 pb-2">
                <div className="font-medium">Bộ ba đồng nhất</div>
                <div className="text-gray-600">Xuất hiện 3 hạt xí ngầu giống nhau được chỉ định</div>
                <div className="text-sm font-semibold text-green-600 text-right">1:120</div>
              </div>

              {/* Cặp đôi */}
              <div className="grid grid-cols-[1.5fr_2fr_1fr] gap-2 items-center border-b border-gray-100 pb-2">
                <div className="font-medium">Cặp đôi</div>
                <div className="text-gray-600">Cặp đôi được đặt cược phải xuất hiện trong kết quả</div>
                <div className="text-sm font-semibold text-green-600 text-right">1:8</div>
              </div>

              {/* Số cặp */}
              <div className="grid grid-cols-[1.5fr_2fr_1fr] gap-2 items-center">
                <div className="font-medium">Số cặp</div>
                <div className="text-gray-600">Hai con số được đặt cược phải xuất hiện trong kết quả</div>
                <div className="text-sm font-semibold text-green-600 text-right">1:5</div>
              </div>
            </div>
          </div>

          {/* Số điểm (Ba Quân) */}
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden mt-3">
            <div className="bg-gray-100 p-3 grid grid-cols-[2fr_1fr] gap-2 text-xs font-semibold text-gray-700 border-b border-gray-300">
              <div>Số lần xuất hiện</div>
              <div className="text-right">Tỉ lệ</div>
            </div>

            <div className="p-3 space-y-2 text-xs">
              <div className="grid grid-cols-[2fr_1fr] gap-2 items-center border-b border-gray-100 pb-2">
                <div className="text-gray-600">Con số được đặt cược xuất hiện 1 lần</div>
                <div className="text-sm font-semibold text-green-600 text-right">1:1</div>
              </div>

              <div className="grid grid-cols-[2fr_1fr] gap-2 items-center border-b border-gray-100 pb-2">
                <div className="text-gray-600">Con số được đặt cược xuất hiện 2 lần</div>
                <div className="text-sm font-semibold text-green-600 text-right">1:2</div>
              </div>

              <div className="grid grid-cols-[2fr_1fr] gap-2 items-center">
                <div className="text-gray-600">Con số được đặt cược xuất hiện 3 lần</div>
                <div className="text-sm font-semibold text-green-600 text-right">1:3</div>
              </div>
            </div>
          </div>
        </section>

        {/* Tỷ lệ cược ngẫu nhiên */}
        <section className="space-y-3 bg-amber-50 rounded-xl p-4 border border-amber-200">
          <h3 className="text-base font-semibold text-amber-900">Tỷ lệ cược ngẫu nhiên</h3>
          <p className="text-sm leading-relaxed">
            Chúng tôi cung cấp trò chơi với tỉ lệ cược ngẫu nhiên cao hơn nhằm nâng cao tính chất trò chơi và phần thưởng thêm. Khi thời gian đặt cược dừng lại, trên bảng cược sẽ hiển thị tỉ lệ cược ngẫu nhiên. Nếu người chơi đặt cược vào ô tỉ lệ cược ngẫu nhiên đồng thời khi mở kết quả là người chiến thắng thì người chơi sẽ được trả nhiều tiền hơn.
          </p>
        </section>

        {/* Lưu ý */}
        <section className="space-y-3">
          <h3 className="text-base font-semibold text-gray-900">Lưu ý</h3>
          <ul className="space-y-2 text-sm leading-relaxed">
            <li className="flex gap-2">
              <span className="text-orange-500 font-bold">•</span>
              <p>Nếu kết quả mở ra có trường hợp hột xí ngầu bị đè lên nhau hoặc chồng chéo không bằng phẳng và không thể phán đoán được kết quả. Sẽ tính là hoà hai mặt, đồng thời hoàn trả lại tất cả số tiền đặt cược trong ván đó.</p>
            </li>
            <li className="flex gap-2">
              <span className="text-orange-500 font-bold">•</span>
              <p>Nếu gặp phải trường hợp thiết bị phần cứng của cốc xí ngầu bị gặp sự cố dẫn đến không thể nhận được kết quả bình thường, thì ván chơi đó sẽ bị huỷ, đồng thời hoàn trả lại tất cả số tiền đặt cược trong ván đó.</p>
            </li>
            <li className="flex gap-2">
              <span className="text-orange-500 font-bold">•</span>
              <p>Nếu trong trò chơi xuất hiện lỗi sự cố, tất cả cược đặt và lợi ích sẽ bị huỷ.</p>
            </li>
            <li className="flex gap-2">
              <span className="text-orange-500 font-bold">•</span>
              <p>Nếu có kết toán sai, sẽ căn cứ theo kết quả video giám sát để kết toán.</p>
            </li>
          </ul>
        </section>

      </div>
    </aside>
  </>
  );
};

export default SicboHelpDrawer;

