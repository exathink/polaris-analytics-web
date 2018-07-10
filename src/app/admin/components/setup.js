import React from 'react';
import {AddOrganization} from "./addOrganization";
import {BrowsePublicProjects} from "../../oss/projects/browsePublicProjects";

export class Setup extends React.Component {
  render() {
    return (
      <BrowsePublicProjects/>
    );
  }
}