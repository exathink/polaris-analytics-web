import React from "react";
import {useIntl} from "react-intl";
import {getServerDate, i18nDate} from "../../../../../../helpers/utility";
import {ClearFilters} from "../../../../components/clearFilters/clearFilters";
import {GroupingSelector} from "../../../../components/groupingSelector/groupingSelector";
import {AppTerms, WorkItemStateTypes} from "../../../../config";
import {VolumeTrendsChart} from "./volumeTrendsChart";

export function VolumeTrendsTableView({
  data,
  dimension,
  measurementPeriod,
  measurementWindow,
  chartConfig,
  view,
  before,
  setBefore,
  specsOnly,
  cardDetailsWidget,
}) {
  const [tabSelection, setTab] = React.useState("volume");
  const intl = useIntl();

  const {cycleMetricsTrends: flowMetricsTrends} = React.useMemo(() => data[dimension], [data, dimension]);
  return (
    <div className="tw-h-full tw-w-full">
      <div className="tw-mr-8 tw-flex">
        <div className="tw-ml-auto tw-flex tw-items-center tw-mb-2">
          {before != null && (
            <div className="tw-mr-2">
              <ClearFilters
                selectedFilter={`${measurementWindow} days ending ${i18nDate(intl, getServerDate(before))}`}
                selectedMetric={`${specsOnly ? AppTerms.specs.display : AppTerms.cards.display} Closed`}
                stateType={WorkItemStateTypes.closed}
                handleClearClick={() => {
                  setBefore?.(undefined);
                }}
              />
            </div>
          )}
          <GroupingSelector
            label={"View"}
            value={tabSelection}
            groupings={[
              {
                key: "volume",
                display: "Volume",
              },
              {
                key: "table",
                display: "Card Detail",
              },
            ]}
            initialValue={tabSelection}
            onGroupingChanged={setTab}
            layout="col"
          />
        </div>
      </div>

      <div className={tabSelection === "table" ? "tw-hidden" : "tw-h-full tw-w-full"}>
        <VolumeTrendsChart
          flowMetricsTrends={flowMetricsTrends}
          measurementPeriod={measurementPeriod}
          measurementWindow={measurementWindow}
          chartConfig={chartConfig}
          view={view}
          specsOnly={specsOnly}
          onSelectionChange={(workItems) => {
            if (workItems.length === 1) {
              const [{measurementDate}] = workItems;
              setTab?.("table");
              setBefore?.(getServerDate(measurementDate));
            }
          }}
        />
      </div>

      {tabSelection === "table" && <div className="tw-h-full tw-w-full">{cardDetailsWidget}</div>}
    </div>
  );
}
