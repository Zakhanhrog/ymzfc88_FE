export const CACHE_KEY = 'user_info_cache';
export const CACHE_DURATION_MS = 30000;

export const gameName = 'Xóc Đĩa Jackpot';

export const defaultQuickBetConfigs = [
  {
    code: 'chan',
    label: 'Chẵn',
    payoutMultiplier: 1.96,
    pattern: [],
    layoutGroup: 'TOP',
    displayOrder: 1,
  },
  {
    code: 'tai',
    label: 'Tài',
    payoutMultiplier: 1.95,
    pattern: [],
    layoutGroup: 'TOP',
    displayOrder: 2,
  },
  {
    code: 'xiu',
    label: 'Xỉu',
    payoutMultiplier: 1.95,
    pattern: [],
    layoutGroup: 'TOP',
    displayOrder: 3,
  },
  {
    code: 'le',
    label: 'Lẻ',
    payoutMultiplier: 1.96,
    pattern: [],
    layoutGroup: 'TOP',
    displayOrder: 4,
  },
  {
    code: 'two-two',
    label: '2 Trắng 2 Đỏ',
    payoutMultiplier: 2.55,
    pattern: ['white', 'white', 'red', 'red'],
    layoutGroup: 'TOP',
    displayOrder: 5,
  },
  {
    code: 'four-white',
    label: '4 Trắng',
    payoutMultiplier: 14.5,
    pattern: ['white', 'white', 'white', 'white'],
    layoutGroup: 'BOTTOM',
    displayOrder: 1,
  },
  {
    code: 'three-white-one-red',
    label: '3 Trắng 1 Đỏ',
    payoutMultiplier: 1.95,
    pattern: ['white', 'white', 'white', 'red'],
    layoutGroup: 'BOTTOM',
    displayOrder: 2,
  },
  {
    code: 'three-red-one-white',
    label: '3 Đỏ 1 Trắng',
    payoutMultiplier: 1.95,
    pattern: ['red', 'red', 'red', 'white'],
    layoutGroup: 'BOTTOM',
    displayOrder: 3,
  },
  {
    code: 'four-red',
    label: '4 Đỏ',
    payoutMultiplier: 14.5,
    pattern: ['red', 'red', 'red', 'red'],
    layoutGroup: 'BOTTOM',
    displayOrder: 4,
  },
  {
    code: 'four-white-or-four-red',
    label: '4 Trắng & 4 Đỏ',
    payoutMultiplier: 7,
    pattern: ['white', 'white', 'white', 'white', 'red', 'red', 'red', 'red'],
    layoutGroup: 'BOTTOM',
    displayOrder: 5,
  },
];

export const statsHistory = [
  ['4', '1', '2', '3', '2', '1', '1', '2', '1', '2', '2', '1', '2', '1', '2', '3', '2'],
  ['0', '', '1', '', '', '2', '', '1', '', '1', '2', '1', '', '1', '3', '', '2'],
];

export const statsPatternGridData = [
  ['T', 'X', 'T', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
  ['X', '2', 'X', 'X', '', '', '', '', '', '', '', '', '', '', '', '', ''],
  ['T', 'X', '2', 'T', '', '', '', '', '', '', '', '', '', '', '', '', ''],
  ['2', '2', 'T', '2', '2', '', '', '', '', '', '', '', '', '', '', '', ''],
  ['T', 'T', '2', 'T', 'X', '', '', '', '', '', '', '', '', '', '', '', ''],
  ['X', 'X', '', '2', '', '', '', '', '', '', '', '', '', '', '', '', ''],
];

export const essentialQuickBetCodes = [
  'chan',
  'tai',
  'xiu',
  'le',
  'two-two',
  'four-white',
  'three-white-one-red',
  'three-red-one-white',
  'four-red',
  'four-white-or-four-red',
];

export const defaultChipOptions = [
  { label: '10K', value: 10 },
  { label: '20K', value: 20 },
  { label: '50K', value: 50 },
  { label: '100K', value: 100 },
  { label: '200K', value: 200 },
  { label: '500K', value: 500 },
  { label: '1M', value: 1000 },
  { label: '10M', value: 10000 },
];

export const defaultChipLabels = defaultChipOptions.map((chip) => chip.label);

export const styledPlainCodes = new Set(['chan', 'le', 'tai', 'xiu', 'even', 'odd']);

