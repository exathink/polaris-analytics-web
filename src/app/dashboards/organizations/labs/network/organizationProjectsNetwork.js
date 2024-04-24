/*
 * Copyright (c) Exathink, LLC  2016-2024.
 * All rights reserved
 *
 */

import {gql, useQuery} from "@apollo/client";

import {analytics_service} from "../../../../services/graphql";
import React, {useEffect, useImperativeHandle} from "react";

import {graphqlConnectionToCyElements} from "../../../../framework/viz/networks/graphql-cytoscape";
import Cytoscape from "../../../../framework/viz/networks/cytoscape-react";
import {getActivityLevelFromDate} from "../../../shared/helpers/activityLevel";
import {Images} from "../../../../framework/viz/networks/backgroundImages";
import {tooltipHtml_v2} from "../../../../framework/viz/charts/tooltip";
import {Menu, Button} from "antd";


export const GET_ORGANIZATION_PROJECTS_NETWORK_QUERY = gql`
    query organizationProjectsNetwork(
        $organizationKey: String!
    ) {
        organization(key: $organizationKey) {
            id
            name
            key
            projects(
                interfaces: [CommitSummary, RepositoryCount, WorkItemEventSpan, ContributorCount]
                contributorCountDays: 30
            ) {
                count
                edges {
                    node {
                        id
                        name
                        key
                        archived
                        contributorCount
                        repositoryCount
                        latestCommit
                        latestWorkItemEvent
                        workItemsSources {
                            count
                            edges {
                                node {
                                    name
                                }
                            }
                        }
                    }
                }
            }
        }
    }
`;

export function useQueryOrganizationProjects({
                                               organizationKey
                                             }) {
  return useQuery(GET_ORGANIZATION_PROJECTS_NETWORK_QUERY, {
    service: analytics_service,
    variables: {
      organizationKey: organizationKey
    },
    errorPolicy: "all",
    fetchPolicy: "cache-and-network"
  });
}


function initLayout() {
  return ({
    name: "concentric",
    concentric: function(node) {
      return -10 * (node.data("connectionDepth"));
    },
    fit: true,
    nodeDimensionsIncludeLabels: true,
    equidistant: true,
    minNodeSpacing: 10
  });
}

function initStyleSheet() {
  return [{
    selector: "node",
    style: {
      "text-opacity": 1.0,
      "text-valign": "center",
      "text-halign": "center",
      "color": "rgb(77,77,77)",
      "font-family": "Roboto, sans-serif",
      "font-size": 10,

      "font-weight": "normal",
      "background-color": "rgb(39,169,230)",
      "background-opacity": 1.0,
      "border-color": "rgb(0,102,153)",
      "border-opacity": 1.0,

      "content": "data(name)"
    }
  }, {
    "selector": "node[nodeType = 'Organization']",
    "style": {
      "shape": "round-rectangle",
      "height": 60.0,
      "width": 120.0,
      "font-size": 18,
      "background-image": Images.SITEMAP,
      "background-width": "10px",
      "background-height": "10px",
      "background-position-x": "50%",
      "background-position-y": "10%"
    }
  }, {
    "selector": "node[nodeType = 'Project']",
    "style": {
      "shape": "ellipse",
      "height": 76,
      "width": 76,
      "font-size": 14,
      "background-color": "data(activityColor)",
      "background-image": Images.QUEUE,
      "background-opacity": 1,
      "background-fit": "cover",
      "text-valign": "bottom",
      "text-margin-y": "5"

    }
  }, {
    "selector": "node[state_type = 'wait']",
    "style": {
      "background-color": "rgb(158,188,218)"
    }
  }, {
    "selector": "node[state_type = 'active']",
    "style": {
      "background-color": "rgb(35,139,69)"
    }
  }, {
    "selector": "node[state_type = 'terminal']",
    "style": {
      "background-color": "rgb(201,148,199)"
    }
  }, {
    "selector": "node:selected",
    "style": {
      "border-color": "rgba(117,117,128,0.4)",
      "border-width": 3

    }
  }, {
    "selector": "edge",
    "style": {
      "source-arrow-shape": "circle",
      "source-arrow-fill": "hollow",
      "target-arrow-shape": "triangle",
      "font-weight": "normal",
      "source-arrow-color": "rgba(50,70,159,0.11)",
      "target-arrow-color": "rgba(50,70,159,0.4)",


      "text-opacity": 1.0,
      "line-color": "rgba(117,117,128,0.4)",
      "line-style": "solid",
      "opacity": 1.0,
      "font-size": 10,
      "width": 1,
      "curve-style": "unbundled-bezier"
    }
  }];
}

function OrganizationProjectsNetwork({
                                       organizationKey,
                                       cytoscapeOptions,
                                       testId
                                     }, ref) {

  const cyRef = React.useRef();

  useImperativeHandle(ref, () => ({
    cy: () => cyRef.current?.cy()
  }));

  useEffect(() => {
    const cy = cyRef.current?.cy();
    if (cy != null) {
      cy.nodes().forEach(
        node => {
          node.data(
            "activityColor", getActivityLevelFromDate(node.data("latestCommit"), node.data("latestWorkItemEvent"))?.color
          );
        }
      );
    }
  });

  const {loading, error, data} = useQuery(GET_ORGANIZATION_PROJECTS_NETWORK_QUERY, {
    variables: {organizationKey}
  });

  if (loading) return "Loading...";
  if (error) return `Error! ${error}`;

  const elements = graphqlConnectionToCyElements(data, "organization", "projects");

  return (
    <Cytoscape
      ref={cyRef}
      elements={elements}
      layout={initLayout()}
      stylesheet={initStyleSheet()}
      tooltip={{
        enable: true,
        tooltip: (element) => {
          return (
            element.data("nodeType") === "Project" ?
              tooltipHtml_v2({
                  header: `Project: ${element.data("name")}`,
                  body: [
                    [`Lead Time`, `30`],
                    [`Cost: `, ` 90 FTE Days`]
                  ]
                }
              )
              :
              ``
          );
        }
      }}
      selectionDetailView={{
        enable: true,
        component: () => {
          return (
            <Menu
              data-testid={"organization-projects-context-menu"}
              mode="horizontal"
              theme="dark"
            >
              <Menu.Item key="1">A</Menu.Item>
              <Menu.Item key="2">B</Menu.Item>
              <Menu.Item key="3">C</Menu.Item>
            </Menu>
          );
        }
      }}
      {...cytoscapeOptions}
      testId={testId} />
  );
};

export default React.forwardRef(OrganizationProjectsNetwork);