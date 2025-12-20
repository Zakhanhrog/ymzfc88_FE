import { useEffect } from 'react';
import { Button } from './button';

const Modal = ({ 
  open = false,
  onClose,
  title,
  children,
  footer,
  width = 'max-w-lg',
  closable = true,
  maskClosable = true,
  centered = true,
  className = '',
  ...props 
}) => {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (open) {
      // Lưu lại scroll position hiện tại
      const scrollY = window.scrollY;
      // Ngăn scroll body
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.left = '0';
      document.body.style.right = '0';
      
      // Lưu scroll position vào data attribute để khôi phục sau
      document.body.setAttribute('data-scroll-y', scrollY.toString());
    } else {
      // Khôi phục scroll position
      const scrollY = document.body.getAttribute('data-scroll-y') || '0';
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.removeAttribute('data-scroll-y');
      window.scrollTo(0, parseInt(scrollY));
    }
    return () => {
      // Cleanup
      const scrollY = document.body.getAttribute('data-scroll-y') || '0';
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.removeAttribute('data-scroll-y');
      window.scrollTo(0, parseInt(scrollY));
    };
  }, [open]);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && open && closable) {
        onClose?.();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [open, closable, onClose]);

  if (!open) return null;

  const handleMaskClick = () => {
    if (maskClosable && closable) {
      onClose?.();
    }
  };

  return (
    <div className="fixed inset-0 z-[200]" {...props}>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity z-[200]"
        onClick={handleMaskClick}
      />
      
      {/* Modal Container */}
      <div 
        className={`fixed inset-0 flex items-center justify-center p-4 z-[201] overflow-y-auto ${centered ? '' : 'items-start pt-20'}`}
        onClick={(e) => {
          if (maskClosable && closable && e.target === e.currentTarget) {
            onClose?.();
          }
        }}
        onScroll={(e) => e.stopPropagation()}
      >
        {/* Modal Content */}
        <div 
          className={`relative bg-white rounded-lg shadow-xl w-full max-h-[calc(100vh-2rem)] overflow-y-auto transition-all duration-300 ease-in-out ${width} ${className} my-auto`}
          onClick={(e) => e.stopPropagation()}
          onScroll={(e) => e.stopPropagation()}
        >
          {/* Header */}
          {(title || closable) && (
            <div className="flex items-center justify-between px-6 py-3 border-b border-gray-200">
              {title && <h3 className="text-base font-semibold text-gray-900">{title}</h3>}
              {closable && (
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          )}
          
          {/* Body */}
          <div className="px-6 py-4">
            {children}
          </div>
          
          {/* Footer */}
          {footer && (
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;

