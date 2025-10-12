import CategoryGameSection from './CategoryGameSection';

const CategoryGamesGrid = () => {
  // Game images data for each category
  const gameCategories = {
    thethao: {
      title: 'Thể thao',
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
      title: 'Sòng bài',
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
    },
    slotquay: {
      title: 'Slot Quay',
      images: [
        '/images/games/slotquay/imgi_183_27.png',
        '/images/games/slotquay/imgi_184_21.png',
        '/images/games/slotquay/imgi_185_427.png',
        '/images/games/slotquay/imgi_186_9.png',
        '/images/games/slotquay/imgi_187_309.png',
        '/images/games/slotquay/imgi_188_419.png',
        '/images/games/slotquay/imgi_189_4.png',
        '/images/games/slotquay/imgi_190_422.png',
        '/images/games/slotquay/imgi_191_22.png',
        '/images/games/slotquay/imgi_192_45.png',
        '/images/games/slotquay/imgi_193_25.png',
        '/images/games/slotquay/imgi_194_317.png',
        '/images/games/slotquay/imgi_195_227.png',
        '/images/games/slotquay/imgi_196_233.png',
        '/images/games/slotquay/imgi_197_31.png',
        '/images/games/slotquay/imgi_198_7.png',
        '/images/games/slotquay/imgi_199_60.png',
        '/images/games/slotquay/imgi_200_416.png',
        '/images/games/slotquay/imgi_201_11.png',
        '/images/games/slotquay/imgi_202_421.png'
      ]
    },
    daga: {
      title: 'Đá Gà',
      images: [
        '/images/games/daga/imgi_203_sub-animal-sv.png',
        '/images/games/daga/imgi_204_sub-animal-od_cock.png',
        '/images/games/daga/imgi_205_sub-animal-wcc.png',
        '/images/games/daga/imgi_206_sub-animal-ga28.png'
      ]
    }
  };

  return (
    <div className="w-full bg-gray-50 py-6 rounded-lg">
      {/* Grid Layout 2x2 with spacing */}
      <div className="grid grid-cols-2 gap-6">
        {/* Row 1 */}
        <div className="w-full h-full">
          <CategoryGameSection 
            title={gameCategories.thethao.title}
            gameImages={gameCategories.thethao.images}
          />
        </div>
        
        <div className="w-full h-full">
          <CategoryGameSection 
            title={gameCategories.songbai.title}
            gameImages={gameCategories.songbai.images}
          />
        </div>

        {/* Row 2 */}
        <div className="w-full h-full">
          <CategoryGameSection 
            title={gameCategories.slotquay.title}
            gameImages={gameCategories.slotquay.images}
          />
        </div>
        
        <div className="w-full h-full">
          <CategoryGameSection 
            title={gameCategories.daga.title}
            gameImages={gameCategories.daga.images}
          />
        </div>
      </div>
    </div>
  );
};

export default CategoryGamesGrid;
