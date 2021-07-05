import React, { useContext, useState, useEffect, useCallback } from "react";
import { withRouter } from "react-router-dom";

import {
  InputBase,
  IconButton,
  Popper,
  CircularProgress,
  Grid,
} from "@material-ui/core";
import { ArrowBack } from "@material-ui/icons";

import { GlobalContext } from "../GlobalState";
import suggestSearch from "../../apis/suggestSearch";
import AutoSearchResult from "./AutoSearchResult";
import youtubeSearch from "../../apis/youtubeSearch";

import jsonp from "jsonp";

const SearchBox = ({ history, location }) => {
  // const params = new URLSearchParams(location.search);

  const [{ searchState }, dispatch] = useContext(GlobalContext);

  const setSearchState = useCallback(
    (data) => {
      dispatch({ type: "setSearchState", snippet: data });
    },
    [dispatch]
  );

  const setSearchResult = useCallback(
    (data) => {
      dispatch({ type: "setSearchResult", snippet: data });
    },
    [dispatch]
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [autoSearchData, setAutoSearch] = useState("");
  const [ytSearchQuery, setYtSearchQuery] = useState(null);
  const [isPopperOpen, setPopper] = useState(true);

  // get back the selected search data
  const onSearchSelect = (result) => {
    setSearchQuery(result);
    setYtSearchQuery(result);
    setSearchState("searching");
    history.push({ pathname: "/search", search: `?q=${result}` });
  };

  // when user hits enter then also fetch the data from yt api
  const onSearchSubmit = (e) => {
    e.preventDefault();
    setSearchState("searching");
    setYtSearchQuery(searchQuery);
    history.push({ pathname: "/search", search: `?q=${searchQuery}` });
  };

  const debounce = (func, delay = 150) => {
    let timeId;
    return function () {
      let context = this,
        args = arguments;
      clearTimeout(timeId);
      timeId = setTimeout(() => {
        func.apply(context, args);
      }, delay);
    };
  };

  const getQueryString = (queryParams) => {
    let queryStr = "";
    for (let param in queryParams)
      queryStr += `${param}=${queryParams[param]}&`;

    // remove the last &
    return queryStr.slice(0, -1);
  };

  // for controlled input change
  const onChange = (event) => {
    setSearchQuery(event.target.value);
    debounce((e) => {
      getAutocomplete();
    })(event);
  };

  // get autocomplete data form api
  const getAutocomplete = () => {
    suggestSearch.params.q = searchQuery;
    jsonp(
      suggestSearch.baseURL + getQueryString(suggestSearch.params),
      null,
      (err, response) => {
        setAutoSearch(response[1]);
      }
    );
  };

  // get youtube search result from api
  useEffect(() => {
    const searchYt = async (data) => {
      const res = await youtubeSearch.get("/search", {
        params: {
          q: data,
          maxResults: 15,
        },
      });
      console.log("################ PLAYLIST", res.data.items);
      setSearchResult(res.data.items);
      setSearchState("completed");
    };
    // only search if there is any value
    if (ytSearchQuery && ytSearchQuery !== "") {
      searchYt(ytSearchQuery);
    }
  }, [ytSearchQuery, setSearchResult, setSearchState]);

  useEffect(() => {
    // Listen for changes to the current location.
    const params = new URLSearchParams(location.search);
    const query = params.get("q");
    if (query) {
      setYtSearchQuery(query);
      setSearchQuery(query);
      setSearchState("searching");
    }
  }, [setSearchState, setYtSearchQuery, location.search]);

  // show loading icon while we fetch the results from api

  const popperResult = () => {
    switch (searchState) {
      case "searching":
        return (
          <Grid
            style={{ height: "100vh" }}
            container
            justify="center"
            alignItems="center"
          >
            <CircularProgress />
          </Grid>
        );
      case "clicked":
        return (
          <AutoSearchResult
            results={autoSearchData}
            onSearchSelect={onSearchSelect}
          />
        );
      case "completed":
        setPopper(false);
        break;
      default:
        break;
    }
    // console.log('Function ran');
  };

  return (
    <>
      <IconButton
        onClick={() => {
          setSearchState("home");
          if (history.location.pathname === "/search") {
            history.goBack();
          }
          // only go back if u have searched something
        }}
        color="inherit"
        aria-label="Menu"
      >
        <ArrowBack />
      </IconButton>
      <form style={{ width: "100%" }} onSubmit={(e) => onSearchSubmit(e)}>
        <InputBase
          fullWidth
          placeholder="Search..."
          autoFocus
          style={{ color: "#fff", paddingLeft: "16px" }}
          value={searchQuery}
          onChange={onChange}
          // on click we will show popper
          onClick={() => {
            setSearchState("clicked");
            setPopper(true);
          }}
        />
      </form>

      <Popper
        className="searchPopper"
        open={isPopperOpen}
        anchorEl={document.getElementById("navbar")}
        popperOptions={{
          modifiers: {
            preventOverflow: {
              padding: 0,
            },
          },
        }}
        placement="bottom"
      >
        {popperResult}
      </Popper>
    </>
  );
};

export default withRouter(SearchBox);
