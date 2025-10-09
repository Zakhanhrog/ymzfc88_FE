const WalletTabsStyles = () => {
  return (
    <style dangerouslySetInnerHTML={{
      __html: `
        .wallet-tabs .ant-tabs-tab {
          border-radius: 12px !important;
          border: none !important;
          background: #f3f4f6 !important;
          margin-right: 8px !important;
          font-weight: 500 !important;
          font-size: 14px !important;
          padding: 12px 16px !important;
          transition: all 0.3s ease !important;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05) !important;
        }
        
        .wallet-tabs .ant-tabs-tab:hover {
          background: #e5e7eb !important;
          transform: translateY(-1px) !important;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1) !important;
        }
        
        .wallet-tabs .ant-tabs-tab-active {
          background: linear-gradient(135deg, #dc2626 0%, #ef4444 100%) !important;
          color: white !important;
          transform: translateY(-2px) !important;
          box-shadow: 0 6px 16px rgba(220, 38, 38, 0.3) !important;
        }
        
        .wallet-tabs .ant-tabs-tab-active:hover {
          background: linear-gradient(135deg, #dc2626 0%, #ef4444 100%) !important;
          color: white !important;
          transform: translateY(-2px) !important;
        }
        
        .wallet-tabs .ant-tabs-tab-active .ant-tabs-tab-btn {
          color: white !important;
        }
        
        .wallet-tabs .ant-tabs-content {
          padding: 20px 0 !important;
          border-radius: 16px !important;
          background: #ffffff !important;
          margin-top: 8px !important;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06) !important;
        }
        
        .wallet-tabs .ant-tabs-tabpane {
          background: transparent !important;
          animation: fadeIn 0.3s ease-in-out !important;
        }
        
        .wallet-tabs .ant-tabs-nav {
          margin-bottom: 0 !important;
        }
        
        .wallet-tabs .ant-tabs-nav-wrap {
          background: transparent !important;
          border-radius: 16px !important;
          padding: 8px !important;
        }
        
        .wallet-tabs .ant-tabs-ink-bar {
          display: none !important;
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        /* Mobile responsive tabs */
        @media (max-width: 768px) {
          .wallet-tabs .ant-tabs-tab {
            font-size: 12px !important;
            padding: 8px 12px !important;
            margin-right: 4px !important;
            border-radius: 8px !important;
          }
          
          .wallet-tabs .ant-tabs-nav-wrap {
            padding: 4px !important;
          }
          
          .wallet-tabs .ant-tabs-content {
            margin-top: 4px !important;
            padding: 16px 0 !important;
          }
        }
        
        /* Smooth transition cho tab content */
        .wallet-tabs .ant-tabs-tabpane-active {
          animation: slideInUp 0.3s ease-out !important;
        }
        
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `
    }} />
  );
};

export default WalletTabsStyles;

