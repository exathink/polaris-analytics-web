import * as React from 'react';
import {Model} from "./model";
import {cloneChildrenWithProps} from "../../../helpers/reactHelpers";
import ReactPlaceholder from 'react-placeholder';
import 'react-placeholder/lib/reactPlaceholder.css';

import {ActiveContext} from "../../navigation/context/activeContext";
import {ModelBindings} from "./modelBindings";
import {DatasourceBinding} from "./modelFactory";

import {ModelCache} from "./modelCache";
import {fail} from '../../../helpers/utility';

type Props<T> = {
  modelClass: Class<Model<T>>,
  modelCache: ModelCache,
  dataBinding: DatasourceBinding,
  modelBindings?: ModelBindings,
  children: React.Node,
  context? : ActiveContext,

  modelState?: ModelState<T>,
  navigation: any,
  viz_data: any

}

export class BoundView<T> extends React.Component<Props<T>, ModelState<T>> {

  state: ModelState<T>;

  constructor(props: Props<T>) {
    super(props);
    this.state = props.modelCache.getModel(props.modelClass)
  }

  static getDataBinding(props) {
    if(props.dataBinding) {
      return [props.dataBinding(props)];
    } else if (props.modelBindings) {
        const modelBinding = props.modelBindings.getModelFactory(props.modelClass);
        return modelBinding.getDataBinding(props);
    } else fail('No databindings were provided');
  }

  static initModel(source_data, props) {
    const modelBinding = props.modelBindings && props.modelBindings.getModelFactory(props.modelClass);
    const model = modelBinding && modelBinding.initModel ?
      modelBinding.initModel(source_data, props)
      //default init model assumes only a single data source so we can extract the data output for the first
      // result and send this along
      : source_data.length === 1 && props.modelClass.defaultInitModel ?
        props.modelClass.defaultInitModel(source_data[0].data, props)
        : null;
    return model || fail('Could not init model');
  }


  static getDerivedStateFromProps(nextProps: Props<T>, prevState: ModelState<T>) {
    const dataBinding = BoundView.getDataBinding(nextProps);
    if (prevState.status !== 'initialized') {
      if (!BoundView.dataReady(nextProps)) {
        if (prevState.status === 'initial') {
          BoundView.fetchData(nextProps);
          const nextState = {model: null, status: 'fetching'};
          nextProps.modelCache.putModel(nextProps.modelClass, dataBinding, nextState);
          return nextState;
        }
      } else {
        const nextState = {
          model: BoundView.getModel(nextProps),
          status: 'initialized'
        };
        nextProps.modelCache.putModel(nextProps.modelClass, dataBinding, nextState);
        return nextState
      }
    }

    //todo: handle case when data can change during the component lifecycle after model has been first initialized.
    return null;
  }


  static fetchData(props) {
    const dataBinding = BoundView.getDataBinding(props);
    dataBinding.forEach(({dataSource, params}) => {
      if (!props.viz_data.getData(dataSource, params)) {
        props.fetchData({dataSource: dataSource, params: params});
      }
    })
  }
  static getModel(props) {
    const dataBinding = BoundView.getDataBinding(props);
    const source_data = dataBinding.map(({dataSource, params}) => ({
      dataSource,
      params,
      data: props.viz_data.getData(dataSource, params)
    }));
    return BoundView.initModel(source_data, props)
  }

  static dataReady(props) {
    const dataBinding = BoundView.getDataBinding(props);
    return dataBinding.every(({dataSource, params}) => {
      return props.viz_data.getData(dataSource, params) != null;
    })
  }


  render() {
    return (
        <ReactPlaceholder
          showLoadingAnimation
          type="media"
          rows={1}
          ready={this.state.model != null}
        >
          {cloneChildrenWithProps(this.props.children, {model: this.state.model, ...this.props})}

        </ReactPlaceholder>
    )
  }
}