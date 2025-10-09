import { Icon } from '@iconify/react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto relative z-10">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-8 py-8">
        <div className="grid grid-cols-4 gap-6">
          {/* Left - Branding */}
          <div className="space-y-4">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <img src="/logo.webp" alt="AE888" className="h-10" />
            </div>
            
            {/* Copyright */}
            <p className="text-gray-400 text-sm">
              Copyright © AE888 Reserved
            </p>
            
            {/* Gaming Curacao Badge */}
            <div className="flex items-center">
              <img src="/footer/GAMINGCURACAO.png" alt="Gaming Curacao" className="h-8" />
            </div>
          </div>

          {/* Games Column */}
          <div>
            <h3 className="footer-heading font-semibold text-black mb-4 text-md">Trò chơi</h3>
            <div className="grid grid-cols-2 gap-x-4">
              <ul className="space-y-2">
                <li><a href="#" className="footer-link text-gray-400 hover:text-gray-600 text-sm">Thể thao</a></li>
                <li><a href="#" className="footer-link text-gray-400 hover:text-gray-600 text-sm">Slot Quay</a></li>
                <li><a href="#" className="footer-link text-gray-400 hover:text-gray-600 text-sm">Slot Bài</a></li>
                <li><a href="#" className="footer-link text-gray-400 hover:text-gray-600 text-sm">Xổ số</a></li>
              </ul>
              <ul className="space-y-2">
                <li><a href="#" className="footer-link text-gray-400 hover:text-gray-600 text-sm">Sòng bài</a></li>
                <li><a href="#" className="footer-link text-gray-400 hover:text-gray-600 text-sm">Đá Gà</a></li>
                <li><a href="#" className="footer-link text-gray-400 hover:text-gray-600 text-sm">Bắn cá</a></li>
                <li><a href="#" className="footer-link text-gray-400 hover:text-gray-600 text-sm">E-Sports</a></li>
              </ul>
            </div>
          </div>

          {/* Help & Support Column */}
          <div>
            <h3 className="footer-heading font-semibold text-black mb-4 text-md">Giúp đỡ và hỗ trợ</h3>
            <div className="grid grid-cols-2 gap-x-4">
              <ul className="space-y-2">
                <li><a href="#" className="footer-link text-gray-400 hover:text-gray-600 text-sm">Về AE888</a></li>
                <li><a href="#" className="footer-link text-gray-400 hover:text-gray-600 text-sm">Hướng dẫn rút tiền</a></li>
                <li><a href="#" className="footer-link text-gray-400 hover:text-gray-600 text-sm">Điều Khoản Và Điều Kiện</a></li>
                <li><a href="#" className="footer-link text-gray-400 hover:text-gray-600 text-sm">Chính Sách Quyền Riêng Tư Tại AE888</a></li>
                <li><a href="#" className="footer-link text-gray-400 hover:text-gray-600 text-sm">Câu hỏi thường gặp</a></li>
              </ul>
              <ul className="space-y-2">
                <li><a href="#" className="footer-link text-gray-400 hover:text-gray-600 text-sm">Hướng Dẫn Nạp Tiền</a></li>
                <li><a href="#" className="footer-link text-gray-400 hover:text-gray-600 text-sm">Chơi có trách nhiệm</a></li>
              </ul>
            </div>
          </div>

          {/* Follow US Column */}
          <div>
            <h3 className="footer-heading font-semibold text-black mb-4 text-md">Follow US</h3>
            <div className="grid grid-cols-2 gap-2">
              <a href="#" className="flex items-center justify-center w-10 h-10 bg-white border border-gray-300 rounded-lg hover:bg-blue-50 transition-colors">
                <img src="/footer/imgi_332_sns-fb.png" alt="Facebook" className="w-6 h-6" />
              </a>
              <a href="#" className="flex items-center justify-center w-10 h-10 bg-white border border-gray-300 rounded-lg hover:bg-red-50 transition-colors">
                <img src="/footer/imgi_333_sns-yt.png" alt="YouTube" className="w-6 h-6" />
              </a>
              <a href="#" className="flex items-center justify-center w-10 h-10 bg-white border border-gray-300 rounded-lg hover:bg-pink-50 transition-colors">
                <img src="/footer/imgi_334_sns-ig.png" alt="Instagram" className="w-6 h-6" />
              </a>
              <a href="#" className="flex items-center justify-center w-10 h-10 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <img src="/footer/imgi_335_sns-tk.png" alt="TikTok" className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 my-4"></div>

        {/* Bottom Section */}
        <div className="grid grid-cols-3 gap-6">
          {/* Responsible Gaming */}
          <div>
            <h3 className="font-bold text-black mb-4">Responsible Gaming</h3>
            <div className="flex items-center gap-3">
              <div className="bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                18+
              </div>
              <img src="/footer/ResponsibleGaming.png" alt="Responsible Gaming" className="h-8" />
            </div>
          </div>

          {/* Security */}
          <div>
            <h3 className="font-bold text-black mb-4">Security</h3>
            <img src="/footer/Security.png" alt="Security" className="h-8" />
          </div>

          {/* Certification */}
          <div>
            <h3 className="font-bold text-black mb-4">Certification</h3>
            <img src="/footer/Certification.png" alt="Certification" className="h-8" />
          </div>
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
