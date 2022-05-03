import {Tag} from "antd";
import {useIntl} from "react-intl";
import {Highlighter} from "../../../../../components/misc/highlighter";
import {useSearchMultiCol} from "../../../../../components/tables/hooks";
import {SORTER, StripeTable, TABLE_HEIGHTS} from "../../../../../components/tables/tableUtils";
import {truncateString} from "../../../../../helpers/utility";
import prImg from "../../../../../../image/merge-request.svg";
import { comboColumnTitleRender } from "../../../../projects/shared/helper/renderers";

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

function usePullRequestsDetailTableColumns({intl}) {
  const prInfoSearchState = useSearchMultiCol(["name", "displayId", "repositoryName"], {
    customRender: comboColumnPRInfoRender,
  });
  const titleSearchState = useSearchMultiCol(["name", "displayId", "epicName"], {
    customRender: text => text,
  });
  return [
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
      // render: (renderMetric),
    },
    {
      title: "Age / CycleTime",
      dataIndex: "age",
      key: "age",
      width: "5%",
      sorter: (a, b) => SORTER.number_compare(a.age, b.age),
      // render: renderMetric,
    },
  ];
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
      title: item.name,
    };
  });
}

export function PullRequestsDetailTable({tableData}) {
  const intl = useIntl();
  const dataSource = getTransformedData(tableData, intl);
  const columns = usePullRequestsDetailTableColumns({
    intl,
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
