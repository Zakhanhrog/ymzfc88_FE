import React, { useState, useEffect } from 'react';
import { bannerService } from '../../services/bannerService';
import { Card, Image, Skeleton } from 'antd';

const BannerDisplay = ({ bannerType, className = '', style = {} }) => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBanners();
  }, [bannerType]);

  const loadBanners = async () => {
    try {
      const response = await bannerService.getActiveBannersByType(bannerType);
      if (response.success) {
        setBanners(response.data);
      }
    } catch (error) {
      console.error('Error loading banners:', error);
    } finally {
      setLoading(false);
    }
  };

  const getBannerStyle = (bannerType) => {
    switch (bannerType) {
      case 'MAIN_BANNER':
        return {
          width: '100%',
          height: '200px',
          objectFit: 'cover',
          borderRadius: '8px'
        };
      case 'SIDEBAR_BANNER':
        return {
          width: '100%',
          height: '300px',
          objectFit: 'cover',
          borderRadius: '8px'
        };
      case 'PROMOTION_BANNER':
        return {
          width: '100%',
          height: '150px',
          objectFit: 'cover',
          borderRadius: '8px'
        };
      default:
        return {
          width: '100%',
          height: '200px',
          objectFit: 'cover',
          borderRadius: '8px'
        };
    }
  };

  const getContainerStyle = (bannerType) => {
    switch (bannerType) {
      case 'MAIN_BANNER':
        return {
          width: '100%',
          marginBottom: '16px'
        };
      case 'SIDEBAR_BANNER':
        return {
          width: '100%',
          marginBottom: '12px'
        };
      case 'PROMOTION_BANNER':
        return {
          width: '100%',
          marginBottom: '12px'
        };
      default:
        return {
          width: '100%',
          marginBottom: '16px'
        };
    }
  };

  if (loading) {
    return (
      <div className={className} style={style}>
        <Skeleton.Image 
          style={{ 
            width: '100%', 
            height: bannerType === 'SIDEBAR_BANNER' ? '300px' : '200px' 
          }} 
        />
      </div>
    );
  }

  if (banners.length === 0) {
    return null;
  }

  return (
    <div className={className} style={style}>
      {banners.map((banner, index) => (
        <Card
          key={banner.id}
          hoverable
          style={getContainerStyle(bannerType)}
          bodyStyle={{ padding: 0 }}
          onClick={() => {
            if (banner.linkUrl) {
              window.open(banner.linkUrl, '_blank');
            }
          }}
        >
          <Image
            src={banner.imageUrl.startsWith('http') ? banner.imageUrl : `https://api.loto79.online/api${banner.imageUrl}`}
            alt={banner.title}
            style={getBannerStyle(bannerType)}
            preview={false}
            fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3MoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7uz39gV7TeD4n0HIw8QcACtK4oTx4mZgAAAABJRU5ErkJggg=="
          />
        </Card>
      ))}
    </div>
  );
};

export default BannerDisplay;
