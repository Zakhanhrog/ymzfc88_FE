export const defaultChipOptions = [
  { label: '10K', value: 10 },
  { label: '20K', value: 20 },
  { label: '50K', value: 50 },
  { label: '100K', value: 100 },
  { label: '200K', value: 200 },
  { label: '500K', value: 500 },
  { label: '1M', value: 1000 },
  { label: '10M', value: 10000 },
  { label: '20M', value: 20000 },
  { label: '50M', value: 50000 },
];

export const defaultChipLabels = defaultChipOptions.map((chip) => chip.label);

export const SICBO_CUSTOM_CHIP_STORAGE_KEY = 'sicbo_custom_chip';
export const SICBO_CUSTOM_CHIP_EVENT = 'sicbo-custom-chip-updated';

export const defaultSicboQuickBetConfigs = [
  { code: 'sicbo_primary_small', name: 'Xỉu', payoutMultiplier: 0.97, layoutGroup: 'PRIMARY', displayOrder: 0 },
  { code: 'sicbo_primary_big', name: 'Tài', payoutMultiplier: 0.97, layoutGroup: 'PRIMARY', displayOrder: 1 },

  { code: 'sicbo_combo_triple_1', name: 'Bộ ba 1', payoutMultiplier: 20, layoutGroup: 'COMBINATION', displayOrder: 0 },
  { code: 'sicbo_combo_triple_6', name: 'Bộ ba 6', payoutMultiplier: 20, layoutGroup: 'COMBINATION', displayOrder: 1 },
  { code: 'sicbo_combo_triple_2', name: 'Bộ ba 2', payoutMultiplier: 20, layoutGroup: 'COMBINATION', displayOrder: 2 },
  { code: 'sicbo_combo_triple_5', name: 'Bộ ba 5', payoutMultiplier: 20, layoutGroup: 'COMBINATION', displayOrder: 3 },
  { code: 'sicbo_combo_triple_3', name: 'Bộ ba 3', payoutMultiplier: 20, layoutGroup: 'COMBINATION', displayOrder: 4 },
  { code: 'sicbo_combo_triple_4', name: 'Bộ ba 4', payoutMultiplier: 20, layoutGroup: 'COMBINATION', displayOrder: 5 },

  { code: 'sicbo_parity_even', name: 'Chẵn', payoutMultiplier: 0.97, layoutGroup: 'TOTAL_TOP', displayOrder: 0 },
  { code: 'sicbo_total_4', name: 'Tổng 4', payoutMultiplier: 30, layoutGroup: 'TOTAL_TOP', displayOrder: 1 },
  { code: 'sicbo_total_5', name: 'Tổng 5', payoutMultiplier: 18, layoutGroup: 'TOTAL_TOP', displayOrder: 2 },
  { code: 'sicbo_total_6', name: 'Tổng 6', payoutMultiplier: 14, layoutGroup: 'TOTAL_TOP', displayOrder: 3 },
  { code: 'sicbo_total_7', name: 'Tổng 7', payoutMultiplier: 12, layoutGroup: 'TOTAL_TOP', displayOrder: 4 },
  { code: 'sicbo_total_8', name: 'Tổng 8', payoutMultiplier: 8, layoutGroup: 'TOTAL_TOP', displayOrder: 5 },
  { code: 'sicbo_total_9', name: 'Tổng 9', payoutMultiplier: 6, layoutGroup: 'TOTAL_TOP', displayOrder: 6 },
  { code: 'sicbo_total_10', name: 'Tổng 10', payoutMultiplier: 6, layoutGroup: 'TOTAL_TOP', displayOrder: 7 },

  { code: 'sicbo_parity_odd', name: 'Lẻ', payoutMultiplier: 0.97, layoutGroup: 'TOTAL_BOTTOM', displayOrder: 0 },
  { code: 'sicbo_total_17', name: 'Tổng 17', payoutMultiplier: 30, layoutGroup: 'TOTAL_BOTTOM', displayOrder: 1 },
  { code: 'sicbo_total_16', name: 'Tổng 16', payoutMultiplier: 18, layoutGroup: 'TOTAL_BOTTOM', displayOrder: 2 },
  { code: 'sicbo_total_15', name: 'Tổng 15', payoutMultiplier: 14, layoutGroup: 'TOTAL_BOTTOM', displayOrder: 3 },
  { code: 'sicbo_total_14', name: 'Tổng 14', payoutMultiplier: 12, layoutGroup: 'TOTAL_BOTTOM', displayOrder: 4 },
  { code: 'sicbo_total_13', name: 'Tổng 13', payoutMultiplier: 8, layoutGroup: 'TOTAL_BOTTOM', displayOrder: 5 },
  { code: 'sicbo_total_12', name: 'Tổng 12', payoutMultiplier: 6, layoutGroup: 'TOTAL_BOTTOM', displayOrder: 6 },
  { code: 'sicbo_total_11', name: 'Tổng 11', payoutMultiplier: 6, layoutGroup: 'TOTAL_BOTTOM', displayOrder: 7 },

  { code: 'sicbo_single_1', name: 'Một mặt 1', payoutMultiplier: 0.97, layoutGroup: 'SINGLE', displayOrder: 0 },
  { code: 'sicbo_single_2', name: 'Một mặt 2', payoutMultiplier: 0.97, layoutGroup: 'SINGLE', displayOrder: 1 },
  { code: 'sicbo_single_3', name: 'Một mặt 3', payoutMultiplier: 0.97, layoutGroup: 'SINGLE', displayOrder: 2 },
  { code: 'sicbo_single_4', name: 'Một mặt 4', payoutMultiplier: 0.97, layoutGroup: 'SINGLE', displayOrder: 3 },
  { code: 'sicbo_single_5', name: 'Một mặt 5', payoutMultiplier: 0.97, layoutGroup: 'SINGLE', displayOrder: 4 },
  { code: 'sicbo_single_6', name: 'Một mặt 6', payoutMultiplier: 0.97, layoutGroup: 'SINGLE', displayOrder: 5 },

  // Dice pairs - 15 combinations
  { code: 'sicbo_pair_1_2', name: 'Cặp 1-2', payoutMultiplier: 5, layoutGroup: 'DICE_PAIR', displayOrder: 0 },
  { code: 'sicbo_pair_1_3', name: 'Cặp 1-3', payoutMultiplier: 5, layoutGroup: 'DICE_PAIR', displayOrder: 1 },
  { code: 'sicbo_pair_1_4', name: 'Cặp 1-4', payoutMultiplier: 5, layoutGroup: 'DICE_PAIR', displayOrder: 2 },
  { code: 'sicbo_pair_1_5', name: 'Cặp 1-5', payoutMultiplier: 5, layoutGroup: 'DICE_PAIR', displayOrder: 3 },
  { code: 'sicbo_pair_1_6', name: 'Cặp 1-6', payoutMultiplier: 5, layoutGroup: 'DICE_PAIR', displayOrder: 4 },
  { code: 'sicbo_pair_2_3', name: 'Cặp 2-3', payoutMultiplier: 5, layoutGroup: 'DICE_PAIR', displayOrder: 5 },
  { code: 'sicbo_pair_2_4', name: 'Cặp 2-4', payoutMultiplier: 5, layoutGroup: 'DICE_PAIR', displayOrder: 6 },
  { code: 'sicbo_pair_2_5', name: 'Cặp 2-5', payoutMultiplier: 5, layoutGroup: 'DICE_PAIR', displayOrder: 7 },
  { code: 'sicbo_pair_2_6', name: 'Cặp 2-6', payoutMultiplier: 5, layoutGroup: 'DICE_PAIR', displayOrder: 8 },
  { code: 'sicbo_pair_3_4', name: 'Cặp 3-4', payoutMultiplier: 5, layoutGroup: 'DICE_PAIR', displayOrder: 9 },
  { code: 'sicbo_pair_3_5', name: 'Cặp 3-5', payoutMultiplier: 5, layoutGroup: 'DICE_PAIR', displayOrder: 10 },
  { code: 'sicbo_pair_3_6', name: 'Cặp 3-6', payoutMultiplier: 5, layoutGroup: 'DICE_PAIR', displayOrder: 11 },
  { code: 'sicbo_pair_4_5', name: 'Cặp 4-5', payoutMultiplier: 5, layoutGroup: 'DICE_PAIR', displayOrder: 12 },
  { code: 'sicbo_pair_4_6', name: 'Cặp 4-6', payoutMultiplier: 5, layoutGroup: 'DICE_PAIR', displayOrder: 13 },
  { code: 'sicbo_pair_5_6', name: 'Cặp 5-6', payoutMultiplier: 5, layoutGroup: 'DICE_PAIR', displayOrder: 14 },
  
  // Cặp đôi - 6 combinations
  { code: 'sicbo_pair_double_1', name: 'Cặp đôi 1-1', payoutMultiplier: 8, layoutGroup: 'DICE_PAIR_DOUBLE', displayOrder: 0 },
  { code: 'sicbo_pair_double_2', name: 'Cặp đôi 2-2', payoutMultiplier: 8, layoutGroup: 'DICE_PAIR_DOUBLE', displayOrder: 1 },
  { code: 'sicbo_pair_double_3', name: 'Cặp đôi 3-3', payoutMultiplier: 8, layoutGroup: 'DICE_PAIR_DOUBLE', displayOrder: 2 },
  { code: 'sicbo_pair_double_4', name: 'Cặp đôi 4-4', payoutMultiplier: 8, layoutGroup: 'DICE_PAIR_DOUBLE', displayOrder: 3 },
  { code: 'sicbo_pair_double_5', name: 'Cặp đôi 5-5', payoutMultiplier: 8, layoutGroup: 'DICE_PAIR_DOUBLE', displayOrder: 4 },
  { code: 'sicbo_pair_double_6', name: 'Cặp đôi 6-6', payoutMultiplier: 8, layoutGroup: 'DICE_PAIR_DOUBLE', displayOrder: 5 },
];

export const buildSicboQuickBetMap = (configs = []) => {
  const map = {};
  defaultSicboQuickBetConfigs.forEach((item) => {
    map[item.code] = { ...item };
  });
  (configs || []).forEach((item) => {
    if (!item || !item.code) return;
    map[item.code] = {
      ...map[item.code],
      ...item,
      payoutMultiplier:
        item.payoutMultiplier !== undefined && item.payoutMultiplier !== null
          ? Number(item.payoutMultiplier)
          : map[item.code]?.payoutMultiplier,
    };
  });
  return map;
};

