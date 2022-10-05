import { InfoCard } from "../../../../components/misc/info";
import {Label} from "../../../../helpers/components";

export function PlainCard({title, children, info}) {
  return (
    <div className="tw-flex tw-h-full tw-flex-col tw-rounded-lg tw-border tw-border-solid tw-border-gray-200 tw-bg-white tw-p-2 tw-shadow-md tw-space-y-1">
      <div className="tw-flex tw-justify-between">
        <Label label={title} className="tw-pl-2" />
        <div className="tw-cursor-pointer tw-rounded-full">
          {info && <InfoCard title={info.title} content={info.content} drawerContent={info.drawerContent} />}
        </div>
      </div>
      {children}
    </div>
  );
}
