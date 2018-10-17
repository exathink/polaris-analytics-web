import React from "react";

export const findByProps = (children, propName, value) => {
  return React.Children.map(children, dashRow => {
    return dashRow && React.Children.map(dashRow.props.children, dashItem => {
      return (dashItem && dashItem.props[propName] === value ? dashItem : null)
    })
  });



};
export const cloneChildrenWithProps = (children, props, filter=child=>child) => {
  return React.Children.map(children, child => (
      filter(child) ? React.cloneElement(child, props) : () => null
    )
  )
};