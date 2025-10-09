import { useEffect } from 'react';
import Button from './Button';

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
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
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
    <div className="fixed inset-0 z-50 overflow-y-auto" {...props}>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={handleMaskClick}
      />
      
      {/* Modal Container */}
      <div className={`relative min-h-screen flex items-center justify-center p-4 ${centered ? '' : 'items-start pt-20'}`}>
        {/* Modal Content */}
        <div 
          className={`relative bg-white rounded-lg shadow-xl w-full ${width} ${className}`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          {(title || closable) && (
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              {title && <h3 className="text-xl font-bold text-gray-900">{title}</h3>}
              {closable && (
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

