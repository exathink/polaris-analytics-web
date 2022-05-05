import {SORTER} from "../../../../components/tables/tableUtils";
import {useQueryRepositories} from "./useQueryRepositories";

export function RepositoriesEditTableWidget({dimension, instanceKey, view, days = 30}) {
  const {loading, error, data} = useQueryRepositories({dimension, instanceKey, days});

  if (error) return null;

  const edges = data?.[dimension]?.["repositories"]?.["edges"] ?? [];
  const tableData = edges.map((edge) => edge.node).sort((a, b) => SORTER.date_compare(b.latestCommit, a.latestCommit));
  return <div>Edit Table</div>;
}
