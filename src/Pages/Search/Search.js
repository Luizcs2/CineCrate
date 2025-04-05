import {
  Button,
  createMuiTheme,
  Tab,
  Tabs,
  TextField,
  ThemeProvider,
  Typography,
  CircularProgress,
} from "@material-ui/core";
import "./Search.css";
import SearchIcon from "@material-ui/icons/Search";
import { useEffect, useState } from "react";
import axios from "axios";
import CustomPagination from "../../components/Pagination/CustomPagination";
import SingleContent from "../../components/SingleContent/SingleContent";

const Search = () => {
  const [type, setType] = useState(0);
  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState(1);
  const [content, setContent] = useState([]);
  const [numOfPages, setNumOfPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const darkTheme = createMuiTheme({
    palette: {
      type: "dark",
      primary: {
        main: "#E50914",
      },
      secondary: {
        main: "#ffffff",
      },
      background: {
        default: "#121212",
        paper: "#1a1a1a",
      },
    },
    typography: {
      fontFamily: '"Montserrat", "Roboto", "Arial", sans-serif',
    },
    overrides: {
      MuiOutlinedInput: {
        root: {
          borderRadius: 8,
          backgroundColor: "rgba(255, 255, 255, 0.05)",
        },
      },
      MuiFilledInput: {
        root: {
          borderRadius: 8,
          backgroundColor: "rgba(255, 255, 255, 0.05)",
          "&:hover": {
            backgroundColor: "rgba(255, 255, 255, 0.08)",
          },
          "&.Mui-focused": {
            backgroundColor: "rgba(255, 255, 255, 0.08)",
          },
        },
        underline: {
          "&:before": {
            border: "none",
          },
          "&:after": {
            borderBottom: "2px solid #E50914",
          },
        },
      },
      MuiButton: {
        root: {
          borderRadius: 8,
          textTransform: "none",
          fontWeight: 600,
        },
        contained: {
          boxShadow: "none",
          "&:hover": {
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.3)",
          },
        },
      },
    },
  });

  const fetchSearch = async () => {
    if (searchText.trim() === "") return;

    try {
      setLoading(true);
      setSearched(true);

      const { data } = await axios.get(
        `https://api.themoviedb.org/3/search/${type ? "tv" : "movie"}?api_key=${
          process.env.REACT_APP_API_KEY
        }&language=en-US&query=${searchText}&page=${page}&include_adult=false`
      );

      setContent(data.results);
      setNumOfPages(data.total_pages > 500 ? 500 : data.total_pages);
    } catch (error) {
      console.error("Error searching:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchSearch();
  };

  useEffect(() => {
    if (searched) {
      window.scroll(0, 0);
      fetchSearch();
    }
    // eslint-disable-next-line
  }, [type, page]);

  return (
    <div className="search-container">
      <ThemeProvider theme={darkTheme}>
        <Typography
          variant="h4"
          component="h1"
          align="center"
          style={{ marginBottom: "1rem" }}
        >
          Find Your Favorite {type ? "TV Shows" : "Movies"}
        </Typography>

        <form onSubmit={handleSearchSubmit} className="search">
          <TextField
            fullWidth
            label="Search"
            variant="filled"
            color="secondary"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            InputProps={{
              autoComplete: "off",
            }}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            className="search-button"
            disabled={loading || searchText.trim() === ""}
          >
            {loading ? (
              <CircularProgress size={24} color="secondary" />
            ) : (
              <SearchIcon />
            )}
          </Button>
        </form>

        <div className="search-tabs">
          <Tabs
            value={type}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
            onChange={(event, newValue) => {
              setType(newValue);
              setPage(1);
              if (searched) fetchSearch();
            }}
            classes={{
              indicator: "search-tabs-indicator",
            }}
          >
            <Tab
              label="Movies"
              className="search-tab"
              classes={{ selected: "search-tab-selected" }}
            />
            <Tab
              label="TV Shows"
              className="search-tab"
              classes={{ selected: "search-tab-selected" }}
            />
          </Tabs>
        </div>

        <div className="search-results">
          {loading ? (
            <div className="search-results-message">
              <CircularProgress color="secondary" />
            </div>
          ) : content.length > 0 ? (
            content.map((item) => (
              <SingleContent
                key={item.id}
                id={item.id}
                poster={item.poster_path}
                title={item.title || item.name}
                date={item.first_air_date || item.release_date}
                media_type={type ? "tv" : "movie"}
                vote_average={item.vote_average}
              />
            ))
          ) : searched ? (
            <div className="search-results-message">
              No {type ? "TV shows" : "movies"} found matching your search
            </div>
          ) : (
            <div className="search-results-message">
              Search for {type ? "TV shows" : "movies"} to see results
            </div>
          )}
        </div>

        {numOfPages > 1 && !loading && (
          <div className="pagination-container">
            <CustomPagination setPage={setPage} numOfPages={numOfPages} />
          </div>
        )}
      </ThemeProvider>
    </div>
  );
};

export default Search;
