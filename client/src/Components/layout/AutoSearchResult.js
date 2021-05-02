import React from "react";
import Base from "../../core/Base";
import { List, ListItem, ListItemIcon, ListItemText } from "@material-ui/core";
import { Search } from "@material-ui/icons";

const AutoSearchResult = ({ results, onSearchSelect }) => {
  let renderResult = [];
  if (results) {
    renderResult = results.map((result, index) => {
      return (
        <Base>
          <ListItem
            key={index}
            onClick={() => onSearchSelect(result[0])}
            button
          >
            <ListItemIcon style={{ paddingLeft: "16px" }}>
              <Search />
            </ListItemIcon>
            <ListItemText primary={result[0]} />
          </ListItem>
        </Base>
      );
    });
  }
  return <List>{renderResult}</List>;
};

export default AutoSearchResult;