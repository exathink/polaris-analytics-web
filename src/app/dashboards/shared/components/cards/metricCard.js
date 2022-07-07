import {PlusCircleFilled} from "@ant-design/icons";
import {Popover} from "antd";
import classNames from "classnames";
import {TrendsIcon} from "../../../../components/misc/customIcons";
import {InfoCard} from "../../../../components/misc/info";
import {Colors} from "../../config";

export function MetricCard({
  title,
  subTitle,
  value,
  suffix,
  info,
  trendIndicator,
  target,
  detailsView,
  trendsView,
  className,
}) {
  const color = Colors.DashboardWidgetIcons.primary;
  return (
    <div
      className={classNames(
        "tw-grid tw-h-full tw-grid-cols-7 tw-rounded-lg tw-border tw-border-solid tw-border-gray-200 tw-bg-white tw-p-2 tw-shadow-md",
        className
      )}
    >
      <div className="title tw-col-span-4">
        <div className="tw-text-base tw-tracking-wide tw-text-gray-300">{title}</div>
        <div className="tw-text-xs tw-tracking-tight">{subTitle}</div>
      </div>
      <div className="icons tw-col-span-3 tw-col-start-5 tw-flex tw-justify-end tw-space-x-2">
        {trendsView && (
          <div className="trendIcon tw-cursor-pointer tw-rounded-full">
            <Popover
              placement={trendsView.placement}
              title={trendsView.title}
              content={trendsView.content}
              trigger="click"
            >
              <TrendsIcon style={{color: color}}/>
            </Popover>
          </div>
        )}
        {detailsView && (
          <div className="detailIcon tw-cursor-pointer tw-rounded-full">
            <Popover
              placement={detailsView.placement}
              title={detailsView.title}
              content={detailsView.content}
              trigger="click"
            >
              <PlusCircleFilled style={{fontSize: "2.5vh", color: color}} />
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
