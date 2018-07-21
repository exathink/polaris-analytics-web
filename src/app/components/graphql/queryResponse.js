import React from 'react';
import {Loading} from "./loading";


export const QueryResponse = ({loading, error, data, render}) => {
  if (loading) return <Loading/>;
  if (error) return null;
  return render(data);
};