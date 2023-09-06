import React from "react";
import {useHistory, useLocation} from "react-router-dom";
import {useWidget, WidgetCore} from "../../../../framework/viz/dashboard/widgetCore";
import {SelectDropdown, useSelect} from "../../../shared/components/select/selectDropdown";
import {useQueryProjectValueStreams} from "../hooks/useQueryValueStreams";
import {useQueryParamState} from "../helper/hooks";
import {Col, Drawer, Form, Input, Row, Select} from "antd";
import Button from "../../../../../components/uielements/button";
import {useQueryReleases} from "../hooks/useQueryReleases";
import {ProjectDashboard, useProjectContext} from "../../projectDashboard";
const {Option} = Select;

const defaultItem = {key: "all", name: "All", workItemSelectors: []};

export function useQueryParamSync({uniqueItems, valueIndex, queryParamKey = ""}) {
  const location = useLocation();
  const history = useHistory();

  const {queryParams, state} = useQueryParamState();

  React.useEffect(() => {
    let queryString = "";
    if (valueIndex === 0) {
      queryParams.delete(queryParamKey);
    } else {
      queryParams.set(queryParamKey, uniqueItems[valueIndex].key);
    }
    queryString = queryParams.toString();

    history.push({search: `?${queryString}`, state: {...state, [queryParamKey]: uniqueItems[valueIndex]}});

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, valueIndex]);

  // clear url on unmount of this component
  React.useEffect(() => {
    return () => {
      history.push({search: ""});
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

function useUpdateStateOnRefresh({uniqueItems, updateFromQueryParam, queryParamKey}) {
  const {queryParams} = useQueryParamState();
  const queryParamVal = queryParams.get(queryParamKey);
  const urlSyncedItem = uniqueItems.find((item) => item.key === queryParamVal);
  React.useEffect(() => {
    if (urlSyncedItem) {
      updateFromQueryParam(urlSyncedItem);
    }
  }, []);
}

export function ValueStreamsDropdown() {
  const {data} = useWidget();

  const edges = data.project.valueStreams?.edges ?? [];
  const items = edges.map((edge) => edge.node);
  const uniqueItems = [defaultItem, ...items];
  const {handleChange, valueIndex, setSelectedVal} = useSelect({uniqueItems, defaultVal: defaultItem});

  useUpdateStateOnRefresh({uniqueItems, updateFromQueryParam: setSelectedVal, queryParamKey: "vs"});
  // sync dropdown value from url query-param
  useQueryParamSync({uniqueItems, valueIndex, queryParamKey: "vs"});

  // when there are no value streams under project, we don't show the dropdown for valuestream
  if (items.length === 0) {
    return null;
  }

  return (
    <div className="tw-ml-2">
      <SelectDropdown uniqueItems={uniqueItems} handleChange={handleChange} value={valueIndex} />
    </div>
  );
}

const defaultItemRelease = {key: "all", name: "All Releases", releaseValue: undefined};
export function ReleasesDropdown() {
  const {data} = useWidget();

  const releases = data.project.releases ?? [];
  const items = releases.map((x) => ({key: x, name: x, releaseValue: x}));
  const uniqueItems = [defaultItemRelease, ...items];
  const {handleChange, valueIndex, setSelectedVal} = useSelect({uniqueItems, defaultVal: defaultItem});

  useUpdateStateOnRefresh({uniqueItems, updateFromQueryParam: setSelectedVal, queryParamKey: "release"});

  // sync dropdown value from url query-param
  useQueryParamSync({uniqueItems, valueIndex, queryParamKey: "release"});

  // when there are no value streams under project, we don't show the dropdown for valuestream
  if (items.length === 0) {
    return null;
  }

  return (
    <div className="tw-ml-2">
      <SelectDropdown uniqueItems={uniqueItems} handleChange={handleChange} value={valueIndex} />
    </div>
  );
}

function ProjectValueStreams() {
  const {project, context} = useProjectContext();
  const {enableReleases} = project.settingsWithDefaults;

  const instanceKey = context.getInstanceKey("project");

  const valueStreamsResult = useQueryProjectValueStreams({instanceKey});
  const releasesResult = useQueryReleases({projectKey: instanceKey, releasesWindow: 90});

  return (
    <div className="tw-flex tw-items-center">
      <WidgetCore result={valueStreamsResult} errorContext="ValueStreamsWidget.useQueryValueStreams">
        <ValueStreamsDropdown />
      </WidgetCore>
      {enableReleases && (
        <WidgetCore result={releasesResult} errorContext="ValueStreamsWidget.useQueryReleases">
          <ReleasesDropdown />
        </WidgetCore>
      )}
    </div>
  );
}

export function ProjectValueStreamsWidget() {
  return <ProjectDashboard pollInterval={1000 * 60}>
    <ProjectValueStreams />
  </ProjectDashboard>
}

export function ValueStreamForm({formType, initialValues, onSubmit, uniqWorkItemSelectors, visible, onClose}) {
  let title = "";
  if (formType === "NEW_FORM") {
    title = "New Value Stream";
  }
  if (formType === "EDIT_FORM") {
    title = "Edit Value Stream";
  }

  return (
    <Drawer title={title} width={720} onClose={onClose} visible={visible}>
      <Form layout="vertical" onFinish={(values) => onSubmit({...values, onClose})} initialValues={initialValues}>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name={"name"}
              label="Value Stream"
              rules={[{required: true, message: "Value Stream is required"}]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name={"description"}
              label="Description"
              rules={[{required: true, message: "Description is required"}]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name="workItemSelectors"
              label="Tags"
              rules={[{required: true, message: "Please select tags", type: "array"}]}
            >
              <Select mode="multiple" placeholder="Please select tags">
                {uniqWorkItemSelectors.map((x) => (
                  <Option key={x} value={x}>
                    {x}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <div
          className="tw-absolute tw-left-0 tw-bottom-0 tw-w-full tw-bg-white tw-py-4 tw-px-4 tw-text-right"
          style={{borderTop: "1px solid #e9e9e9"}}
        >
          <Button onClick={onClose} style={{marginRight: 8}}>
            Cancel
          </Button>

          <Button htmlType="submit" type="primary">
            Save
          </Button>
        </div>
      </Form>
    </Drawer>
  );
}
