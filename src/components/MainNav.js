import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import BottomNavigation from "@material-ui/core/BottomNavigation";
import BottomNavigationAction from "@material-ui/core/BottomNavigationAction";
import TvIcon from "@material-ui/icons/Tv";
import MovieIcon from "@material-ui/icons/Movie";
import SearchIcon from "@material-ui/icons/Search";
import WhatshotIcon from "@material-ui/icons/Whatshot";
import { useLocation, useHistory } from "react-router-dom";
import "./MainNav.css";

const useStyles = makeStyles({
  root: {
    width: "100%",
    position: "fixed",
    bottom: 0,
    backgroundColor: "#1a1a1a",
    zIndex: 100,
    borderTop: "1px solid rgba(255,255,255,0.1)",
    boxShadow: "0 -2px 10px rgba(0,0,0,0.3)",
  },
});

export default function SimpleBottomNavigation() {
  const classes = useStyles();
  const history = useHistory();
  const location = useLocation();

  // Determine active route based on pathname
  const getActiveValue = () => {
    const path = location.pathname;
    if (path === "/") return 0;
    if (path === "/movies") return 1;
    if (path === "/series") return 2;
    if (path === "/search") return 3;
    return 0;
  };

  const [value, setValue] = React.useState(getActiveValue());

  useEffect(() => {
    const getActiveValue = () => {
      const path = location.pathname;
      if (path === "/") return 0;
      if (path === "/movies") return 1;
      if (path === "/series") return 2;
      if (path === "/search") return 3;
      return 0;
    };
    setValue(getActiveValue());
  }, [location]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    if (newValue === 0) {
      history.push("/");
    } else if (newValue === 1) {
      history.push("/movies");
    } else if (newValue === 2) {
      history.push("/series");
    } else if (newValue === 3) {
      history.push("/search");
    }
  };

  return (
    <BottomNavigation
      value={value}
      onChange={handleChange}
      showLabels
      className={classes.root}
    >
      <BottomNavigationAction
        label="Trending"
        icon={<WhatshotIcon />}
        className="nav-action"
        classes={{
          selected: "nav-selected",
          label: "nav-label",
          root: "nav-root",
        }}
      />
      <BottomNavigationAction
        label="Movies"
        icon={<MovieIcon />}
        className="nav-action"
        classes={{
          selected: "nav-selected",
          label: "nav-label",
          root: "nav-root",
        }}
      />
      <BottomNavigationAction
        label="TV Series"
        icon={<TvIcon />}
        className="nav-action"
        classes={{
          selected: "nav-selected",
          label: "nav-label",
          root: "nav-root",
        }}
      />
      <BottomNavigationAction
        label="Search"
        icon={<SearchIcon />}
        className="nav-action"
        classes={{
          selected: "nav-selected",
          label: "nav-label",
          root: "nav-root",
        }}
      />
    </BottomNavigation>
  );
}
