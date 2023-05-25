import {Tag} from "antd";
import classNames from "classnames";

export function LabelValue({label, value, uom, className, labelClassName, valueClassName}) {
  return (
    <div className={classNames("tw-flex tw-items-baseline", className)}>
      <div className={classNames("tw-text-sm tw-font-medium tw-uppercase", labelClassName)}>{label}</div>
      <div className={classNames("tw-ml-2 tw-text-lg tw-font-semibold", valueClassName)}>{value}</div>
      {uom && <div className="tw-ml-1 tw-text-xs">{uom}</div>}
    </div>
  );
}

export function Label({label, className}) {
  return <div className={classNames("tw-text-lg tw-tracking-wide tw-text-gray-300", className)}>{label}</div>;
}

const TAG_COLOR = "#108ee9";
export function CustomTag({children}) {
  return (
    <Tag color={TAG_COLOR} style={{marginTop: "5px"}}>
      {children}
    </Tag>
  );
}
