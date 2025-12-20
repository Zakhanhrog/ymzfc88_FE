import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

const Dropdown = ({ 
  trigger = 'click', // 'click' | 'hover'
  placement = 'bottom-end', // 'bottom' | 'bottom-start' | 'bottom-end' | 'top' | 'top-start' | 'top-end' | 'right' | 'right-start' | 'right-end' | 'left' | 'left-start' | 'left-end'
  children,
  overlay,
  disabled = false,
  className = '',
  onVisibleChange, // Callback when visibility changes
}) => {
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const dropdownRef = useRef(null);
  const triggerRef = useRef(null);
  const overlayRef = useRef(null);
  const hideTimeoutRef = useRef(null);

  // Notify parent when visibility changes
  useEffect(() => {
    onVisibleChange?.(visible);
  }, [visible, onVisibleChange]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Don't close if clicking inside trigger or overlay
      const isClickInTrigger = triggerRef.current && triggerRef.current.contains(event.target);
      const isClickInOverlay = overlayRef.current && overlayRef.current.contains(event.target);
      
      if (!isClickInTrigger && !isClickInOverlay) {
        setVisible(false);
      }
    };

    // Only add click outside listener for click trigger, not hover
    if (visible && trigger === 'click') {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [visible, trigger]);

  const handleTriggerClick = () => {
    if (trigger === 'click' && !disabled) {
      setVisible(!visible);
    }
  };

  const updatePosition = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      let top = 0;
      let left = 0;

      if (placement.startsWith('right')) {
        left = rect.right + 2;
        if (placement === 'right-start') {
          top = rect.top;
        } else if (placement === 'right-end') {
          top = rect.bottom;
        } else {
          top = rect.top + rect.height / 2;
        }
      } else if (placement.startsWith('left')) {
        left = rect.left - 8;
        if (placement === 'left-start') {
          top = rect.top;
        } else if (placement === 'left-end') {
          top = rect.bottom;
        } else {
          top = rect.top + rect.height / 2;
        }
      } else if (placement.startsWith('top')) {
        top = rect.top - 8;
        if (placement === 'top-start') {
          left = rect.left;
        } else if (placement === 'top-end') {
          left = rect.right;
        } else {
          left = rect.left + rect.width / 2;
        }
      } else {
        top = rect.bottom + 8;
        if (placement === 'bottom-start') {
          left = rect.left;
        } else if (placement === 'bottom-end') {
          left = rect.right;
        } else {
          left = rect.left + rect.width / 2;
        }
      }

      setPosition({ top, left });
    }
  };

  const handleMouseEnter = () => {
    if (trigger === 'hover' && !disabled) {
      // Clear any pending hide timeout
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
        hideTimeoutRef.current = null;
      }
      updatePosition();
      setVisible(true);
    }
  };

  const handleMouseLeave = (e) => {
    if (trigger === 'hover' && !disabled) {
      // Check if mouse is moving to the overlay
      const relatedTarget = e.relatedTarget;
      if (overlayRef.current && overlayRef.current.contains(relatedTarget)) {
        return; // Don't hide if moving to overlay
      }
      
      // Add a small delay before hiding to allow mouse movement
      hideTimeoutRef.current = setTimeout(() => {
        // Double check if mouse is still not in overlay
        if (overlayRef.current && !overlayRef.current.matches(':hover') && 
            triggerRef.current && !triggerRef.current.matches(':hover')) {
          setVisible(false);
        }
      }, 100);
    }
  };

  const handleOverlayMouseEnter = () => {
    if (trigger === 'hover' && !disabled) {
      // Clear any pending hide timeout
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
        hideTimeoutRef.current = null;
      }
      setVisible(true);
    }
  };

  const handleOverlayMouseLeave = (e) => {
    if (trigger === 'hover' && !disabled) {
      // Check if mouse is moving back to trigger
      const relatedTarget = e.relatedTarget;
      if (triggerRef.current && triggerRef.current.contains(relatedTarget)) {
        return; // Don't hide if moving back to trigger
      }
      
      hideTimeoutRef.current = setTimeout(() => {
        // Double check if mouse is still not in trigger or overlay
        const isInTrigger = triggerRef.current && 
          (triggerRef.current.matches(':hover') || triggerRef.current.contains(document.elementFromPoint(e.clientX, e.clientY)));
        const isInOverlay = overlayRef.current && 
          (overlayRef.current.matches(':hover') || overlayRef.current.contains(document.elementFromPoint(e.clientX, e.clientY)));
        
        if (!isInTrigger && !isInOverlay) {
          setVisible(false);
        }
      }, 150);
    }
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
    };
  }, []);

  const placementClasses = {
    'bottom': 'top-full left-1/2 -translate-x-1/2 mt-2',
    'bottom-start': 'top-full left-0 mt-2',
    'bottom-end': 'top-full right-0 mt-2',
    'top': 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    'top-start': 'bottom-full left-0 mb-2',
    'top-end': 'bottom-full right-0 mb-2',
    'right': 'left-full top-1/2 -translate-y-1/2 ml-2',
    'right-start': 'left-full top-0 ml-2',
    'right-end': 'left-full bottom-0 ml-2',
    'left': 'right-full top-1/2 -translate-y-1/2 mr-2',
    'left-start': 'right-full top-0 mr-2',
    'left-end': 'right-full bottom-0 mr-2',
  };

  // Determine if we should use portal (for right/left placements to avoid overflow issues)
  const usePortal = placement.startsWith('right') || placement.startsWith('left');

  return (
    <>
      <div 
        ref={(node) => {
          triggerRef.current = node;
          dropdownRef.current = node;
        }}
        className={`relative inline-block ${className}`}
        onClick={handleTriggerClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {children}
        
        {visible && !usePortal && (
          <div 
            ref={overlayRef}
            className={`absolute z-[150] ${placementClasses[placement]} animate-in fade-in duration-150`}
            onMouseEnter={handleOverlayMouseEnter}
            onMouseLeave={handleOverlayMouseLeave}
            onClick={(e) => {
              // Prevent click from bubbling to trigger
              e.stopPropagation();
            }}
          >
            {overlay}
          </div>
        )}
      </div>
      
      {visible && usePortal && typeof window !== 'undefined' && (
        createPortal(
          <div 
            ref={overlayRef}
            className="fixed z-[150] animate-in fade-in duration-150"
            style={{
              top: `${position.top}px`,
              left: `${position.left}px`,
              transform: placement === 'right' || placement === 'left' 
                ? 'translateY(-50%)' 
                : placement === 'right-end' || placement === 'left-end'
                ? 'translateY(-100%)'
                : 'none'
            }}
            onMouseEnter={handleOverlayMouseEnter}
            onMouseLeave={handleOverlayMouseLeave}
            onClick={(e) => {
              // Prevent click from bubbling
              e.stopPropagation();
            }}
          >
            {overlay}
          </div>,
          document.body
        )
      )}
    </>
  );
};

// Dropdown.Menu - For menu items
export const DropdownMenu = ({ items, onClick }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 py-1 min-w-[160px]">
      {items.map((item, index) => (
        <div key={index}>
          {item.divider ? (
            <div className="h-px bg-gray-200 my-1" />
          ) : (
            <button
              onClick={() => onClick?.(item)}
              disabled={item.disabled}
              className={`w-full text-left px-4 py-2 text-sm transition-colors
                ${item.danger ? 'text-green-600 hover:bg-green-50' : 'text-gray-700 hover:bg-gray-100'}
                ${item.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              <div className="flex items-center gap-2">
                {item.icon && <span className="text-lg">{item.icon}</span>}
                <span>{item.label}</span>
              </div>
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default Dropdown;

