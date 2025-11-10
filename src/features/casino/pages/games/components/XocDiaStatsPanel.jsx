import { getChipClasses, getPatternCellClasses } from '../xocDiaUtils';

const XocDiaStatsPanel = ({
  activeStatsTab,
  onChangeTab,
  columns,
  rows,
  chanLeGrid,
  taiXiuGrid,
}) => {
  const grid = activeStatsTab === '1' ? chanLeGrid : taiXiuGrid;

  return (
    <section className="rounded-xl border border-[#1aab6f]/40 bg-gradient-to-br from-[#0f4c2c] via-[#139257] to-[#17a76a] px-3 py-3 text-white shadow-inner space-y-3">
      <header className="flex items-center gap-2 text-xs font-semibold uppercase">
      <button
        type="button"
        onClick={() => onChangeTab('1')}
        className={`rounded-lg px-3 py-1.5 shadow transition ${
          activeStatsTab === '1'
            ? 'bg-white text-[#0b2919]'
            : 'bg-white/10 text-white/75 hover:bg-white/20 hover:text-white'
        }`}
      >
        Cầu Chẵn / Lẻ
      </button>
      <button
        type="button"
        onClick={() => onChangeTab('2')}
        className={`rounded-lg px-3 py-1.5 shadow transition ${
          activeStatsTab === '2'
            ? 'bg-white text-[#0b2919]'
            : 'bg-white/10 text-white/75 hover:bg-white/20 hover:text-white'
        }`}
      >
        Cầu Tài / Xỉu
      </button>
    </header>

      <div className="space-y-3">
        <div className="rounded-lg border border-white/20 bg-white/10 p-2 shadow-inner">
          <div
            className="grid gap-[3px]"
            style={{
              gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
              gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
            }}
          >
            {grid.map((row, rowIndex) =>
              row.map((cell, cellIndex) => (
                <div
                  key={`${activeStatsTab === '1' ? 'cell' : 'pattern'}-${rowIndex}-${cellIndex}`}
                  className="flex h-5 w-full items-center justify-center rounded bg-white/10"
                >
                  {(() => {
                    if (cell == null) return null;
                    const cellValue =
                      typeof cell === 'object' && cell !== null ? cell.value ?? cell.display ?? '' : cell;
                    const hasValue =
                      cellValue !== '' && cellValue !== null && cellValue !== undefined;
                    if (!hasValue) {
                      return null;
                    }
                    const displayValue =
                      typeof cellValue === 'number' ? cellValue : `${cellValue}`;
                    return activeStatsTab === '1' ? (
                      <span
                        className={`flex h-3.5 w-3.5 items-center justify-center rounded-full border leading-none ${getChipClasses(
                          cell
                        )}`}
                        style={{ fontSize: '10px' }}
                      >
                        {displayValue}
                      </span>
                    ) : (
                      <span
                        className={`flex h-3.5 w-3.5 items-center justify-center rounded-full border leading-none ${getPatternCellClasses(
                          cellValue
                        )}`}
                        style={{ fontSize: '10px' }}
                      >
                        {displayValue}
                      </span>
                    );
                  })()}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default XocDiaStatsPanel;

