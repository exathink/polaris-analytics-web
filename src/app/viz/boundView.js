import * as React from 'react';
import {Model} from "./model";
import {cloneChildrenWithProps} from "../helpers/reactHelpers";
import ReactPlaceholder from 'react-placeholder';
import 'react-placeholder/lib/reactPlaceholder.css';

import {ActiveContext} from "../navigation/context";
import {ModelBindings} from "./modelBindings";

import {ModelCache} from "./modelCache";


type Props<T> = {
  modelClass: Class<Model<T>>,
  modelCache: ModelCache,
  modelBindings: ModelBindings,
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

  static getDerivedStateFromProps(nextProps: Props<T>, prevState: ModelState<T>) {

    if (prevState.status !== 'initialized') {
      if (!BoundView.dataReady(nextProps)) {
        if (prevState.status === 'initial') {
          BoundView.fetchData(nextProps);
          const nextState = {model: null, status: 'fetching'};
          nextProps.modelCache.putModel(nextProps.modelClass, nextState);
          return nextState;
        }
      } else {
        const nextState = {
          model: BoundView.getModel(nextProps),
          status: 'initialized'
        };
        nextProps.modelCache.putModel(nextProps.modelClass, nextState);
        return nextState
      }
    }
    //todo: handle case when data can change during the component lifecycle after model has been first initialized.
    return null;
  }


  static fetchData(props) {
    const modelBinding = props.modelBindings.getModelFactory(props.modelClass);
    if(modelBinding) {
      const dataBinding = modelBinding.getDataBinding(props.context);
      dataBinding.forEach(({dataSource, params}) => {
        if (!props.viz_data.getData(dataSource, params)) {
          props.fetchData({dataSource: dataSource, params: params});
        }
      })
    } else {
      throw Error("Could not find model binding...");
    }
  }
  static getModel(props) {
    const modelBinding = props.modelBindings.getModelFactory(props.modelClass);
    const dataBinding = modelBinding.getDataBinding(props.context);
    const source_data = dataBinding.map(({dataSource, params}) => ({
      dataSource,
      params,
      data: props.viz_data.getData(dataSource, params)
    }));
    return modelBinding.initModel(source_data, props);
  }

  static dataReady(props) {
    const modelBinding = props.modelBindings.getModelFactory(props.modelClass);
    const dataBinding = modelBinding.getDataBinding(props.context);
    return dataBinding.every(({dataSource, params}) => {
      return props.viz_data.getData(dataSource, params) != null;
    })
  }


  render() {
    return (
      <ReactPlaceholder
        showLoadingAnimation
        type="text"
        rows={7}
        ready={this.state.model != null}
      >
        {cloneChildrenWithProps(this.props.children, {model: this.state.model, ...this.props})}

      </ReactPlaceholder>
    )
  }
}