import MobileCategoryGameSection from './MobileCategoryGameSection';
import MobilePromotionSection from './MobilePromotionSection';

const MobileCategoryGamesSection = () => {
  // Game images data for Thể thao and Sòng bài
  const gameCategories = {
    thethao: {
      title: 'THỂ THAO',
      images: [
        '/images/games/thethao/imgi_160_sub-sports-saba.png',
        '/images/games/thethao/imgi_162_sub-sports-cmdbet.png',
        '/images/games/thethao/imgi_163_sub-sports-sbobet.png',
        '/images/games/thethao/imgi_164_sub-sports-ugaming.png',
        '/images/games/thethao/imgi_165_sub-sports-im_sports.png',
        '/images/games/thethao/imgi_166_sub-sports-pinnacle.png',
        '/images/games/thethao/imgi_167_sub-sports-lucky_sports.png',
        '/images/games/thethao/imgi_168_sub-sports-three_sing.png',
        '/images/games/thethao/imgi_169_sub-sports-wg_sports.png',
        '/images/games/thethao/imgi_170_sub-sports-afb_sports.png'
      ]
    },
    songbai: {
      title: 'SÒNG BÀI',
      images: [
        '/images/games/songbai/imgi_28_d7ad55df-a4cc-4aa5-8a43-e911524ef438.png',
        '/images/games/songbai/imgi_29_e41c1a86-7f70-4216-8117-bf8ef8d2be78.png',
        '/images/games/songbai/imgi_30_acae1a20-7db4-4d57-bbe7-048c871dd137.png',
        '/images/games/songbai/imgi_31_fc1f9a0f-3923-430c-b30c-8365912831cf.png',
        '/images/games/songbai/imgi_32_1547de65-e769-4414-867d-87deb017e914.png',
        '/images/games/songbai/imgi_33_90f0d9fb-e5a6-49ac-9e90-095354d75b95.png',
        '/images/games/songbai/imgi_34_38dc4055-ae80-4854-bcdd-754d29e9ec4c.png',
        '/images/games/songbai/imgi_35_7f8ebb55-51a9-4d3e-8240-17affd8608ff.png',
        '/images/games/songbai/imgi_36_984fb1e8-f91e-469a-b40a-11c55e1b48d3.png',
        '/images/games/songbai/imgi_37_76c957f9-390c-4d0a-9cbe-1168da0f6ec3.png',
        '/images/games/songbai/imgi_38_125fb559-36dd-432d-8efc-4b5712334cd7.png',
        '/images/games/songbai/imgi_39_346325f6-d32d-4f99-beb4-cb64dd81c266.png'
      ]
    }
  };

  return (
    <div className="w-full px-0 pt-0.5 pb-1">
      {/* Thể thao Section */}
      <MobileCategoryGameSection 
        title={gameCategories.thethao.title}
        gameImages={gameCategories.thethao.images}
      />
      
      {/* Sòng bài Section */}
      <MobileCategoryGameSection 
        title={gameCategories.songbai.title}
        gameImages={gameCategories.songbai.images}
      />
      
      {/* Khuyến mãi Section */}
      <MobilePromotionSection />
    </div>
  );
};

export default MobileCategoryGamesSection;

