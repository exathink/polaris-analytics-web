

export function MetricCard({title, value, uom}) {
  return (
    <div className="tw-rounded-lg tw-bg-white tw-p-1 tw-shadow-md tw-border tw-border-solid tw-border-gray-100">
      <div className="tw-textBase">{title}</div>
      <div className="tw-flex tw-items-baseline">
        <div className="tw-text-3xl tw-text-opacity-80">{value}</div>
        <div className="tw-textBase tw-ml-2">{uom}</div>
      </div>
    </div>
  );
}
