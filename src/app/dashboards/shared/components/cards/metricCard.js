import classNames from "classnames";
import {PlusIcon, TrendsIcon} from "../../../../components/misc/customIcons";
import {InfoCard} from "../../../../components/misc/info";

export function MetricCard({title, subTitle, value, suffix, info, trendIndicator, target, className}) {
  return (
    <div
      className={classNames(
        "tw-grid tw-h-full tw-grid-cols-7 tw-rounded-lg tw-border tw-border-solid tw-border-gray-100 tw-bg-white tw-p-1 tw-shadow-md",
        className
      )}
    >
      <div className="title tw-col-span-3">
        <div className="tw-text-base tw-text-gray-300 tw-tracking-wide">{title}</div>
        <div>{subTitle}</div>
      </div>
      <div className="icons tw-col-span-3 tw-col-start-5 tw-flex tw-justify-end tw-space-x-2">
        <div className="trendIcon tw-cursor-pointer tw-rounded-full">
          <TrendsIcon />
        </div>
        <div className="detailIcon tw-cursor-pointer tw-rounded-full">
          <PlusIcon />
        </div>
        <div className="infoIcon tw-cursor-pointer tw-rounded-full">
          {info && <InfoCard title={info.title} content={info.content} drawerContent={info.drawerContent} />}
        </div>
      </div>

      <div className="valueSuffix tw-col-span-4 tw-self-end">
        <div className="value tw-text-3xl tw-font-medium">
          {value} <span className="suffix tw-text-sm tw-font-normal">{suffix}</span>
          {target && <div className="tw-text-xs tw-text-gray-300">{target}</div>}
        </div>
      </div>

      <div className="trendIndicator tw-col-span-3">{trendIndicator}</div>
    </div>
  );
}
