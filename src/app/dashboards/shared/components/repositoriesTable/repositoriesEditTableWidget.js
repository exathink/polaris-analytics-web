import {SORTER} from "../../../../components/tables/tableUtils";
import {RepositoriesEditTable} from "./repositoriesTable";
import {useQueryRepositories} from "./useQueryRepositories";

export function RepositoriesEditTableWidget({dimension, instanceKey, view, days = 30}) {
  const {loading, error, data} = useQueryRepositories({dimension, instanceKey, days, showExcluded: true});

  if (error) return null;

  const edges = data?.[dimension]?.["repositories"]?.["edges"] ?? [];
  const tableData = edges.map((edge) => edge.node).sort((a, b) => SORTER.date_compare(b.latestCommit, a.latestCommit));
  return <RepositoriesEditTable tableData={tableData} days={days} loading={loading} />;
}
