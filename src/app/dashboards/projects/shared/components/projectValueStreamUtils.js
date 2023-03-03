import React from "react";
import {useHistory} from "react-router-dom";
import {useWidget, WidgetCore} from "../../../../framework/viz/dashboard/widgetCore";
import {SelectDropdown, useSelect} from "../../../shared/components/select/selectDropdown";
import {useQueryProjectValueStreams} from "../hooks/useQueryValueStreams";

const defaultItem = {key: "all", name: "All"};
export function ValueStreamsDropdown() {
  const {
    data,
    variables: {specsOnly},
  } = useWidget();

  let history = useHistory();

  const nodes = data.project.valueStreams.edges.map((edge) => edge.node);
  const items = nodes.map((node) => ({key: node.key, name: node.name}));
  const uniqueItems = [defaultItem, ...items];
  const {selectedVal, handleChange, valueIndex} = useSelect({uniqueItems, defaultVal: defaultItem});

  function handleChangeWrapper(index) {
    if (index===0) {
      history.push({search: ''})
    } else {
      history.push({search: `?vs=${uniqueItems[index].key}`});
    }
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
