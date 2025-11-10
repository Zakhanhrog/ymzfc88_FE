const diceFaceIconMap = {
  1: '/matxucxac/1cham.svg',
  2: '/matxucxac/2cham.svg',
  3: '/matxucxac/3cham.svg',
  4: '/matxucxac/4cham.svg',
  5: '/matxucxac/5cham.svg',
  6: '/matxucxac/6cham.svg',
};

const primaryBets = [
  {
    id: 'small',
    code: 'sicbo_primary_small',
    label: 'Xỉu',
    defaultMultiplier: 0.97,
  },
  {
    id: 'big',
    code: 'sicbo_primary_big',
    label: 'Tài',
    defaultMultiplier: 0.97,
  },
];

const combinationBets = [
  { id: 'triple-1', code: 'sicbo_combo_triple_1', faces: [1, 1, 1], defaultMultiplier: 20 },
  { id: 'triple-6', code: 'sicbo_combo_triple_6', faces: [6, 6, 6], defaultMultiplier: 20 },
  { id: 'triple-2', code: 'sicbo_combo_triple_2', faces: [2, 2, 2], defaultMultiplier: 20 },
  { id: 'triple-5', code: 'sicbo_combo_triple_5', faces: [5, 5, 5], defaultMultiplier: 20 },
  { id: 'triple-3', code: 'sicbo_combo_triple_3', faces: [3, 3, 3], defaultMultiplier: 20 },
  { id: 'triple-4', code: 'sicbo_combo_triple_4', faces: [4, 4, 4], defaultMultiplier: 20 },
];

const totalBetRows = [
  {
    id: 'row-top',
    variant: 'top',
    totals: [
      { id: 'total-4', code: 'sicbo_total_4', value: 4, defaultMultiplier: 30 },
      { id: 'total-5', code: 'sicbo_total_5', value: 5, defaultMultiplier: 18 },
      { id: 'total-6', code: 'sicbo_total_6', value: 6, defaultMultiplier: 14 },
      { id: 'total-7', code: 'sicbo_total_7', value: 7, defaultMultiplier: 12 },
      { id: 'total-8', code: 'sicbo_total_8', value: 8, defaultMultiplier: 8 },
      { id: 'total-9', code: 'sicbo_total_9', value: 9, defaultMultiplier: 6 },
      { id: 'total-10', code: 'sicbo_total_10', value: 10, defaultMultiplier: 6 },
    ],
    parity: {
      id: 'even',
      code: 'sicbo_parity_even',
      label: 'Chẵn',
      defaultMultiplier: 0.97,
      borderClass: 'border-red-500',
      textClass: 'text-red-600',
    },
  },
  {
    id: 'row-bottom',
    variant: 'bottom',
    totals: [
      { id: 'total-17', code: 'sicbo_total_17', value: 17, defaultMultiplier: 30 },
      { id: 'total-16', code: 'sicbo_total_16', value: 16, defaultMultiplier: 18 },
      { id: 'total-15', code: 'sicbo_total_15', value: 15, defaultMultiplier: 14 },
      { id: 'total-14', code: 'sicbo_total_14', value: 14, defaultMultiplier: 12 },
      { id: 'total-13', code: 'sicbo_total_13', value: 13, defaultMultiplier: 8 },
      { id: 'total-12', code: 'sicbo_total_12', value: 12, defaultMultiplier: 6 },
      { id: 'total-11', code: 'sicbo_total_11', value: 11, defaultMultiplier: 6 },
    ],
    parity: {
      id: 'odd',
      code: 'sicbo_parity_odd',
      label: 'Lẻ',
      defaultMultiplier: 0.97,
      borderClass: 'border-emerald-500',
      textClass: 'text-emerald-600',
    },
  },
];

const singleFaceBets = [
  { id: 'single-1', code: 'sicbo_single_1', face: 1, defaultMultiplier: 0.97 },
  { id: 'single-2', code: 'sicbo_single_2', face: 2, defaultMultiplier: 0.97 },
  { id: 'single-3', code: 'sicbo_single_3', face: 3, defaultMultiplier: 0.97 },
  { id: 'single-4', code: 'sicbo_single_4', face: 4, defaultMultiplier: 0.97 },
  { id: 'single-5', code: 'sicbo_single_5', face: 5, defaultMultiplier: 0.97 },
  { id: 'single-6', code: 'sicbo_single_6', face: 6, defaultMultiplier: 0.97 },
];

const formatRatio = (value) => {
  if (value === undefined || value === null) {
    return '1 : ?';
  }
  const numeric = Number(value);
  if (Number.isNaN(numeric)) {
    return `1 : ${value}`;
  }
  const formatted = Number.isInteger(numeric)
    ? numeric.toFixed(0)
    : numeric.toFixed(2).replace(/\.?0+$/, '');
  return `1 : ${formatted}`;
};

const resolveMultiplier = (configMap, code, fallback) => {
  const rawValue = configMap[code]?.payoutMultiplier;
  if (rawValue === undefined || rawValue === null || Number.isNaN(Number(rawValue))) {
    return fallback;
  }
  return Number(rawValue);
};

const renderPrimaryButton = (bet, quickBetConfigs) => (
  <button
    key={bet.id}
    type="button"
    className="group relative flex flex-col items-center justify-center rounded-lg border border-[#3abf86] bg-white px-3 py-[6px] text-center shadow-sm transition hover:border-[#f5c453] hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60"
  >
    <span className="text-xl font-black uppercase tracking-wide text-[#0f4c2c]">{bet.label}</span>
    <span
      className="mt-1 font-semibold uppercase tracking-[0.12em] text-[#0f4c2c] leading-tight"
      style={{ fontSize: '11px' }}
    >
      {formatRatio(resolveMultiplier(quickBetConfigs, bet.code, bet.defaultMultiplier))}
    </span>
  </button>
);

const renderTotalBetButton = (bet, variant, quickBetConfigs) => {
  const isBottom = variant === 'bottom';
  return (
    <button
      key={bet.id}
      type="button"
      className="group flex h-full flex-col items-center justify-center rounded border border-[#3abf86] bg-white px-1.5 py-2 text-center shadow-sm transition hover:border-[#f5c453] hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60"
    >
      <span
        className={`text-base font-bold leading-tight ${isBottom ? 'text-red-600' : 'text-[#0f172a]'}`}
      >
        {bet.value}
      </span>
      <span
        className="mt-px font-semibold uppercase tracking-[0.08em] text-[#0f4c2c] leading-tight"
        style={{ fontSize: '11px' }}
      >
        {formatRatio(resolveMultiplier(quickBetConfigs, bet.code, bet.defaultMultiplier))}
      </span>
    </button>
  );
};

const renderParityButton = (parity, quickBetConfigs) => (
  <button
    key={parity.id}
    type="button"
    className={`group flex h-full flex-col items-center justify-center rounded border bg-white px-2.5 py-1.5 text-center shadow-sm transition hover:border-[#f5c453] hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60 ${parity.borderClass}`}
  >
    <span className={`text-base font-black uppercase tracking-wide leading-tight ${parity.textClass}`}>
      {parity.label}
    </span>
    <span
      className="mt-px font-semibold uppercase tracking-[0.08em] text-[#0f4c2c] leading-tight"
      style={{ fontSize: '11px' }}
    >
      {formatRatio(resolveMultiplier(quickBetConfigs, parity.code, parity.defaultMultiplier))}
    </span>
  </button>
);

const SicboPrimaryBetPanel = ({ quickBetConfigs = {} }) => (
  <section className="w-full">
    <h2 className="sr-only">Tùy chọn cược Sicbo</h2>
    <div className="grid w-full grid-cols-[minmax(0,0.85fr)_minmax(0,1.2fr)_minmax(0,0.85fr)] items-stretch gap-1 sm:gap-1.5 lg:gap-2 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.4fr)_minmax(0,0.9fr)]">
      {renderPrimaryButton(primaryBets[0], quickBetConfigs)}

      <div className="grid grid-cols-2 gap-1 sm:gap-1.5">
        {combinationBets.map((bet) => (
          <button
            key={bet.id}
            type="button"
            className="group flex h-full flex-col items-center justify-center rounded-md border border-[#3abf86] bg-white px-2 py-[2px] text-center shadow-sm transition hover:border-[#f5c453] hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60"
          >
            <span className="sr-only">Cược tổ hợp {bet.faces.join(' - ')}</span>
            <div className="flex items-center justify-center gap-[2px] sm:gap-1">
              {bet.faces.map((face, index) => (
                <img
                  key={`${bet.id}-face-${index}`}
                  src={diceFaceIconMap[face]}
                  alt={`Mặt ${face}`}
                  className="h-[18px] w-[18px] select-none object-contain sm:h-6 sm:w-6"
                  draggable={false}
                />
              ))}
            </div>
            <span className="mt-px text-xs font-semibold uppercase tracking-[0.08em] text-[#0f4c2c] leading-tight">
              {formatRatio(resolveMultiplier(quickBetConfigs, bet.code, bet.defaultMultiplier))}
            </span>
          </button>
        ))}
      </div>

      {renderPrimaryButton(primaryBets[1], quickBetConfigs)}
    </div>
    <div className="mt-2 space-y-1">
      {totalBetRows.map((row) => (
        <div key={row.id} className="w-full">
          <div className="grid w-full grid-cols-[minmax(0,1.5fr)_repeat(7,minmax(0,1fr))] gap-1 sm:gap-1.5 lg:gap-2">
            {renderParityButton(row.parity, quickBetConfigs)}
            {row.totals.map((bet) => renderTotalBetButton(bet, row.variant, quickBetConfigs))}
          </div>
        </div>
      ))}
    </div>
    <div className="mt-0.5 sm:mt-0.5 lg:mt-0.5">
      <div className="grid grid-cols-[repeat(6,minmax(0,1fr))] gap-1 sm:gap-1.5 lg:gap-2">
        {singleFaceBets.map((bet) => (
          <button
            key={bet.id}
            type="button"
            className="group flex h-full flex-col items-center justify-center rounded-md border border-[#3abf86] bg-white px-2 py-2 text-center shadow-sm transition hover:border-[#f5c453] hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60"
          >
            <img
              src={diceFaceIconMap[bet.face]}
              alt={`Mặt ${bet.face}`}
              className="h-7 w-7 select-none object-contain sm:h-9 sm:w-9"
              draggable={false}
            />
            <span className="mt-1 text-xs font-semibold uppercase tracking-[0.08em] text-[#0f4c2c] leading-tight">
              {formatRatio(resolveMultiplier(quickBetConfigs, bet.code, bet.defaultMultiplier))}
            </span>
          </button>
        ))}
      </div>
    </div>
  </section>
);

export default SicboPrimaryBetPanel;

