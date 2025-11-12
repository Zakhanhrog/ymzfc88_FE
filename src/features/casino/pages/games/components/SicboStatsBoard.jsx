const CATEGORY_BADGES = {
  SMALL:
    'bg-white text-[#0f4c2c] border border-white/30 shadow-[0_0_6px_rgba(15,76,44,0.35)]',
  BIG: 'bg-[#f87171] text-white border border-[#ef4444]/60 shadow-[0_0_6px_rgba(248,113,113,0.45)]',
  TRIPLE:
    'bg-[#10b981] text-white border border-[#10b981]/45 shadow-[0_0_6px_rgba(16,185,129,0.45)]',
};

const SicboStatsBoard = ({ grid, startColumn = 0, columnCount }) => {
  const totalColumns = grid[0]?.length ?? 0;
  const rows = grid.length ?? 0;
  const effectiveStart = Math.max(0, Math.min(startColumn, totalColumns));
  const maxCount = totalColumns - effectiveStart;
  const effectiveCount =
    columnCount == null ? maxCount : Math.max(0, Math.min(columnCount, maxCount));

  if (effectiveCount <= 0 || rows <= 0) {
    return (
      <section className="w-full rounded-2xl border border-[#1aab6f]/40 bg-gradient-to-br from-[#0f4c2c] via-[#139257] to-[#17a76a] px-2 py-2 text-white shadow-inner sm:px-2.5 sm:py-2.5">
        <div className="rounded-xl border border-white/20 bg-white/10 p-1.5 shadow-inner sm:p-[7px]" />
      </section>
    );
  }

  const outerPaddingClass = 'px-2 py-2 text-white shadow-inner sm:px-2.5 sm:py-2.5';

  return (
    <section
      className={`w-full rounded-2xl border border-[#1aab6f]/40 bg-gradient-to-br from-[#0f4c2c] via-[#139257] to-[#17a76a] ${outerPaddingClass}`}
    >
      <div
        className="grid gap-[3px]"
        style={{
          gridTemplateColumns: `repeat(${effectiveCount}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
        }}
      >
        {grid.map((row, rowIndex) =>
          row.slice(effectiveStart, effectiveStart + effectiveCount).map((cell, colIndex) => {
            const key = `sicbo-stat-${rowIndex}-${colIndex + effectiveStart}`;
            return (
              <div key={key} className="relative w-full" style={{ paddingBottom: '100%' }}>
                <div className="absolute inset-0 flex items-center justify-center rounded bg-white/10">
                  {cell ? (
                    <span
                      className={`flex items-center justify-center rounded-full border leading-none text-[10px] sm:text-[11px] md:text-[12px] lg:text-[13px] ${CATEGORY_BADGES[cell.category] ?? CATEGORY_BADGES.SMALL}`}
                      style={{
                        width: '68%',
                        height: '68%',
                        minWidth: '14px',
                        minHeight: '14px',
                        maxWidth: '22px',
                        maxHeight: '22px',
                      }}
                    >
                      {cell.sum}
                    </span>
                  ) : null}
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
};

export default SicboStatsBoard;


