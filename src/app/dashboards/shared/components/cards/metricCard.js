import {BarChartOutlined} from "@ant-design/icons";
import {Popover, Tooltip} from "antd";
import classNames from "classnames";
import { InfoCard } from "../../../../components/misc/info";
import {Colors} from "../../config";

export function MetricCard({
  title,
  subTitle,
  value,
  suffix,
  info,
  trendIndicator,
  supportingMetric,
  detailsView,
  trendsView,
  bottomRightView,
  className,
  displayBag={}
}) {
  const color = Colors.DashboardWidgetIcons.primary;
  const {iconsShiftLeft=false, trendValueClass="", valueClass} = displayBag;

  const colSpanClass = bottomRightView || trendValueClass ? "tw-col-span-3": "tw-col-span-2";
  const trendIndicatorElement = (
    <div className={classNames("trendIndicator tw-self-end tw-justify-self-end", trendValueClass, colSpanClass, trendsView ? "tw-cursor-pointer": "")}>
      {trendsView ? trendIndicator: bottomRightView.bottomRightElement }
    </div>
  );

  return (
    <div
      className={classNames(
        "tw-grid tw-h-full tw-grid-cols-7 tw-gap-y-4 tw-rounded-lg tw-border tw-border-solid tw-border-gray-200 tw-bg-white tw-p-2 tw-shadow-md",
        className
      )}
    >
      <div className="title tw-col-span-5">
        <div className="tw-text-lg tw-tracking-wide tw-text-gray-300">{title}</div>
        <div className="tw-text-xs tw-tracking-tight">{subTitle}</div>
      </div>
      <div
        className={classNames(
          "icons tw-col-start-7 tw-flex tw-justify-end tw-space-x-1",
          iconsShiftLeft ? "tw-mr-6" : ""
        )}
      >
        {detailsView && (
          <Tooltip title={"Show Details"}>
            <div className="detailIcon tw-cursor-pointer tw-rounded-full">
              <Popover
                placement={detailsView.placement}
                title={detailsView.title}
                content={detailsView.content}
                trigger="click"
                // destroyTooltipOnHide
              >
                <BarChartOutlined style={{ fontSize: "2.5vh", color: color }} />
              </Popover>
            </div>
          </Tooltip>
        )}
        <div className="infoIcon tw-cursor-pointer tw-rounded-full">
          {info && <InfoCard title={info.title} content={info.content} drawerContent={info.drawerContent} />}
        </div>
      </div>

      <div className={classNames("valueSuffix tw-self-end", trendValueClass || bottomRightView ? "tw-col-span-4" : "tw-col-span-5")}>
        <div className={classNames("value tw-font-medium tw-leading-3", valueClass??"tw-text-4xl")}>
          {value} <span className="suffix tw-text-sm tw-font-normal">{suffix}</span>
          {supportingMetric && <div className="tw-text-xs tw-text-gray-300">{supportingMetric}</div>}
        </div>
      </div>

      {trendsView ? (
        <Popover placement={trendsView.placement} title={trendsView.title} content={trendsView.content} trigger="hover">
          {trendIndicatorElement}
        </Popover>
      ) : (
        <Popover placement={bottomRightView.placement} title={bottomRightView.title} content={bottomRightView.content} trigger="hover">
          {trendIndicatorElement}
        </Popover>
      )}
    </div>
  );
}
