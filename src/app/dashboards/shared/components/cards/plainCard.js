import { InfoCard } from "../../../../components/misc/info";
import {LabelValue} from "../../../../helpers/components";

export function PlainCard({title, value, children, info}) {
  return (
    <div className="tw-flex tw-h-full tw-flex-col tw-rounded-lg tw-border tw-border-solid tw-border-gray-200 tw-bg-white tw-p-2 tw-shadow-md tw-space-y-1">
      <div className="tw-flex tw-justify-between">
        <LabelValue label={title} labelClassName="tw-text-lg tw-tracking-wide tw-text-gray-300 tw-normal-case tw-font-normal" value={value} className="tw-pl-2" />
        <div className="tw-cursor-pointer tw-rounded-full">
          {info && <InfoCard title={info.title} content={info.content} drawerContent={info.drawerContent} />}
        </div>
      </div>
      {children}
    </div>
  );
}
