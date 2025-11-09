import XocDiaQuickBetButton from './XocDiaQuickBetButton';

const XocDiaQuickBetBoard = ({
  columnOptions,
  selectedQuickBets,
  isBettingLocked,
  plainEnabledCodes,
  styledPlainCodes,
  onSelectQuickBet,
}) => {
  const renderColumn = (options, columnKey) =>
    options.map((option, index) =>
      option ? (
        <XocDiaQuickBetButton
          key={option.code}
          option={option}
          selectedBet={selectedQuickBets[option.code]}
          isBettingLocked={isBettingLocked}
          plainEnabledCodes={plainEnabledCodes}
          styledPlainCodes={styledPlainCodes}
          onSelect={onSelectQuickBet}
        />
      ) : (
        <div key={`${columnKey}-placeholder-${index}`} className="pointer-events-none opacity-0" />
      )
    );

  return (
    <div
      className="grid gap-1 sm:gap-1.5 items-stretch"
      style={{ gridTemplateColumns: 'repeat(4, minmax(0, 1fr))' }}
    >
      <div className="grid h-full grid-rows-3 gap-1 sm:gap-1.5">{renderColumn(columnOptions.left, 'left')}</div>
      <div className="grid h-full grid-rows-2 gap-1 sm:gap-1.5">
        {renderColumn(columnOptions.middleLeft, 'middle-left')}
      </div>
      <div className="grid h-full grid-rows-2 gap-1 sm:gap-1.5">
        {renderColumn(columnOptions.middleRight, 'middle-right')}
      </div>
      <div className="grid h-full grid-rows-3 gap-1 sm:gap-1.5">
        {renderColumn(columnOptions.right, 'right')}
      </div>
    </div>
  );
};

export default XocDiaQuickBetBoard;

