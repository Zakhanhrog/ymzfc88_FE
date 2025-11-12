const LABEL_STYLES = {
  T: 'text-rose-400',
  X: 'text-[#0b1f15]',
  '3': 'text-rose-400',
  '18': 'text-rose-400',
};

const CELL_TEXT_CLASS =
  'flex h-full w-full items-center justify-center font-semibold leading-tight tracking-tight';

const FACE_TEXT_STYLE = {
  fontSize: 'clamp(0.65rem, 1.5vw, 0.9rem)',
};

const LABEL_TEXT_STYLE = {
  fontSize: 'clamp(0.6rem, 1.45vw, 0.85rem)',
};

const SicboResultSequenceBoard = ({ grid }) => {
  const rows = grid.length ?? 0;
  const columns = rows > 0 ? grid[0].length ?? 0 : 0;

  return (
    <section className="w-full h-full rounded-2xl border border-[#1aab6f]/40 bg-gradient-to-br from-[#0f4c2c] via-[#139257] to-[#17a76a] px-1.5 pt-2 pb-1.5 text-white shadow-inner sm:px-2 sm:pt-2.5 sm:pb-2">
      <div
        className="grid gap-[4px]"
        style={{
          gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
        }}
      >
        {grid.map((row, rowIndex) =>
          row.map((cell, colIndex) => {
            const key = `sicbo-detail-${rowIndex}-${colIndex}`;
            const isLastColumn = colIndex === columns - 1;
            const cellBackgroundClass = isLastColumn ? 'bg-white' : 'bg-white/10';
            if (!cell) {
              return (
                <div
                  key={key}
                  className={`flex items-center justify-center rounded ${cellBackgroundClass}`}
                />
              );
            }

            if (cell.type === 'face') {
              const isRedFace = cell.value === 4 || cell.value === 5 || cell.value === 6;
              const faceClass = isRedFace ? 'text-rose-400' : 'text-white';
              return (
                <div key={key} className={`flex items-center justify-center rounded ${cellBackgroundClass}`}>
                  <span className={`${CELL_TEXT_CLASS} ${faceClass}`} style={FACE_TEXT_STYLE}>
                    {cell.value}
                  </span>
                </div>
              );
            }

            const rawValue = cell.value ?? '';
            const label = `${rawValue}`.toUpperCase();
            const labelClass = LABEL_STYLES[label] ?? 'text-amber-300';

            return (
              <div key={key} className={`flex items-center justify-center rounded ${cellBackgroundClass}`}>
                <span className={`${CELL_TEXT_CLASS} ${labelClass}`} style={LABEL_TEXT_STYLE}>
                  {label}
                </span>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
};

export default SicboResultSequenceBoard;


