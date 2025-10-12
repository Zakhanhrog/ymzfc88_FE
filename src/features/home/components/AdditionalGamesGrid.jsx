import CategoryGameSection from './CategoryGameSection';

const AdditionalGamesGrid = () => {
  // Game images data for additional categories
  const additionalGameCategories = {
    slotbai: {
      title: 'Slot Bài',
      images: [
        '/images/games/slotbai/imgi_207_go03.png',
        '/images/games/slotbai/imgi_208_1009.png',
        '/images/games/slotbai/imgi_209_967.png',
        '/images/games/slotbai/imgi_210_745.png',
        '/images/games/slotbai/imgi_211_5776.png',
        '/images/games/slotbai/imgi_212_5739.png',
        '/images/games/slotbai/imgi_213_5489.png',
        '/images/games/slotbai/imgi_214_946.png',
        '/images/games/slotbai/imgi_215_5687.png',
        '/images/games/slotbai/imgi_216_5669.png',
        '/images/games/slotbai/imgi_217_5875.png',
        '/images/games/slotbai/imgi_218_964.png',
        '/images/games/slotbai/imgi_219_5344.png',
        '/images/games/slotbai/imgi_220_5865.png',
        '/images/games/slotbai/imgi_221_5811.png',
        '/images/games/slotbai/imgi_222_5523.png',
        '/images/games/slotbai/imgi_223_5573.png',
        '/images/games/slotbai/imgi_224_5757.png',
        '/images/games/slotbai/imgi_225_748.png',
        '/images/games/slotbai/imgi_226_5863.png'
      ]
    },
    banca: {
      title: 'Bắn cá',
      images: [
        '/images/games/banca/imgi_227_61.png',
        '/images/games/banca/imgi_228_go02.png',
        '/images/games/banca/imgi_229_at05.png',
        '/images/games/banca/imgi_230_at01.png',
        '/images/games/banca/imgi_231_go05.png',
        '/images/games/banca/imgi_232_go06.png',
        '/images/games/banca/imgi_233_ab3.png',
        '/images/games/banca/imgi_234_jili-fish-009.png',
        '/images/games/banca/imgi_235_jili-fish-002.png',
        '/images/games/banca/imgi_236_jili-fish-008.png',
        '/images/games/banca/imgi_237_jili-fish-011.png',
        '/images/games/banca/imgi_238_jili-fish-004.png',
        '/images/games/banca/imgi_239_jili-fish-006.png',
        '/images/games/banca/imgi_240_jili-fish-013.png',
        '/images/games/banca/imgi_241_jili-fish-014.png',
        '/images/games/banca/imgi_242_jili-fish-005.png',
        '/images/games/banca/imgi_243_jili-fish-003.png',
        '/images/games/banca/imgi_244_jili-fish-007.png',
        '/images/games/banca/imgi_245_jili-fish-012.png',
        '/images/games/banca/imgi_246_jili-fish-001.png'
      ]
    },
    xoso: {
      title: 'Xổ số',
      images: [
        '/images/games/xoso/imgi_124_aac5d7e4-d1ad-474d-ab87-faeb8d8a081a.png',
        '/images/games/xoso/imgi_125_65be5f51-efc6-4df3-b3b9-505db68c4052.png',
        '/images/games/xoso/imgi_126_bb041b0b-7de7-437b-9fb8-d537fa2f1923.png',
        '/images/games/xoso/imgi_127_77a6c390-ca43-4359-ba94-5cb357b24dac.png',
        '/images/games/xoso/imgi_128_0567c1c3-f672-477b-bd5f-d8bab9cd9596.png',
        '/images/games/xoso/imgi_129_adc46400-eefd-4d07-b2be-e6b87cbba548.png',
        '/images/games/xoso/imgi_130_e3e8c4b5-06a2-4502-83de-d9285359188f.png',
        '/images/games/xoso/imgi_131_59c8b0fb-6cbc-45d2-8805-142b70829771.png'
      ]
    },
    esports: {
      title: 'E-Sports',
      images: [
        '/images/games/Esports/imgi_132_593c4343-36cc-4745-bc0e-db710352e2d2.png',
        '/images/games/Esports/imgi_133_f51dd4ae-052b-45fb-a6a3-ce5ee9ebee70.png',
        '/images/games/Esports/imgi_134_8fce69ef-b1fa-4d65-984c-dcace80d962f.png'
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
            title={additionalGameCategories.slotbai.title}
            gameImages={additionalGameCategories.slotbai.images}
          />
        </div>
        
        <div className="w-full h-full">
          <CategoryGameSection 
            title={additionalGameCategories.banca.title}
            gameImages={additionalGameCategories.banca.images}
          />
        </div>

        {/* Row 2 */}
        <div className="w-full h-full">
          <CategoryGameSection 
            title={additionalGameCategories.xoso.title}
            gameImages={additionalGameCategories.xoso.images}
          />
        </div>
        
        <div className="w-full h-full">
          <CategoryGameSection 
            title={additionalGameCategories.esports.title}
            gameImages={additionalGameCategories.esports.images}
          />
        </div>
      </div>
    </div>
  );
};

export default AdditionalGamesGrid;
