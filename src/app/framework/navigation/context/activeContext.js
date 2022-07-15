import type {Context, MatchType, RouteType} from "./context";
import {encodeInstance, getInstanceKey} from "./helpers";

export class ActiveContext {
  context: Context;
  selectedRoute: RouteType;
  matchInfo: MatchType;
  targetUrl: string;
  search: string;
  rootUrl: string;
  rootContext: Context;
  navigator: {};


  constructor(context: Context, index: number, match: MatchType, location: { pathname: string, search: string }) {
    this.context = context;
    this.selectedRoute = context.routes[index];
    this.matchInfo = match;
    this.targetUrl = location.pathname;
    this.search = location.search;
    this.rootUrl = null;
    this.rootContext = null;
    this.navigator = null;
    this.viewCache = {};
  }

  name() {
    return this.context.name;
  }

  display() {
    return this.context.display ? this.context.display(this.matchInfo) : '';
  }

  color() {
    return this.context.color;
  }

  icon() {
    return this.context.icon;
  }

  routes() {
    return this.context.routes;
  }

  match() {
    return `${this.selectedRoute.match}`
  }

  matchUrl() {
    return `${this.matchInfo.url}/${this.match()}`
  }

  params() {
    return this.matchInfo.params;
  }


  urlFor(route: RouteType) {
    return `${this.matchInfo.url}/${route.match}`;
  }

  //#region subnav related functions

  subNavRoutesParents(){
    const topicRoutes = this.routes().filter(route => route.topic);
    return topicRoutes.filter(route => {
      return route.topic.routes.some(x => x.subnav)
    })
  }

  selectedSubNavParent(){
    const subNavRoutesParents = this.subNavRoutesParents();
    return subNavRoutesParents.find(route => route.match === this.match());
  }

  subNavRoutes(){
    const _selectedParent = this.selectedSubNavParent();
    const subNavRoutes = (_selectedParent?.topic?.routes ?? []).filter((route) => route.subnav);
    return subNavRoutes;
  }

  selectedSubNavKeys(){
    const subNavRoutes = this.subNavRoutes();
    const _selectedParent = this.selectedSubNavParent();
    const a = this.targetUrl.split("/");
    const subnavSelectedKeys = _selectedParent && subNavRoutes.length > 0 ? [`${this.urlFor(_selectedParent)}/${a[a.length - 1]}`] : [];
    return subnavSelectedKeys;
  }

 //#endregion

  equals(other: ActiveContext) {
    return other && this.targetUrl === other.targetUrl && this.context === other.context
  }

  searchParams() {
    if (this.search) {
      const query = this.search.substr(1);
      const result = {};
      query.split("&").forEach(function (part) {
        const item = part.split("=");
        result[item[0]] = decodeURIComponent(item[1]);
      });
      return result;
    }
  }

  getInstanceKey(contextName) {
    return getInstanceKey(contextName, this.params());
  }

  navigate(context, instanceName, instanceKey, topic) {
    if(this.navigator) {
      const targetPath = `${context.url_for}/${encodeInstance(instanceName, instanceKey)}/${topic}`;
      this.navigator.push(targetPath);
    }
  }

  go(scope, route) {
    if(scope === '.') {
      this.navigator.push(`${this.matchUrl()}/${route}`)
    } else if (scope ==='..'){
      this.navigator.push(`${this.matchInfo.url}/${route}`)
    }
  }

  drillDown(context, instanceName, instanceKey) {
    const selectedTopic = this.selectedRoute.topic;
    this.navigate(context, instanceName, instanceKey, selectedTopic? selectedTopic.name : '');
  }

  cacheView(key, view) {
    this.viewCache[key] = view;
  }

  getCachedView(key) {
    return this.viewCache[key];
  }


}