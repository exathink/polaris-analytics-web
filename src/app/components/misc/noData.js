import React from 'react';
import {Loading} from "../graphql/loading";

export const NoData = ({message, loading}) => (
  <div className={'no-data'}>
    {
      loading ? <Loading/> : <span>{message}</span>
    }
  </div>
)