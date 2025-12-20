import { useState, useEffect } from 'react';
import Alert from '../../../components/ui/Alert';
import ContactLinkCard from './contact-links/ContactLinkCard';
import contactService from '../../../services/contactService';
import { message } from '../../../utils/notification';

const ContactLinksManagement = () => {
  const [contactLinks, setContactLinks] = useState({});
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState({});
  const [error, setError] = useState('');

  const contactCards = [
    {
      id: 'livechat',
      title: 'Livechat 24/24',
      icon: '/iconhotro/imgi_138_livechat.svg',
      description: 'Hỗ trợ trực tuyến 24/7',
      color: 'from-blue-500 to-blue-600',
      textColor: 'text-blue-700'
    },
    {
      id: 'facebook',
      title: 'Kênh Facebook',
      icon: '/iconhotro/imgi_139_facebook.svg',
      description: 'Theo dõi trang Facebook chính thức',
      color: 'from-blue-600 to-blue-700',
      textColor: 'text-blue-700'
    },
    {
      id: 'messenger',
      title: 'Messenger Facebook',
      icon: '/iconhotro/imgi_140_messenger.svg',
      description: 'Chat trực tiếp qua Messenger',
      color: 'from-blue-500 to-indigo-600',
      textColor: 'text-indigo-700'
    },
    {
      id: 'telegram',
      title: 'Telegram',
      icon: '/iconhotro/imgi_141_telegram_chanel.svg',
      description: 'Liên hệ qua Telegram',
      color: 'from-cyan-500 to-blue-600',
      textColor: 'text-cyan-700'
    },
    {
      id: 'hotline',
      title: 'Hotline',
      icon: '/iconhotro/imgi_138_livechat.svg',
      description: 'Gọi điện trực tiếp',
      color: 'from-green-500 to-green-600',
      textColor: 'text-green-700'
    }
  ];

  const loadContactLinks = async () => {
    try {
      setLoading(true);
      setError('');
      const links = await contactService.getContactLinksAdmin();
      setContactLinks(links);
    } catch (error) {
      setError('Không thể tải danh sách links: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const updateLink = async (linkType, linkUrl) => {
    try {
      setUpdating(prev => ({ ...prev, [linkType]: true }));
      await contactService.updateContactLink(linkType, linkUrl);
      setContactLinks(prev => ({ ...prev, [linkType]: linkUrl }));
      message.success('Cập nhật link thành công!');
    } catch (error) {
      message.error('Không thể cập nhật link: ' + (error.response?.data?.message || error.message));
    } finally {
      setUpdating(prev => ({ ...prev, [linkType]: false }));
    }
  };

  useEffect(() => {
    loadContactLinks();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-8 h-8 border-4 border-[#4CAF50] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <Alert
          type="error"
          description={error}
          closable
          onClose={() => setError('')}
          className="rounded-2xl"
        />
      )}

      <div className="space-y-3">
        {contactCards.map((card) => (
          <ContactLinkCard
            key={card.id}
            card={card}
            link={contactLinks[card.id]}
            onUpdate={updateLink}
            updating={updating[card.id] || false}
          />
        ))}
      </div>
    </div>
  );
};

export default ContactLinksManagement;
