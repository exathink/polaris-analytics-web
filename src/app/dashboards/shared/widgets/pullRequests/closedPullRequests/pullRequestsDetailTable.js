import {Tag, Tooltip} from "antd";
import {useIntl} from "react-intl";
import {Highlighter} from "../../../../../components/misc/highlighter";
import {useSearchMultiCol} from "../../../../../components/tables/hooks";
import {SORTER, StripeTable, TABLE_HEIGHTS} from "../../../../../components/tables/tableUtils";
import {fromNow, i18nNumber, TOOLTIP_COLOR, truncateString} from "../../../../../helpers/utility";
import {allPairs, getHistogramCategories} from "../../../../projects/shared/helper/utils";
import {formatDateTime} from "../../../../../i18n";
import {getPullRequestStateTypeIcon} from "../../../../projects/shared/helper/renderers";
import {WorkItemStateTypeColor} from "../../../config";
import {ClosedPrIcon, MergedPrIcon, OpenPrIcon} from "../../../../../components/misc/customIcons";

const PrComponentsMap = {
  merged: <MergedPrIcon />,
  closed: <ClosedPrIcon />,
  open: <OpenPrIcon />
};

export function comboColumnPRInfoRender(text, record, searchText) {
  const IconComponent = PrComponentsMap[record.state];
  return (
    text && (
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
              textToHighlight={record.createdAt || ""}
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
  return (text, record) => {
    const fullNodeWithTooltip = (
      <div>
        {record.workItemsSummaries.map((x) => (
          <CustomTag key={x.displayId} onClick={() => handleClick(x.key)} state={x.state}>
            {truncateString(x.displayId, 16, TAG_COLOR)}
          </CustomTag>
        ))}
      </div>
    );
    const fullNode = (
      <div>
        {record.workItemsSummaries.map((x) => (
          <CustomTag key={x.displayId} onClick={() => handleClick(x.key)} state={x.state}>
            {x.displayId}
          </CustomTag>
        ))}
      </div>
    );
    const partialNode = (
      <div>
        {record.workItemsSummaries.slice(0, 2).map((x) => (
          <CustomTag key={x.displayId} onClick={() => handleClick(x.key)} state={x.state}>
            {truncateString(x.displayId, 16, TAG_COLOR)}
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
  closed: "CycleTime",
  both: "Age / CycleTime"
}

function usePullRequestsDetailTableColumns({intl, filters, selectedFilter, setShowPanel, setWorkItemKey, prStateType}) {
  const prInfoSearchState = useSearchMultiCol(["name", "displayId", "repositoryName"], {
    customRender: comboColumnPRInfoRender,
  });
  const titleSearchState = useSearchMultiCol(["name", "displayId", "epicName"], {
    customRender: allCardsRender(setShowPanel, setWorkItemKey),
  });
  function testMetric(value, record, metric) {
    const [part1, part2] = filters.allPairsData[filters.categories.indexOf(value)];
    return Number(record[metric]) >= part1 && Number(record[metric]) < part2;
  }
  const columns = [
    {
      title: "PR Info",
      dataIndex: "name",
      key: "name",
      width: "12%",
      sorter: (a, b) => SORTER.string_compare(a.name, b.name),
      ...prInfoSearchState,
    },
    {
      title: "CARD Info",
      dataIndex: "displayId",
      key: "displayId",
      width: "7%",
      ...titleSearchState,
    },
    {
      title: "Repository",
      dataIndex: "repositoryName",
      key: "repositoryName",
      width: "7%",
      sorter: (a, b) => SORTER.string_compare(a.repositoryName, b.repositoryName),
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
      defaultFilteredValue: selectedFilter != null ? [selectedFilter] : [],
      filters: filters.categories.map((b) => ({text: b, value: b})),
      onFilter: (value, record) => testMetric(value, record, "age"),
      render: (text) => <span className="tw-textXs">{i18nNumber(intl, Number(text), 2)} days</span>,
    },
    {
      title: "Merged At",
      dataIndex: "endDate",
      key: "endDate",
      width: "7%",
      sorter: (a, b) => SORTER.date_compare(a.endDate, b.endDate),
      render: (text) => <span className="tw-textXs">{text}</span>,
    },
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
  const dataSource = getTransformedData(tableData, intl);

  const categories = getHistogramCategories(colWidthBoundaries, "days");
  const allPairsData = allPairs(colWidthBoundaries);
  const columns = usePullRequestsDetailTableColumns({
    intl,
    filters: {categories, allPairsData},
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
      height={TABLE_HEIGHTS.FORTY_FIVE}
      rowKey={(record) => record.rowKey}
    />
  );
}
