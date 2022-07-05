import {Popover} from "antd";
import classNames from "classnames";
import {PlusIcon, TrendsIcon} from "../../../../components/misc/customIcons";
import {InfoCard} from "../../../../components/misc/info";

export function MetricCard({
  title,
  subTitle,
  value,
  suffix,
  info,
  trendIndicator,
  target,
  detailsDraft,
  trendsDraft,
  className,
}) {
  return (
    <div
      className={classNames(
        "tw-grid tw-h-full tw-grid-cols-7 tw-rounded-lg tw-border tw-border-solid tw-border-gray-200 tw-bg-white tw-p-2 tw-shadow-md",
        className
      )}
    >
      <div className="title tw-col-span-4">
        <div className="tw-text-base tw-tracking-wide tw-text-gray-300">{title}</div>
        <div className="tw-text-[0.5rem] tw-leading-3 tw-tracking-tight">{subTitle}</div>
      </div>
      <div className="icons tw-col-span-3 tw-col-start-5 tw-flex tw-justify-end tw-space-x-2">
        {trendsDraft && (
          <div className="trendIcon tw-cursor-pointer tw-rounded-full">
            <Popover
              placement={trendsDraft.placement}
              title={trendsDraft.title}
              content={trendsDraft.content}
              trigger="click"
            >
              <TrendsIcon />
            </Popover>
          </div>
        )}
        {detailsDraft && (
          <div className="detailIcon tw-cursor-pointer tw-rounded-full">
            <Popover
              placement={detailsDraft.placement}
              title={detailsDraft.title}
              content={detailsDraft.content}
              trigger="click"
            >
              <PlusIcon />
            </Popover>
          </div>
        )}
        <div className="infoIcon tw-cursor-pointer tw-rounded-full">
          {info && <InfoCard title={info.title} content={info.content} drawerContent={info.drawerContent} />}
        </div>
      </div>

      <div className="valueSuffix tw-col-span-4 tw-self-end">
        <div className="value tw-text-3xl tw-font-medium tw-leading-3">
          {value} <span className="suffix tw-text-sm tw-font-normal">{suffix}</span>
          {target && <div className="tw-text-xs tw-text-gray-300">{target}</div>}
        </div>
      </div>

      <div className="trendIndicator tw-col-span-3 tw-self-end tw-justify-self-end">{trendIndicator}</div>
    </div>
  );
}
