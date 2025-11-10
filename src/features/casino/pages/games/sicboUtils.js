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

