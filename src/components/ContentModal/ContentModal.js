import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import axios from "axios";
import {
  img_500,
  unavailable,
  unavailableLandscape,
} from "../../config/config";
import "./ContentModal.css";
import { Button } from "@material-ui/core";
import YouTubeIcon from "@material-ui/icons/YouTube";
import StarIcon from "@material-ui/icons/Star";
import CalendarTodayIcon from "@material-ui/icons/CalendarToday";
import LanguageIcon from "@material-ui/icons/Language";
import Carousel from "../Carousel/Carousel";

const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "scroll",
  },
  paper: {
    width: "90%",
    height: "90%",
    backgroundColor: "#1a1a1a",
    border: "none",
    borderRadius: 12,
    color: "white",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.5)",
    padding: 0,
    outline: "none",
    overflowY: "auto",
  },
  buttonTrailer: {
    backgroundColor: "#E50914",
    "&:hover": {
      backgroundColor: "#B20710",
    },
  },
  buttonWebsite: {
    backgroundColor: "#2D2D2D",
    "&:hover": {
      backgroundColor: "#3D3D3D",
    },
  },
}));

export default function TransitionsModal({ children, media_type, id }) {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState();
  const [video, setVideo] = useState();
  const [loading, setLoading] = useState(true);

  const handleOpen = () => {
    setOpen(true);
    setLoading(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const fetchData = async () => {
    try {
      const { data } = await axios.get(
        `https://api.themoviedb.org/3/${media_type}/${id}?api_key=${process.env.REACT_APP_API_KEY}&language=en-US`
      );
      setContent(data);
    } catch (error) {
      console.error("Error fetching content details:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchVideo = async () => {
    try {
      const { data } = await axios.get(
        `https://api.themoviedb.org/3/${media_type}/${id}/videos?api_key=${process.env.REACT_APP_API_KEY}&language=en-US`
      );
      setVideo(data.results[0]?.key);
    } catch (error) {
      console.error("Error fetching video:", error);
    }
  };

  useEffect(() => {
    if (open) {
      fetchData();
      fetchVideo();
    }
    // eslint-disable-next-line
  }, [open]);

  function formatDate(dateString) {
    if (!dateString) return "TBA";
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }

  function getRatingColor(rating) {
    if (rating >= 7) return "#4CAF50";
    if (rating >= 5) return "#FFC107";
    return "#F44336";
  }

  return (
    <>
      <div
        className="media"
        style={{ cursor: "pointer" }}
        color="inherit"
        onClick={handleOpen}
      >
        {children}
      </div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <div className={classes.paper}>
            {loading ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                }}
              >
                Loading...
              </div>
            ) : content ? (
              <div className="ContentModal">
                <img
                  src={
                    content.poster_path
                      ? `${img_500}/${content.poster_path}`
                      : unavailable
                  }
                  alt={content.name || content.title}
                  className="ContentModal__portrait"
                />
                <img
                  src={
                    content.backdrop_path
                      ? `${img_500}/${content.backdrop_path}`
                      : unavailableLandscape
                  }
                  alt={content.name || content.title}
                  className="ContentModal__landscape"
                />
                <div className="ContentModal__about">
                  <h1 className="ContentModal__title">
                    {content.name || content.title}
                    {(content.first_air_date || content.release_date) &&
                      ` (${(
                        content.first_air_date || content.release_date
                      ).substring(0, 4)})`}
                  </h1>

                  {content.tagline && (
                    <div className="tagline">{content.tagline}</div>
                  )}

                  <div className="ContentModal__rating">
                    <div
                      className="ContentModal__rating-badge"
                      style={{ color: getRatingColor(content.vote_average) }}
                    >
                      <StarIcon fontSize="small" />
                      {content.vote_average.toFixed(1)}/10
                    </div>
                  </div>

                  <div className="ContentModal__info">
                    <span className="ContentModal__info-item">
                      <CalendarTodayIcon
                        fontSize="small"
                        style={{ marginRight: 5 }}
                      />
                      {formatDate(
                        content.first_air_date || content.release_date
                      )}
                    </span>
                    {content.runtime && (
                      <span className="ContentModal__info-item">
                        {Math.floor(content.runtime / 60)}h{" "}
                        {content.runtime % 60}m
                      </span>
                    )}
                    {content.number_of_seasons && (
                      <span className="ContentModal__info-item">
                        {content.number_of_seasons}{" "}
                        {content.number_of_seasons === 1 ? "Season" : "Seasons"}
                      </span>
                    )}
                    {content.original_language && (
                      <span className="ContentModal__info-item">
                        <LanguageIcon
                          fontSize="small"
                          style={{ marginRight: 5 }}
                        />
                        {content.original_language.toUpperCase()}
                      </span>
                    )}
                  </div>

                  <div className="ContentModal__description">
                    {content.overview}
                  </div>

                  <h2 className="ContentModal__cast-heading">Cast</h2>
                  <div>
                    <Carousel id={id} media_type={media_type} />
                  </div>

                  <div className="ContentModal__buttons">
                    {video && (
                      <Button
                        variant="contained"
                        startIcon={<YouTubeIcon />}
                        className={classes.buttonTrailer}
                        target="__blank"
                        href={`https://www.youtube.com/watch?v=${video}`}
                      >
                        Watch Trailer
                      </Button>
                    )}
                    {content.homepage && (
                      <Button
                        variant="contained"
                        startIcon={<LanguageIcon />}
                        className={classes.buttonWebsite}
                        target="__blank"
                        href={content.homepage}
                      >
                        Official Website
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                }}
              >
                No content found
              </div>
            )}
          </div>
        </Fade>
      </Modal>
    </>
  );
}
