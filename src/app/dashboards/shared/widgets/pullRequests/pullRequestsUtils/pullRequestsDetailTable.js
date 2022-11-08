import {Tag, Tooltip} from "antd";
import {useIntl} from "react-intl";
import {Highlighter} from "../../../../../components/misc/highlighter";
import {useSearchMultiCol} from "../../../../../components/tables/hooks";
import {SORTER, StripeTable} from "../../../../../components/tables/tableUtils";
import {fromNow, humanizeDuration, i18nNumber, TOOLTIP_COLOR, truncateString} from "../../../../../helpers/utility";
import {allPairs, getHistogramCategories} from "../../../../projects/shared/helper/utils";
import {formatDateTime} from "../../../../../i18n";
import {getPullRequestStateTypeIcon} from "../../../../projects/shared/helper/renderers";
import {AppTerms, WorkItemStateTypeColor} from "../../../config";
import {ClosedPrIcon, MergedPrIcon, OpenPrIcon} from "../../../../../components/misc/customIcons";
import {LabelValue} from "../../../../../helpers/components";
import React from "react";
import {useSummaryStats} from "../../../hooks/useSummaryStats";

const summaryStatsColumns = {
  age: "Days",
}

const PrComponentsMap = {
  merged: <MergedPrIcon />,
  closed: <ClosedPrIcon />,
  open: <OpenPrIcon />
};

export function comboColumnPRInfoRender(text, record, searchText) {
  const IconComponent = PrComponentsMap[record.state];
  return (
    text && (
      <a href={record.webUrl} target="_blank" rel="noreferrer">
      <div className="tw-grid tw-grid-cols-[25px,auto] tw-grid-rows-[auto,auto] tw-gap-1">
        <div className="tw-row-span-2 tw-self-center">
          {IconComponent}
        </div>
        <div className="">
          {searchText ? (
            <Highlighter
              highlightStyle={{backgroundColor: "#ffc069", padding: 0}}
              searchWords={searchText || ""}
              textToHighlight={text}
            />
          ) : (
            truncateString(text, 38, "#6b7280")
          )}
        </div>
        <div className="tw-flex">
          <div className="tw-textXs">
            <Highlighter
              highlightStyle={{backgroundColor: "#ffc069", padding: 0}}
              searchWords={searchText || ""}
              textToHighlight={`Created ${record.createdAt}` || ""}
            />
          </div>

          {record.repositoryName && (
            <Tag color="#108ee9" style={{marginLeft: "30px"}}>
              {searchText ? (
                <Highlighter
                  highlightStyle={{backgroundColor: "#ffc069", padding: 0}}
                  searchWords={searchText || ""}
                  textToHighlight={`#${record.displayId}: ${record.repositoryName}` || ""}
                />
              ) : (
                truncateString(`#${record.displayId}: ${record.repositoryName}`, 25, "#108ee9")
              )}
            </Tag>
          )}
        </div>
      </div>
      </a>
    )
  );
}

const TAG_COLOR = "#108ee9";
function CustomTag({children, onClick, state}) {
  return (
    <div className="tw-cursor-pointer">
      <Tag color={WorkItemStateTypeColor[state]} style={{marginTop: "5px"}} onClick={onClick}>
        {children}
      </Tag>
    </div>
  );
}

function allCardsRender(setShowPanel, setWorkItemKey) {
  function handleClick(key) {
    setShowPanel(true);
    setWorkItemKey(key);
  }

  const getName = (name) => (
    <div>
      {name}
    </div>
  );

  return (text, record) => {
    const fullNodeWithTooltip = (
      <div>
        {record.workItemsSummaries.map((x) => (
          <CustomTag key={x.displayId} onClick={() => handleClick(x.key)} state={x.stateType}>
            <Tooltip title={getName(x.name)} color={WorkItemStateTypeColor[x.stateType]}>
              {truncateString(x.displayId, 16, TAG_COLOR)}
            </Tooltip>
          </CustomTag>
        ))}
      </div>
    );
    const fullNode = (
      <div>
        {record.workItemsSummaries.map((x) => (
          <CustomTag key={x.displayId} onClick={() => handleClick(x.key)} state={x.stateType}>
            {x.displayId}
          </CustomTag>
        ))}
      </div>
    );


    const partialNode = (
      <div>
        {record.workItemsSummaries.slice(0, 2).map((x) => (
          <CustomTag key={x.displayId} onClick={() => handleClick(x.key)} state={x.stateType}>
            <Tooltip title={getName(x.name)} color={WorkItemStateTypeColor[x.stateType]}>
              {truncateString(x.displayId, 16, TAG_COLOR)}
            </Tooltip>
          </CustomTag>
        ))}
      </div>
    );
    if (record.workItemsSummaries.length > 2) {
      return (
        <div>
          {partialNode}
          <div style={{cursor: "pointer"}}>
            <Tooltip title={fullNode} color={TOOLTIP_COLOR}>
              <span style={{fontSize: "20px", color: TAG_COLOR}}>...</span>
            </Tooltip>
          </div>
        </div>
      );
    }
    return fullNodeWithTooltip;
  };
}

const PRStateTypeMap = {
  open: "Age",
  closed: "Time to Review",
  both: "Age / Time to Review"
}

function usePullRequestsDetailTableColumns({intl, filters, selectedFilter, setShowPanel, setWorkItemKey, prStateType}) {
  const prInfoSearchState = useSearchMultiCol(["name", "displayId", "repositoryName"], {
    customRender: comboColumnPRInfoRender,
  });

  function testMetric(value, record, metric) {
    const [part1, part2] = filters.allPairsData[filters.categories.indexOf(value)];
    return Number(record[metric]) >= part1 && Number(record[metric]) < part2;
  }

  let lastColArr = [];
  if (prStateType === "closed") {
    lastColArr = [
      {
        title: "Completed At",
        dataIndex: "endDate",
        key: "endDate",
        width: "7%",
        sorter: (a, b) => SORTER.date_compare(a.endDate, b.endDate),
        render: (text) => <span className="tw-textXs">{text}</span>,
      },
    ];
  }

  const columns = [
    {
      title: "Pull Request",
      dataIndex: "name",
      key: "name",
      width: "12%",
      sorter: (a, b) => SORTER.string_compare(a.name, b.name),
      ...prInfoSearchState,
    },
    {
      title: AppTerms.spec.display,
      dataIndex: "displayId",
      key: "displayId",
      width: "5%",
      render: allCardsRender(setShowPanel, setWorkItemKey),
    },
    {
      title: "Repository",
      dataIndex: "repositoryName",
      key: "repositoryName",
      width: "7%",
      sorter: (a, b) => SORTER.string_compare(a.repositoryName, b.repositoryName),
      filters: filters.repos.map((b) => ({text: b, value: b})),
      onFilter: (value, record) => record.repositoryName.indexOf(value) === 0,
      render: (text) => <span className="tw-textXs">{text}</span>,
    },
    {
      title: "State",
      dataIndex: "state",
      key: "state",
      width: "5%",
      sorter: (a, b) => SORTER.string_compare(a.state, b.state),
      render: (text) => (
        <div className="tw-flex tw-items-center">
          {getPullRequestStateTypeIcon(text)}
          <span className="tw-textXs">{text}</span>
        </div>
      ),
    },
    {
      title: PRStateTypeMap[prStateType],
      dataIndex: "age",
      key: "age",
      width: "5%",
      sorter: (a, b) => SORTER.number_compare(a.age, b.age),
      defaultFilteredValue: selectedFilter != null ? [selectedFilter] : null,
      filters: filters.categories.map((b) => ({text: b, value: b})),
      onFilter: (value, record) => testMetric(value, record, "age"),
      render: (text) => <span className="tw-textXs">{humanizeDuration(i18nNumber(intl, Number(text), 2))}</span>,
    },
    ...lastColArr
  ];

  return columns;
}

function getTransformedData(tableData, intl) {
  return tableData.map((item) => {
    return {
      ...item,
      rowKey: item.key,
      title: item.name,
      endDate: formatDateTime(intl, item.endDate),
      createdAt: fromNow(item.createdAt),
    };
  });
}

export function PullRequestsDetailTable({tableData, colWidthBoundaries, selectedFilter, setShowPanel, setWorkItemKey, prStateType}) {
  const intl = useIntl();
  const {appliedFilters, appliedSorter, appliedName, handleChange, getAvgFiltersData, getAvgSortersData} = useSummaryStats({summaryStatsColumns, extraFilter: selectedFilter ? "age": undefined});

  const dataSource = getTransformedData(tableData, intl);
  const repos = [...new Set(tableData.map((x) => x.repositoryName))];
  const categories = getHistogramCategories(colWidthBoundaries, "days");
  const allPairsData = allPairs(colWidthBoundaries);
  const columns = usePullRequestsDetailTableColumns({
    intl,
    filters: {categories, allPairsData, repos},
    selectedFilter,
    setShowPanel,
    setWorkItemKey,
    prStateType
  });

  return (
    <StripeTable
      columns={columns}
      dataSource={dataSource}
      testId="pull-requests-detail-table"
      onChange={handleChange}
      rowKey={(record) => record.rowKey}
      renderTableSummary={(pageData) => {
        const avgData = getAvgSortersData(pageData);
        const avgFiltersData = getAvgFiltersData(pageData);

          return (
            <>
              <LabelValue label="Pull Requests" value={pageData?.length} />
              {avgFiltersData
                .filter((x) => summaryStatsColumns[x.appliedFilter])
                .map((x, i) => {
                  return (
                    <LabelValue
                      key={x.appliedFilter}
                      label={`Avg. ${x.appliedFilter === "age" ? PRStateTypeMap[prStateType] : x.appliedFilter}`}
                      value={i18nNumber(intl, x.average, 2)}
                      uom={summaryStatsColumns[x.appliedFilter]}
                    />
                  );
                })}
              {avgData !== 0 && avgData != null && appliedFilters.includes(appliedSorter) === false && (
                <LabelValue
                  key={appliedSorter}
                  label={`Avg. ${appliedName}`}
                  value={i18nNumber(intl, avgData, 2)}
                  uom={summaryStatsColumns[appliedSorter]}
                />
              )}
            </>
          );
        }}
    />
  );
}
