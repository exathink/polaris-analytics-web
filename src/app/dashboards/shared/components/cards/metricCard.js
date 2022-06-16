import classNames from "classnames";
import {InfoCard} from "../../../../components/misc/info";

export function MetricCard({title, value, uom, info, className}) {
  return (
    <div className={classNames("tw-h-full tw-flex tw-flex-col tw-justify-between tw-rounded-lg tw-border tw-border-solid tw-border-gray-100 tw-bg-white tw-p-1 tw-shadow-md", className)}>
      <div className="tw-flex tw-items-center tw-justify-between">
        <div className="tw-textBase">{title}</div>
        <div className="tw-justify-self-end tw-cursor-pointer">
          <InfoCard title={title} content={info && info.headline} drawerContent={info && info.drawerContent} />
        </div>
      </div>
      <div className="tw-flex tw-items-baseline">
        <div className="tw-text-3xl tw-text-opacity-80">{value}</div>
        <div className="tw-textBase tw-ml-2">{uom}</div>
      </div>
    </div>
  );
}


export function MultipleMetricsCard({metrics, className}) {
  return (
    <div
      className={classNames(
        "tw-flex tw-h-full tw-flex-col tw-justify-between tw-rounded-lg tw-border tw-border-solid tw-border-gray-100 tw-bg-white tw-p-1 tw-shadow-md",
        className
      )}
    >
        {metrics.map((m, i) => (
          <div className={classNames("tw-flex tw-flex-row tw-justify-between tw-items-center", i===1 ? "tw-mt-auto": "")} key={m.title}>
            <div className="tw-textBase">{m.title} </div>
            <div className="tw-text-xl">{m.value} <span className="tw-text-sm tw-font-normal tw-text-gray-300">{m.uom}</span></div>
          </div>
        ))}
    </div>
  );
}