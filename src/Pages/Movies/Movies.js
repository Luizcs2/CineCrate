import axios from "axios";
import { useEffect, useState } from "react";
import SingleContent from "../../components/SingleContent/SingleContent";
import useGenre from "../../hooks/useGenre";
import CustomPagination from "../../components/Pagination/CustomPagination";

const Movies = ({ selectedGenres, setSelectedGenres, quickSearchText }) => {
  const [page, setPage] = useState(1);
  const [content, setContent] = useState([]);
  const [filteredContent, setFilteredContent] = useState([]);
  const [numOfPages, setNumOfPages] = useState();
  const [loading, setLoading] = useState(true);
  const genreforURL = useGenre(selectedGenres);

  const fetchMovies = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.REACT_APP_API_KEY}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=${page}&with_genres=${genreforURL}`
      );
      setContent(data.results);
      setNumOfPages(data.total_pages > 500 ? 500 : data.total_pages);
    } catch (error) {
      console.error("Error fetching movies:", error);
    } finally {
      setLoading(false);
    }
  };

  // Apply quick search filter
  useEffect(() => {
    if (quickSearchText.trim() === "") {
      setFilteredContent(content);
    } else {
      const filtered = content.filter(movie => 
        movie.title.toLowerCase().includes(quickSearchText.toLowerCase())
      );
      setFilteredContent(filtered);
    }
  }, [content, quickSearchText]);

  useEffect(() => {
    window.scroll(0, 0);
    fetchMovies();
    // eslint-disable-next-line
  }, [genreforURL, page]);

  return (
    <div className="movies-container">
      <span className="pageTitle">Discover Movies</span>
      
      {loading ? (
        <div className="loading-container">Loading movies...</div>
      ) : (
        <>
          <div className="content-grid">
            {filteredContent && filteredContent.length > 0 ? (
              filteredContent.map((movie) => (
                <SingleContent
                  key={movie.id}
                  id={movie.id}
                  poster={movie.poster_path}
                  title={movie.title || movie.name}
                  date={movie.release_date}
                  media_type="movie"
                  vote_average={movie.vote_average}
                />
              ))
            ) : quickSearchText.trim() !== "" ? (
              <div className="no-results">No movies found matching "{quickSearchText}"</div>
            ) : (
              <div className="no-results">No movies found for selected genres</div>
            )}
          </div>
          
          {numOfPages > 1 && (
            <div className="pagination-container">
              <CustomPagination setPage={setPage} numOfPages={numOfPages} />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Movies;