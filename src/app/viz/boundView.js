import * as React from 'react';
import {Model} from "./model";
import {cloneChildrenWithProps} from "../helpers/reactHelpers";
import ReactPlaceholder from 'react-placeholder';
import 'react-placeholder/lib/reactPlaceholder.css';

import {ActiveContext} from "../navigation/context";
import {ModelBindings} from "./modelBindings";

type Props<T> = {
  modelClass: Class<Model<T>>,
  modelBindings: ModelBindings,
  children: React.Node,
  context? : ActiveContext,

  fetchModel: (modelClass: Class<Model<T>>) => void,
  modelState?: ModelState<T>,
  navigation: any,
  viz_data: any

}



type ModelState<T> = {
  model: Model<T> | null,
  status: 'initial' | 'fetching' | 'initialized'
}

export class BoundView<T> extends React.Component<Props<T>, ModelState<T>> {

  state: ModelState<T>;

  constructor(props: Props<T>) {
    super(props);
    this.state = {
      model: null,
      status: 'initial'
    }
  }

  static getDerivedStateFromProps(nextProps: Props<T>, prevState: ModelState<T>) {


    if (!BoundView.dataReady(nextProps)) {
      if (prevState.status === 'initial') {
        BoundView.fetchData(nextProps);
        return {
          model: null,
          status: 'fetching'
        }
      } else {
        return null;
      }
    } else {
      return {
        model: BoundView.getModel(nextProps),
        status: 'initialized'
      }
    }
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