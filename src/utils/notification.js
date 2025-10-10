// Notification utility - thay thế Ant Design message
let messageContainer = null;

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
    `;
    document.body.appendChild(messageContainer);
  }
  return messageContainer;
};

const showMessage = (content, type = 'info', duration = 3) => {
  const container = createMessageContainer();
  
  const messageEl = document.createElement('div');
  messageEl.style.cssText = `
    padding: 12px 20px;
    border-radius: 8px;
    color: white;
    font-size: 14px;
    font-weight: 500;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    pointer-events: auto;
    animation: slideDown 0.3s ease;
    display: flex;
    align-items: center;
    gap: 8px;
  `;

  const colors = {
    success: 'linear-gradient(135deg, #52c41a, #73d13d)',
    error: 'linear-gradient(135deg, #ff4d4f, #ff7875)',
    warning: 'linear-gradient(135deg, #faad14, #ffc53d)',
    info: 'linear-gradient(135deg, #1890ff, #40a9ff)',
  };

  const icons = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ',
  };

  messageEl.style.background = colors[type] || colors.info;
  messageEl.innerHTML = `<span style="font-size: 16px;">${icons[type] || icons.info}</span> ${content}`;

  container.appendChild(messageEl);

  setTimeout(() => {
    messageEl.style.animation = 'slideUp 0.3s ease';
    setTimeout(() => {
      container.removeChild(messageEl);
      if (container.children.length === 0) {
        document.body.removeChild(container);
        messageContainer = null;
      }
    }, 300);
  }, duration * 1000);
};

// Add animations
const style = document.createElement('style');
style.textContent = `
  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes slideUp {
    from {
      opacity: 1;
      transform: translateY(0);
    }
    to {
      opacity: 0;
      transform: translateY(-20px);
    }
  }
`;
document.head.appendChild(style);

export const message = {
  success: (content, duration) => showMessage(content, 'success', duration),
  error: (content, duration) => showMessage(content, 'error', duration),
  warning: (content, duration) => showMessage(content, 'warning', duration),
  info: (content, duration) => showMessage(content, 'info', duration),
};

// Alias for backward compatibility
export const showNotification = showMessage;

export default message;

