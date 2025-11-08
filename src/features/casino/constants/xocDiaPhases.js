export const COUNTDOWN_DURATION = 30;

export const PHASE_SEQUENCE = [
  { key: 'countdown', label: '', durationMs: COUNTDOWN_DURATION * 1000 },
  { key: 'betting-closed', label: 'Ngưng cược', durationMs: 1500 },
  { key: 'waiting-result', label: 'Chờ kết quả', durationMs: 3000 },
  { key: 'show-result', label: 'Trả kết quả', durationMs: null, manual: true },
  { key: 'payout', label: 'Trả thưởng', durationMs: 1000 },
  { key: 'invite-bet', label: 'Mời đặt cược', durationMs: 500 },
];

export const TOTAL_PHASE_DURATION = PHASE_SEQUENCE.reduce(
  (accumulator, phase) => accumulator + (phase.durationMs ?? 0),
  0
);

