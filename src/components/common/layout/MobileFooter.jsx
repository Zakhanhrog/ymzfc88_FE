const MobileFooter = () => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto relative z-10">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        
        {/* Về chúng tôi AE888 Section */}
        <div className="text-center mb-6">
          <h2 className="text-base font-bold text-gray-800 mb-3">Về chúng tôi AE888</h2>
          
          <div className="text-center space-y-2 text-gray-700 text-xs leading-relaxed">
            <p>
              AE888 là một trong những nhà cái hàng đầu tại Mỹ với sự chuyên nghiệp, 
              đẳng cấp, chất lượng và uy tín trong lĩnh vực cá cược trực tuyến.
            </p>
            <p>
              AE888 được cấp phép bởi cơ quan có uy tín tại Mỹ và là một trong số ít 
              nhà cái được cấp phép bởi Bộ Nội vụ và Bang liên bang Schleswig-Holstein.
            </p>
          </div>
        </div>

        {/* Giúp đỡ và hỗ trợ Section */}
        <div className="text-center mb-6">
          <h2 className="text-base font-bold text-gray-800 mb-3">Giúp đỡ và hỗ trợ</h2>
          
          <div className="flex flex-wrap justify-center gap-3 text-gray-700 text-xs">
            <a href="#" className="hover:text-gray-800 transition-colors">
              Hướng Dẫn Nạp Tiền
            </a>
            <a href="#" className="hover:text-gray-800 transition-colors">
              Hướng dẫn rút tiền
            </a>
            <a href="#" className="hover:text-gray-800 transition-colors">
              Câu hỏi thường gặp
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center">
          <p className="text-gray-400 text-xs">
            Copyright © AFER88 Reserved
          </p>
        </div>
      </div>

    </footer>
  );
};

export default MobileFooter;
