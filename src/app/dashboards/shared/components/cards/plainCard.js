import { PlusCircleFilled } from "@ant-design/icons";
import {Popover} from "antd";
import classNames from "classnames";
import {InfoCard} from "../../../../components/misc/info";
import {LabelValue} from "../../../../helpers/components";

export function PlainCard({title, value, children, info, detailsView, className}) {
  return (
    <div className={classNames("tw-flex tw-flex-col tw-space-y-1 tw-rounded-lg tw-border tw-border-solid tw-border-gray-200 tw-bg-white tw-p-2 tw-shadow-md", className)}>
      <div className="tw-flex">
        <LabelValue
          label={title}
          labelClassName="tw-text-lg tw-tracking-wide tw-text-gray-300 tw-normal-case tw-font-normal"
          value={value}
          className="tw-pl-2"
        />

        {detailsView && (
          <div className="detailIcon tw-cursor-pointer tw-rounded-full tw-ml-auto tw-mr-2">
            <Popover
              placement={detailsView.placement}
              title={detailsView.title}
              content={detailsView.content}
              trigger="click"
            >
              <PlusCircleFilled style={{fontSize: "2.5vh", color: "rgba(3, 21, 49, 0.63)"}} />
            </Popover>
          </div>
        )}
        <div className="tw-cursor-pointer tw-rounded-full">
          {info && <InfoCard title={info.title} content={info.content} drawerContent={info.drawerContent} />}
        </div>
      </div>
      {children}
    </div>
  );
}
