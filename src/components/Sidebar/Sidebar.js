import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import {
  Chip,
  Typography,
  Divider,
  IconButton,
  Button,
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import "./Sidebar.css";

const Sidebar = ({ selectedGenres, setSelectedGenres }) => {
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(window.innerWidth > 768);
  const location = useLocation();

  // Determine the current type (movie or tv) based on the URL
  const type = location.pathname.includes("series") ? "tv" : "movie";

  const fetchGenres = async () => {
    try {
      const { data } = await axios.get(
        `https://api.themoviedb.org/3/genre/${type}/list?api_key=${process.env.REACT_APP_API_KEY}&language=en-US`
      );
      setGenres(data.genres);
    } catch (error) {
      console.error("Error fetching genres:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGenres();
    // eslint-disable-next-line
  }, [type]);

  useEffect(() => {
    const handleResize = () => {
      setExpanded(window.innerWidth > 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleAdd = (genre) => {
    setSelectedGenres([...selectedGenres, genre]);
    setGenres(genres.filter((g) => g.id !== genre.id));
  };

  const handleRemove = (genre) => {
    setSelectedGenres(
      selectedGenres.filter((selected) => selected.id !== genre.id)
    );
    setGenres([...genres, genre].sort((a, b) => a.name.localeCompare(b.name)));
  };

  if (!expanded) {
    return (
      <div className="sidebar-collapsed">
        <IconButton
          onClick={() => setExpanded(true)}
          className="sidebar-toggle"
        >
          <MenuIcon fontSize="large" />
        </IconButton>
      </div>
    );
  }

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <Typography variant="h6" className="sidebar-title">
          Filters
        </Typography>
        <IconButton
          onClick={() => setExpanded(false)}
          className="sidebar-toggle"
          size="small"
        >
          <MenuIcon />
        </IconButton>
      </div>

      <Divider className="sidebar-divider" />

      <div className="sidebar-section">
        <Typography variant="subtitle1" className="section-title">
          Selected Genres
        </Typography>
        <div className="genres-container">
          {selectedGenres.length > 0 ? (
            selectedGenres.map((genre) => (
              <Chip
                key={genre.id}
                label={genre.name}
                color="primary"
                size="small"
                clickable
                onDelete={() => handleRemove(genre)}
                className="genre-chip selected-genre"
              />
            ))
          ) : (
            <Typography variant="body2" className="empty-message">
              No genres selected
            </Typography>
          )}
        </div>
      </div>

      <Divider className="sidebar-divider" />

      <div className="sidebar-section">
        <Typography variant="subtitle1" className="section-title">
          Available Genres
        </Typography>
        <div className="genres-container">
          {loading ? (
            <Typography variant="body2">Loading genres...</Typography>
          ) : genres.length > 0 ? (
            genres.map((genre) => (
              <Chip
                key={genre.id}
                label={genre.name}
                variant="outlined"
                size="small"
                clickable
                onClick={() => handleAdd(genre)}
                className="genre-chip"
              />
            ))
          ) : (
            <Typography variant="body2" className="empty-message">
              No genres available
            </Typography>
          )}
        </div>
      </div>

      {selectedGenres.length > 0 && (
        <Button
          variant="contained"
          color="secondary"
          size="small"
          onClick={() => {
            setGenres(
              [...genres, ...selectedGenres].sort((a, b) =>
                a.name.localeCompare(b.name)
              )
            );
            setSelectedGenres([]);
          }}
          className="clear-genres-btn"
        >
          Clear All Genres
        </Button>
      )}
    </div>
  );
};

export default Sidebar;
