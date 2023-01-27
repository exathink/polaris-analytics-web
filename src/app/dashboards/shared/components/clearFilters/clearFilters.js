import {Tag} from "antd";
import {ClearFilterIcon} from "../../../../components/misc/customIcons";
import {
  getSelectedMetricColor,
  getSelectedMetricDisplayName,
} from "../../helpers/metricsMeta";

export function ClearFilters({selectedFilter, selectedMetric, stateType, handleClearClick}) {
  return (
    <div
      className="tw-flex tw-cursor-pointer tw-flex-col tw-justify-center tw-gap-1"
      title="Clear Filters"
      onClick={handleClearClick}
    >
      <div className="tw-textXs tw-flex tw-flex-row tw-justify-center tw-gap-1">
        <div>
          <ClearFilterIcon style={{color: getSelectedMetricColor(selectedMetric, stateType)}} />
        </div>
        <div>{getSelectedMetricDisplayName(selectedMetric, stateType)}</div>
      </div>
      <div className="tw-w-full">
        <Tag color={getSelectedMetricColor(selectedMetric, stateType)} className="tw-w-full tw-text-center">
          <span className="tw-px-2">{selectedFilter}</span>
        </Tag>
      </div>
    </div>
  );
}
