import classNames from "classnames";

export function LabelValue({label, value, className, labelClassName, valueClassName}) {
  return (
    <div className={classNames("tw-flex tw-items-baseline", className)}>
      <div className={classNames("label tw-text-sm tw-font-medium tw-uppercase", labelClassName)}>{label}</div>
      <div className={classNames("value tw-ml-2 tw-text-lg tw-font-semibold", valueClassName)}>{value}</div>
    </div>
  );
}