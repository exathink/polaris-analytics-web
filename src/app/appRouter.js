import React from 'react';
import AppContext from './context';
import {getContextRouterFor} from "./framework/navigation/context/contextRouter";

export const AppRouter = getContextRouterFor(AppContext)
