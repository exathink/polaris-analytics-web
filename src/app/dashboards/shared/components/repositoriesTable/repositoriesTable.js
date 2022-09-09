import React from "react";
import {useQueryRepositories} from "./useQueryRepositories";
import {useSearch} from "../../../../components/tables/hooks";
import {SORTER, StripeTable, TABLE_HEIGHTS} from "../../../../components/tables/tableUtils";
import {ButtonBar} from "../../../../containers/buttonBar/buttonBar";
import Button from "../../../../../components/uielements/button";
import {fromNow} from "../../../../helpers/utility";
import {RepositoryLink} from "../../../shared/navigation/repositoryLink";
import {getActivityLevelFromDate} from "../../../shared/helpers/activityLevel";
import {Highlighter} from "../../../../components/misc/highlighter";
import {TotalCommits, Traceability} from "../flowStatistics/flowStatistics";
import {renderMetric} from "../../../../components/misc/statistic/statistic";
import {RepositoriesDetailDashboard} from "./repositoriesDetailDashboard";
import {Alert, Switch} from "antd";
import {useExcludeRepos} from "./useExcludedRepositories";
import {logGraphQlError} from "../../../../components/graphql/utils";

function customNameRender(text, record, searchText) {
  return (
    text && (
      <RepositoryLink repositoryName={record.name} repositoryKey={record.key}>
        <span style={{cursor: "pointer"}}>
          <Highlighter
            highlightStyle={{backgroundColor: "#ffc069", padding: 0}}
            searchWords={searchText || ""}
            textToHighlight={text.toString()}
          />
        </span>
      </RepositoryLink>
    )
  );
}

const getActionCol = () => {
  return {
    title: "",
    dataIndex: "actions",
    key: "actions",
    width: "4%",
    align: "right",
    render: (name, record) => (
      <ButtonBar>
        <RepositoryLink repositoryName={record.name} repositoryKey={record.key}>
          <Button type={"primary"} size={"small"}>
            Select
          </Button>
        </RepositoryLink>
      </ButtonBar>
    ),
  };
};

function getToggleCol(draftRecordsState, tableData) {
  const [draftState, setDraftState] = draftRecordsState;

  function handleChange({recordKey, checked}) {
    const draftEl = draftState.find((d) => d.key === recordKey);
    if (draftEl) {
      setDraftState(
        draftState.map((d) => {
          if (d.key === recordKey) {
            return {...d, excluded: !checked};
          }
          return d;
        })
      );
    } else {
      setDraftState([...draftState, {key: recordKey, excluded: !checked}]);
    }
  }

  const excludeRecords = tableData.map((x) => {
    const draftEl = draftState.find((d) => d.key === x.key);
    if (draftEl) {
      return {...x, excluded: draftEl.excluded};
    }
    return x;
  });

  return {
    title: "Include",
    dataIndex: "exclude_switch",
    key: "exclude_switch",
    width: "5%",
    align: "center",
    className: "include",
    render: (text, record) => (
      <Switch
        checked={!excludeRecords.find((x) => x.key === record.key)?.excluded}
        onChange={(checked, e) => handleChange({recordKey: record.key, checked: checked})}
        size="small"
        className="!tw-rounded-[100px]"
      />
    ),
  };
}

export function useRepositoriesTableColumns({statusTypes, days}) {
  const nameSearchState = useSearch("name", {customRender: customNameRender});

  const columns = [
    {
      title: "",
      children: [
        {
          title: "Name",
          dataIndex: "name",
          key: "name",
          width: "8%",
          className: "name",
          ...nameSearchState,
        },
      ],
    },
    {
      title: "",
      children: [
        {
          title: "Status",
          dataIndex: "latestCommit",
          key: "activityProfile",
          width: "5%",
          className: "status",
          filters: statusTypes.map((b) => ({text: b, value: b})),
          onFilter: (value, record) => getActivityLevelFromDate(record.latestCommit).display_name.indexOf(value) === 0,
          render: (latestCommit) => getActivityLevelFromDate(latestCommit).display_name,
        },
      ],
    },
    {
      title: (
        <span>
          Activity <sup>Last {days} Days</sup>
        </span>
      ),
      children: [
        {
          title: <span>Contributors</span>,
          dataIndex: "contributorCount",
          key: "contributorCount",
          width: "8%",
          render: renderMetric,
          className: "contributorCount",
          sorter: (a, b) => SORTER.number_compare(a.contributorCount, b.contributorCount),
        },
        {
          title: <span>Commits</span>,
          dataIndex: "traceabilityTrends",
          key: "totalCommits",
          width: "10%",
          className: "commits",
          sorter: (a, b) => {
            return SORTER.number_compare(
              b.traceabilityTrends?.[0]?.totalCommits,
              a.traceabilityTrends?.[0]?.totalCommits
            );
          },
          render: (text, record) => {
            return (
              <TotalCommits
                current={record.traceabilityTrends?.[0]}
                previous={record.traceabilityTrends?.[1]}
                displayType={"cellrender"}
              />
            );
          },
        },
        {
          title: <span>Traceability</span>,
          dataIndex: "traceabilityTrends",
          key: "traceabilityTrends",
          width: "10%",
          className: "traceability",
          sorter: (a, b) => {
            return SORTER.number_compare(
              b.traceabilityTrends?.[0]?.traceability,
              a.traceabilityTrends?.[0]?.traceability
            );
          },
          render: (text, record) => {
            return (
              <Traceability
                current={record.traceabilityTrends?.[0]}
                previous={record.traceabilityTrends?.[1]}
                displayType={"cellrender"}
              />
            );
          },
        },
        {
          title: "Latest Commit",
          dataIndex: "latestCommit",
          key: "latestCommit",
          width: "8%",
          className: "latestCommit",
          sorter: (a, b) => SORTER.date_compare(b.latestCommit, a.latestCommit),
          render: (latestCommit) => fromNow(latestCommit),
        },
      ],
    },
  ];

  return columns;
}

export function RepositoriesTable({tableData, days, loading}) {
  const statusTypes = [...new Set(tableData.map((x) => getActivityLevelFromDate(x.latestCommit).display_name))];
  const columns = [...useRepositoriesTableColumns({statusTypes, days}), getActionCol()];

  return (
    <StripeTable
      columns={columns}
      dataSource={tableData}
      loading={loading}
      height={TABLE_HEIGHTS.FORTY_FIVE}
      rowKey={(record) => record.key}
    />
  );
}

export function RepositoriesEditTable({dimension, instanceKey, tableData, days, loading}) {
  const [draftState, setDraftState] = React.useState([]);
  const statusTypes = [...new Set(tableData.map((x) => getActivityLevelFromDate(x.latestCommit).display_name))];
  const columns = [
    ...useRepositoriesTableColumns({statusTypes, days}),
    getToggleCol([draftState, setDraftState], tableData),
  ];

  const [errorMessage, setErrorMessage] = React.useState();
  const [successMessage, setSuccessMessage] = React.useState();

  // mutation to exclude repos
  const [mutate, {loading: mutationLoading, client}] = useExcludeRepos({
    onCompleted: ({updateProjectExcludedRepositories: {success, errorMessage}}) => {
      if (success) {
        setSuccessMessage("Successfully Updated.");
        client.resetStore();
      } else {
        logGraphQlError("RepositoriesEditTable.useExcludeRepos", errorMessage);
        setErrorMessage(errorMessage);
      }
    },
    onError: (error) => {
      logGraphQlError("RepositoriesEditTable.useExcludeRepos", error);
      // update errorMessage in state
      setErrorMessage(error);
    },
  });

  function handleCancelClick() {
    setDraftState([]);
  }

  function handleSaveClick() {
    const exclusions = draftState.map((x) => ({repositoryKey: x.key, excluded: x.excluded}));

    // call mutation on save button click
    mutate({
      variables: {
        instanceKey: instanceKey,
        exclusions: exclusions,
      },
    });
  }

  function getButtonElements() {
    if (draftState.length === 0 || mutationLoading || successMessage || errorMessage) {
      return null;
    }
    return (
      <React.Fragment>
        <Button type="primary" onClick={handleSaveClick}>
          Save
        </Button>
        <Button type="secondary" onClick={handleCancelClick}>
          Cancel
        </Button>
      </React.Fragment>
    );
  }
  return (
    <div className="">
      <div className="tw-my-2 tw-ml-[80%] tw-flex tw-h-10 tw-items-center tw-space-x-2">
        {errorMessage && (
          <Alert
            message={errorMessage}
            type="error"
            showIcon
            closable
            onClose={() => {
              setErrorMessage(null);
              setDraftState([]);
            }}
          />
        )}
        {successMessage && (
          <Alert
            message={successMessage}
            type="success"
            showIcon
            closable
            onClose={() => {
              setSuccessMessage(null);
              setDraftState([]);
            }}
          />
        )}
        {mutationLoading && (
          <Button className={"shiftRight"} type="primary" loading>
            Processing...
          </Button>
        )}
        {getButtonElements()}
      </div>
      <StripeTable
        columns={columns}
        dataSource={tableData}
        loading={loading}
        height={TABLE_HEIGHTS.FORTY_FIVE}
        rowKey={(record) => record.key}
      />
    </div>
  );
}

export const RepositoriesTableWidget = ({dimension, instanceKey, days = 30, view}) => {
  const {loading, error, data} = useQueryRepositories({dimension, instanceKey, days});

  if (error) return null;

  const edges = data?.[dimension]?.["repositories"]?.["edges"] ?? [];
  const tableData = edges.map((edge) => edge.node).sort((a, b) => SORTER.date_compare(b.latestCommit, a.latestCommit));

  if (view === "detail") {
    return <RepositoriesDetailDashboard dimension={dimension} instanceKey={instanceKey} view={view} />;
  }
  return <RepositoriesTable tableData={tableData} days={days} loading={loading} />;
};
