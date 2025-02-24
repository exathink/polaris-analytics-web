export function TrendsDetail({
  title,
  comparedToText,
  trendIndicator,
  prevPeriod,
  currentPeriod,
  prevValue,
  currentValue,
  suffix,
}) {
  return (
    <div className="tw-p-2 tw-grid tw-grid-cols-2 tw-gap-8 tw-rounded-md tw-text-gray-300">
      <div className="titleWrapper">
        <div className="title tw-text-xl tw-tracking-wide">{title}</div>
        <div className="subTitle tw-text-xs tw-tracking-tight">{comparedToText}</div>
      </div>
      <div className="value tw-text-2xl">{trendIndicator}</div>
      <div className="prevPeriod">
        <div className="prevPeriodTitle tw-text-base tw-tracking-wide">Prior Period</div>
        <div className="prevPeriodValue tw-text-2xs tw-italic">{prevPeriod}</div>
      </div>

      <div className="currentPeriod">
        <div className="prevPeriodTitle tw-text-base tw-tracking-wide">Current Period</div>
        <div className="prevPeriodValue tw-text-2xs tw-italic">{currentPeriod}</div>
      </div>
      <div className="prevVal tw-flex tw-items-baseline tw-space-x-2">
        <div className="value tw-text-3xl tw-font-medium tw-leading-3 tw-text-black">{prevValue}</div>
        <div className="unit tw-text-sm tw-font-normal">{suffix}</div>
      </div>
      <div className="currentVal tw-flex tw-items-baseline tw-space-x-2">
        <div className="value tw-text-3xl tw-font-medium tw-leading-3 tw-text-black">{currentValue}</div>
        <div className="unit tw-text-sm tw-font-normal">{suffix}</div>
      </div>
    </div>
  );
}
