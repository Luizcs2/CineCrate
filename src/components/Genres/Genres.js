import { Chip } from "@material-ui/core";
import axios from "axios";
import { useEffect, useState } from "react";
import "./Genres.css";
import ClearIcon from "@material-ui/icons/Clear";
import AddIcon from "@material-ui/icons/Add";

const Genres = ({
  selectedGenres,
  setSelectedGenres,
  genres,
  setGenres,
  type,
  setPage,
}) => {
  const [loading, setLoading] = useState(true);

  const handleAdd = (genre) => {
    setSelectedGenres([...selectedGenres, genre]);
    setGenres(genres.filter((g) => g.id !== genre.id));
    setPage(1);
  };

  const handleRemove = (genre) => {
    setSelectedGenres(
      selectedGenres.filter((selected) => selected.id !== genre.id)
    );
    setGenres([...genres, genre].sort((a, b) => a.name.localeCompare(b.name)));
    setPage(1);
  };

  const fetchGenres = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `https://api.themoviedb.org/3/genre/${type}/list?api_key=${process.env.REACT_APP_API_KEY}&language=en-US`
      );
      // Sort genres alphabetically
      setGenres(data.genres.sort((a, b) => a.name.localeCompare(b.name)));
    } catch (error) {
      console.error("Error fetching genres:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGenres();

    return () => {
      setGenres([]); // unmounting
    };
    // eslint-disable-next-line
  }, [type]);

  return (
    <div className="genres">
      <h2 className="genres-title">Filter by Genre</h2>
      
      {loading ? (
        <div style={{ width: '100%', textAlign: 'center' }}>Loading genres...</div>
      ) : (
        <>
          {selectedGenres.map((genre) => (
            <Chip
              key={genre.id}
              label={genre.name}
              clickable
              size="medium"
              onDelete={() => handleRemove(genre)}
              deleteIcon={<ClearIcon />}
              className="genre-chip genre-chip-selected"
            />
          ))}
          {genres.map((genre) => (
            <Chip
              key={genre.id}
              label={genre.name}
              clickable
              size="medium"
              onClick={() => handleAdd(genre)}
              icon={<AddIcon style={{ fontSize: '16px' }} />}
              className="genre-chip genre-chip-unselected"
            />
          ))}
        </>
      )}
    </div>
  );
};

export default Genres;