// Notification utility - thay thế Ant Design message với thiết kế premium
let messageContainer = null;
let styleAdded = false;

const createMessageContainer = () => {
  if (!messageContainer) {
    messageContainer = document.createElement('div');
    messageContainer.id = 'message-container';
    messageContainer.style.cssText = `
      position: fixed;
      top: 24px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 8px;
      pointer-events: none;
      max-width: 90%;
      width: auto;
      min-width: 220px;
    `;
    document.body.appendChild(messageContainer);
  }
  return messageContainer;
};

const getIconSVG = (type) => {
  const icons = {
    success: `
      <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="10" cy="10" r="9" fill="#FACC15" stroke="#F59E0B" stroke-width="1.5"/>
        <path d="M6 10L9 13L14 7" stroke="#047857" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `,
    error: `
      <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="10" cy="10" r="9" fill="#FACC15" stroke="#F59E0B" stroke-width="1.5"/>
        <path d="M7 7L13 13M13 7L7 13" stroke="#DC2626" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `,
    warning: `
      <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="10" cy="10" r="9" fill="#FACC15" stroke="#F59E0B" stroke-width="1.5"/>
        <path d="M10 6V10M10 14H10.01" stroke="#DC2626" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `,
    info: `
      <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="10" cy="10" r="9" fill="#FACC15" stroke="#F59E0B" stroke-width="1.5"/>
        <circle cx="10" cy="7" r="1.5" fill="#047857"/>
        <path d="M10 10V14" stroke="#047857" stroke-width="2" stroke-linecap="round"/>
      </svg>
    `,
  };
  return icons[type] || icons.info;
};

const showMessage = (content, type = 'info', duration = 3) => {
  const container = createMessageContainer();
  
  const messageEl = document.createElement('div');
  messageEl.className = `notification-message notification-${type}`;
  
  // Base styles cho tất cả notifications
  const baseStyles = `
    padding: 10px 16px;
    border-radius: 8px;
    color: #FFFFFF;
    font-size: 13px;
    font-weight: 600;
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
    pointer-events: auto;
    animation: notificationSlideDown 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
    display: flex;
    align-items: center;
    gap: 8px;
    min-width: 200px;
    max-width: 350px;
    backdrop-filter: blur(10px);
    position: relative;
    overflow: hidden;
    letter-spacing: -0.01em;
  `;

  // Styles theo từng loại
  const typeStyles = {
    success: `
      background: linear-gradient(135deg, #047857 0%, #059669 50%, #047857 100%);
      border: 1.5px solid #FACC15;
      box-shadow: 0 8px 24px rgba(5, 150, 105, 0.4), 
                  0 0 0 1px rgba(250, 204, 21, 0.3),
                  inset 0 1px 0 rgba(255, 255, 255, 0.1);
    `,
    error: `
      background: linear-gradient(135deg, #991B1B 0%, #DC2626 50%, #991B1B 100%);
      border: 1.5px solid #FACC15;
      box-shadow: 0 8px 24px rgba(220, 38, 38, 0.4), 
                  0 0 0 1px rgba(250, 204, 21, 0.3),
                  inset 0 1px 0 rgba(255, 255, 255, 0.1);
    `,
    warning: `
      background: linear-gradient(135deg, #D97706 0%, #F59E0B 50%, #D97706 100%);
      border: 1.5px solid #FACC15;
      box-shadow: 0 8px 24px rgba(245, 158, 11, 0.4), 
                  0 0 0 1px rgba(250, 204, 21, 0.3),
                  inset 0 1px 0 rgba(255, 255, 255, 0.1);
    `,
    info: `
      background: linear-gradient(135deg, #065F46 0%, #047857 50%, #065F46 100%);
      border: 1.5px solid #FACC15;
      box-shadow: 0 8px 24px rgba(4, 120, 87, 0.4), 
                  0 0 0 1px rgba(250, 204, 21, 0.3),
                  inset 0 1px 0 rgba(255, 255, 255, 0.1);
    `,
  };

  messageEl.style.cssText = baseStyles + (typeStyles[type] || typeStyles.info);

  // Thêm shimmer effect
  const shimmer = document.createElement('div');
  shimmer.style.cssText = `
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, 
      transparent, 
      rgba(250, 204, 21, 0.2), 
      transparent
    );
    animation: shimmer 2s infinite;
  `;
  messageEl.appendChild(shimmer);

  // Icon container
  const iconContainer = document.createElement('div');
  iconContainer.style.cssText = `
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: 24px;
    height: 24px;
    background: rgba(250, 204, 21, 0.15);
    border-radius: 50%;
    padding: 4px;
  `;
  iconContainer.innerHTML = getIconSVG(type);
  messageEl.appendChild(iconContainer);

  // Content container
  const contentContainer = document.createElement('div');
  contentContainer.style.cssText = `
    flex: 1;
    display: flex;
    align-items: center;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  `;
  contentContainer.textContent = content;
  messageEl.appendChild(contentContainer);

  container.appendChild(messageEl);

  // Auto remove sau duration
  setTimeout(() => {
    messageEl.style.animation = 'notificationSlideUp 0.3s cubic-bezier(0.4, 0, 1, 1)';
    setTimeout(() => {
      if (messageEl.parentNode) {
      container.removeChild(messageEl);
      }
      if (container.children.length === 0) {
        document.body.removeChild(container);
        messageContainer = null;
      }
    }, 300);
  }, duration * 1000);
};

// Add animations và styles chỉ một lần
if (!styleAdded && !document.getElementById('notification-styles')) {
const style = document.createElement('style');
  style.id = 'notification-styles';
style.textContent = `
    @keyframes notificationSlideDown {
    from {
      opacity: 0;
        transform: translateY(-30px) scale(0.95);
    }
    to {
      opacity: 1;
        transform: translateY(0) scale(1);
    }
  }
  
    @keyframes notificationSlideUp {
    from {
      opacity: 1;
        transform: translateY(0) scale(1);
    }
    to {
      opacity: 0;
        transform: translateY(-20px) scale(0.95);
      }
    }

    @keyframes shimmer {
      0% {
        left: -100%;
      }
      100% {
        left: 100%;
      }
    }

    .notification-message:hover {
      transform: translateY(-2px) scale(1.02);
      transition: transform 0.2s ease;
    }

    .notification-message::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 2px;
      background: linear-gradient(90deg, 
        transparent, 
        #FACC15, 
        #F59E0B, 
        #FACC15, 
        transparent
      );
      animation: shimmer 3s infinite;
    }

    @media (max-width: 640px) {
      #message-container {
        min-width: 200px !important;
        max-width: calc(100% - 32px) !important;
        left: 50% !important;
        transform: translateX(-50%) !important;
      }
      
      .notification-message {
        min-width: 200px !important;
        max-width: 100% !important;
        padding: 8px 14px !important;
        font-size: 12px !important;
    }
  }
`;
document.head.appendChild(style);
  styleAdded = true;
}

export const message = {
  success: (content, duration) => showMessage(content, 'success', duration),
  error: (content, duration) => showMessage(content, 'error', duration),
  warning: (content, duration) => showMessage(content, 'warning', duration),
  info: (content, duration) => showMessage(content, 'info', duration),
};

// Alias for backward compatibility
export const showNotification = showMessage;

export default message;

