import {Tag} from "antd";
import {useIntl} from "react-intl";
import {Highlighter} from "../../../../../components/misc/highlighter";
import {useSearchMultiCol} from "../../../../../components/tables/hooks";
import {SORTER, StripeTable, TABLE_HEIGHTS} from "../../../../../components/tables/tableUtils";
import {i18nNumber, truncateString} from "../../../../../helpers/utility";
import prImg from "../../../../../../image/merge-request.svg";
import {allPairs, getHistogramCategories} from "../../../../projects/shared/helper/utils";
export function comboColumnPRInfoRender(text, record, searchText) {
  return (
    text && (
      <div className="tw-grid tw-grid-cols-[25px,auto] tw-grid-rows-[auto,auto] tw-gap-1">
        <div className="tw-row-span-2 tw-self-center">
          <img src={prImg} alt="#" style={{width: "16px", height: "16px"}} />
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
        <div className="">
          <Highlighter
            highlightStyle={{backgroundColor: "#ffc069", padding: 0}}
            searchWords={searchText || ""}
            textToHighlight={record.createdAt || ""}
          />
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

function usePullRequestsDetailTableColumns({intl, filters, selectedFilter}) {
  const prInfoSearchState = useSearchMultiCol(["name", "displayId", "repositoryName"], {
    customRender: comboColumnPRInfoRender,
  });
  const titleSearchState = useSearchMultiCol(["name", "displayId", "epicName"], {
    customRender: (text) => text,
  });
  function testMetric(value, record, metric) {
    const [part1, part2] = filters.allPairsData[filters.categories.indexOf(value)];
    return Number(record[metric]) >= part1 && Number(record[metric]) < part2;
  }
  const columns =  [
    {
      title: "PR Info",
      dataIndex: "name",
      key: "name",
      width: "12%",
      sorter: (a, b) => SORTER.string_compare(a.workItemType, b.workItemType),
      ...prInfoSearchState,
    },
    {
      title: "CARD Info",
      dataIndex: "displayId",
      key: "displayId",
      width: "12%",
      sorter: (a, b) => SORTER.string_compare(a.workItemType, b.workItemType),
      ...titleSearchState,
    },
    {
      title: "State",
      dataIndex: "state",
      key: "state",
      width: "5%",
      sorter: (a, b) => SORTER.string_compare(a.state, b.state),
      render: (text) => <span className="tw-textXs">{text}</span>,
    },
    {
      title: "Age / CycleTime",
      dataIndex: "age",
      key: "age",
      width: "5%",
      sorter: (a, b) => SORTER.number_compare(a.age, b.age),
      defaultFilteredValue: selectedFilter != null ? [selectedFilter] : [],
      filters: filters.categories.map((b) => ({text: b, value: b})),
      onFilter: (value, record) => testMetric(value, record, "age"),
      render: (text) => <span className="tw-textXs">{i18nNumber(intl, Number(text), 2)} days</span>,
    },
  ];

  return columns;
}

function getTransformedData(tableData, intl) {
  // Pull Request Info:
  // repositoryName: displayId
  // name
  // created (??)

  // CardInfo
  // workItemsSummaries

  // state
  // age

  // mergedAt (??)
  return tableData.map((item) => {
    return {
      ...item,
      rowKey: item.key,
      title: item.name,
    };
  });
}

export function PullRequestsDetailTable({tableData, colWidthBoundaries, selectedFilter}) {
  const intl = useIntl();
  const dataSource = getTransformedData(tableData, intl);

  const categories = getHistogramCategories(colWidthBoundaries, "days");
  const allPairsData = allPairs(colWidthBoundaries);
  const columns = usePullRequestsDetailTableColumns({
    intl,
    filters: {categories, allPairsData},
    selectedFilter
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
