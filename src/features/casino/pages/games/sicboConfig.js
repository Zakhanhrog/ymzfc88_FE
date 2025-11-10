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

export const SICBO_CUSTOM_CHIP_STORAGE_KEY = 'sicbo_custom_chip';
export const SICBO_CUSTOM_CHIP_EVENT = 'sicbo-custom-chip-updated';

