import { getChipClasses, getPatternCellClasses } from '../xocDiaUtils';

const XocDiaStatsPanel = ({
  activeStatsTab,
  onChangeTab,
  columns,
  rows,
  statsGrid,
  statsPatternGridData,
}) => (
  <section className="rounded-xl border border-[#1aab6f]/50 bg-gradient-to-br from-[#0f4c2c] via-[#139257] to-[#17a76a] px-3 py-3 text-white shadow-inner space-y-3">
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
        Thống kê 2
      </button>
    </header>

    <div className="space-y-3">
      <div className="rounded-lg border border-white/15 bg-white/5 p-2">
        <div
          className="grid"
          style={{
            gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
          }}
        >
          {(activeStatsTab === '1' ? statsGrid : statsPatternGridData).map((row, rowIndex) =>
            row.map((cell, cellIndex) => (
              <div
                key={`${activeStatsTab === '1' ? 'cell' : 'pattern'}-${rowIndex}-${cellIndex}`}
                className="flex h-5 w-full items-center justify-center border border-white/20"
              >
                {(() => {
                  if (cell == null) return null;
                  const cellValue =
                    typeof cell === 'object' && cell !== null ? cell.value ?? '' : cell;
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
                        cell
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

export default XocDiaStatsPanel;

