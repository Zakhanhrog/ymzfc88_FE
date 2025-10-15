const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto relative z-10">
      <div className="max-w-7xl mx-auto px-4 py-0">
        
        {/* Gaming Provider Logos */}
        <div className="mb-2 pt-4">
          <div className="flex justify-center">
            <img 
              src="/images/footer/anhtaphopnhieulogo.png" 
              alt="Gaming Providers" 
              className="w-full max-w-6xl object-contain"
            />
          </div>
        </div>

        {/* Legal and Licensing Text */}
        <div className="text-center mb-2">
          <p className="text-gray-800 text-sm leading-relaxed max-w-4xl mx-auto">
            AE888 được cấp 4 giấy phép hợp pháp đạt chuẩn quốc tế được cấp bởi Chính phủ Philippines (PAGCOR), 
            Chính phủ Malta (MGA), Quần đảo Virgin Vương quốc Anh (BVI) & Hiệp Hội Nhà Cái Anh (GAMBLING COMMISSION), 
            là một nhà cái cá cược được Hiệp Hội Cá Cược Quốc Tế công nhận. Trước khi đăng ký tham gia đặt cược, 
            vui lòng đảm bảo bạn đã đủ 18 tuổi.
          </p>
        </div>

        {/* Licensing Logos and Descriptions - Table Layout */}
        <div className="mb-2">
          <table className="w-full">
            <tbody>
              <tr className="align-top">
                {/* PAGCOR */}
                <td className="text-center w-1/4 px-2">
                  <div className="flex justify-center mb-1 h-16 overflow-hidden">
                    <img src="/images/footer/imgi_17_certificate1.png.avif" alt="PAGCOR" className="h-full w-auto object-cover" />
                  </div>
                  <p className="text-gray-800 text-sm font-medium">Giấy phép game cá cược Philippines (PAGCOR)</p>
                </td>

                {/* MGA */}
                <td className="text-center w-1/4 px-2">
                  <div className="flex justify-center mb-1 h-16 overflow-hidden">
                    <img src="/images/footer/imgi_18_certificate2.png.avif" alt="MGA" className="h-full w-auto object-cover" />
                  </div>
                  <p className="text-gray-800 text-sm font-medium">Giấy phép cá cược Malta (MGA)</p>
                </td>

                {/* BVI */}
                <td className="text-center w-1/4 px-2">
                  <div className="flex justify-center mb-1 h-16 overflow-hidden">
                    <img src="/images/footer/imgi_19_certificate3.png.avif" alt="BVI" className="h-full w-auto object-cover" />
                  </div>
                  <p className="text-gray-800 text-sm font-medium">Giấy phép Quần đảo Virgin Anh (BVI)</p>
                </td>

                {/* GAMBLING COMMISSION */}
                <td className="text-center w-1/4 px-2">
                  <div className="flex justify-center mb-1 h-16 overflow-hidden">
                    <img src="/images/footer/imgi_20_certificate4.png.avif" alt="GAMBLING COMMISSION" className="h-full w-auto object-cover" />
                  </div>
                  <p className="text-gray-800 text-sm font-medium">Uỷ ban GC Supervisory của Anh</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Footer Navigation Links */}
        <div className="text-center mb-2">
          <div className="flex flex-wrap justify-center gap-4 text-gray-800 text-sm">
            <a href="#" className="hover:text-gray-600 transition-colors">GIÚP ĐỠ NGƯỜI MỚI</a>
            <span className="text-gray-400">/</span>
            <a href="#" className="hover:text-gray-600 transition-colors">TRÁCH NHIỆM CÁ CƯỢC</a>
            <span className="text-gray-400">/</span>
            <a href="#" className="hover:text-gray-600 transition-colors">QUY ĐỊNH ĐIỀU KHOẢN</a>
            <span className="text-gray-400">/</span>
            <a href="#" className="hover:text-gray-600 transition-colors">CHÍNH SÁCH RIÊNG TƯ</a>
            <span className="text-gray-400">/</span>
            <a href="#" className="hover:text-gray-600 transition-colors">TẢI ỨNG DỤNG</a>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center">
          <p className="text-gray-600 text-sm">
            Copyright © 2024 All Rights Reserved
          </p>
        </div>
      </div>

      {/* Chat Button - Fixed position */}
      <div className="fixed bottom-6 right-6 z-50">
        <button className="bg-red-500 hover:bg-red-600 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg transition-colors">
          <span className="text-lg font-bold">C</span>
        </button>
      </div>
    </footer>
  );
};

export default Footer;
