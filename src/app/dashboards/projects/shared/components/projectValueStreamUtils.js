import {useHistory} from "react-router-dom";
import {useWidget, WidgetCore} from "../../../../framework/viz/dashboard/widgetCore";
import {SelectDropdown, useSelect} from "../../../shared/components/select/selectDropdown";
import {useQueryProjectValueStreams} from "../hooks/useQueryValueStreams";

export function ValueStreamsDropdown() {
  const {
    data,
    variables: {specsOnly},
  } = useWidget();

  let history = useHistory();

  const nodes = data.project.valueStreams.edges.map((edge) => edge.node);
  const uniqueItems = nodes.map((node) => ({key: node.key, name: node.name}));
  const {selectedVal, handleChange, valueIndex} = useSelect({uniqueItems, defaultVal: uniqueItems[0].name});

  function handleChangeWrapper(index) {
    history.push(`?vs=${uniqueItems[index].key}`, uniqueItems[index]);
    handleChange(index);
  }

  return (
    <div className="tw-ml-2">
      <SelectDropdown uniqueItems={uniqueItems} handleChange={handleChangeWrapper} />
    </div>
  );
}

export function ProjectValueStreamsWidget({context}) {
  const instanceKey = context.getInstanceKey("project");
  const result = useQueryProjectValueStreams({instanceKey});

  return (
    <WidgetCore result={result} errorContext="ValueStreamsWidget.useQueryValueStreams">
      <ValueStreamsDropdown />
    </WidgetCore>
  );
}
