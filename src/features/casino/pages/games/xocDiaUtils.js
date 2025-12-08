import { essentialQuickBetCodes } from './xocDiaConfig';

const QUICK_BET_CODE_ALIASES = {
  even: 'chan',
  odd: 'le',
  'three-white': 'tai',
  'three-red': 'xiu',
};

export const parsePatternString = (pattern) => {
  if (!pattern) return [];
  if (Array.isArray(pattern)) return pattern;
  return pattern
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
};

export const formatRatioLabel = (value) => {
  const numeric = Number(value);
  if (Number.isNaN(numeric)) {
    return value ? `1 : ${value}` : '';
  }
  const formatted = Number.isInteger(numeric)
    ? numeric.toFixed(0)
    : numeric.toFixed(2).replace(/\.?0+$/, '');
  return `1 : ${formatted}`;
};

export const formatChipDisplayValue = (value) => {
  if (value == null) {
    return '';
  }

  if (value >= 1000) {
    const millions = value / 1000;
    const formatted = millions.toLocaleString('vi-VN');
    return `${formatted}M`;
  }

  return `${value.toLocaleString('vi-VN')}K`;
};

export const extractUserName = (data) => {
  if (!data || typeof data !== 'object') {
    return '';
  }
  return data.username || data.name || data.displayName || '';
};

export const convertConfigToOption = (config) => {
  const payoutMultiplier = config.payoutMultiplier ?? config.multiplier ?? config.ratioMultiplier ?? 0;
  const feeRate = config.feeRate ?? 0;
  // Nếu có phế, payoutMultiplier đã được trừ phế rồi từ backend, nên hiển thị trực tiếp
  return {
    code: config.code ?? config.id,
    label: config.label ?? config.name ?? '',
    ratio: formatRatioLabel(payoutMultiplier),
    payoutMultiplier,
    feeRate,
    pattern: parsePatternString(config.pattern),
    layoutGroup: (config.layoutGroup || 'TOP').toUpperCase(),
    displayOrder: config.displayOrder ?? 0,
  };
};

export const normalizeQuickBetOptions = (options, defaultOptionMap) => {
  const mergeWithDefault = (option) => {
    if (!option?.code) {
      return option;
    }

    const normalizedCode = option.code.toLowerCase();
    const aliasCode = QUICK_BET_CODE_ALIASES[normalizedCode] || normalizedCode;

    const defaultOption = defaultOptionMap.get(aliasCode);
    if (!defaultOption) {
      const payoutMultiplier = option.payoutMultiplier ?? 0;
      return {
        ...option,
        code: aliasCode,
        originalCode: option.code,
        payoutMultiplier,
        ratio: formatRatioLabel(payoutMultiplier),
      };
    }

    const payoutMultiplier =
      option.payoutMultiplier && option.payoutMultiplier > 0
        ? option.payoutMultiplier
        : defaultOption.payoutMultiplier;

    const pattern =
      option.pattern && option.pattern.length > 0 ? option.pattern : defaultOption.pattern;

    return {
      ...defaultOption,
      ...option,
      code: aliasCode,
      originalCode: option.code,
      payoutMultiplier,
      pattern,
      ratio: formatRatioLabel(payoutMultiplier),
      layoutGroup: defaultOption.layoutGroup,
      displayOrder: defaultOption.displayOrder,
    };
  };

  const optionMap = new Map();
  options.forEach((option) => {
    const merged = mergeWithDefault(option);
    if (merged?.code) {
      optionMap.set(merged.code, merged);
    }
  });

  essentialQuickBetCodes.forEach((code) => {
    if (!optionMap.has(code) && defaultOptionMap.has(code)) {
      optionMap.set(code, defaultOptionMap.get(code));
    }
  });

  const normalized = Array.from(optionMap.values()).map((option) => mergeWithDefault(option));
  normalized.sort((a, b) => a.displayOrder - b.displayOrder);
  return normalized;
};

export const chunkPattern = (pattern, chunkSize = 4) => {
  if (!pattern?.length) {
    return [];
  }
  const chunks = [];
  for (let i = 0; i < pattern.length; i += chunkSize) {
    chunks.push(pattern.slice(i, i + chunkSize));
  }
  return chunks;
};

export const getChipClasses = (value) => {
  if (!value) return null;

  let parity = null;
  let numericValue = value;

  if (typeof value === 'object') {
    parity = typeof value.parity === 'string' ? value.parity.toUpperCase() : null;
    numericValue = value.value;
  }

  const numberValue =
    typeof numericValue === 'number'
      ? numericValue
      : Number.isFinite(Number(numericValue))
        ? Number(numericValue)
        : null;

  const isLe = parity ? parity === 'LE' : numberValue != null ? numberValue % 2 !== 0 : false;

  return isLe ? 'border-white bg-white text-[#1f1f1f]' : 'border-red-500 bg-red-500 text-white';
};

export const getPatternCellClasses = (value) => {
  switch (value) {
    case 'T':
      return 'bg-[#ef4444] text-white border-[#ef4444]';
    case 'X':
      return 'bg-white text-[#0f4c2c] border-white';
    case '2':
      return 'bg-[#2563eb] text-white border-[#1d4ed8]';
    default:
      return '';
  }
};

