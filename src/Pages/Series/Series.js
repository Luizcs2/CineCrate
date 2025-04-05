import axios from "axios";
import { useEffect, useState } from "react";
import CustomPagination from "../../components/Pagination/CustomPagination";
import SingleContent from "../../components/SingleContent/SingleContent";
import useGenre from "../../hooks/useGenre";

const Series = ({ selectedGenres, setSelectedGenres, quickSearchText }) => {
  const [page, setPage] = useState(1);
  const [content, setContent] = useState([]);
  const [filteredContent, setFilteredContent] = useState([]);
  const [numOfPages, setNumOfPages] = useState();
  const [loading, setLoading] = useState(true);
  const genreforURL = useGenre(selectedGenres);

  const fetchSeries = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `https://api.themoviedb.org/3/discover/tv?api_key=${process.env.REACT_APP_API_KEY}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=${page}&with_genres=${genreforURL}`
      );
      setContent(data.results);
      setNumOfPages(data.total_pages > 500 ? 500 : data.total_pages);
    } catch (error) {
      console.error("Error fetching series:", error);
    } finally {
      setLoading(false);
    }
  };

  // Apply quick search filter
  useEffect(() => {
    if (quickSearchText.trim() === "") {
      setFilteredContent(content);
    } else {
      const filtered = content.filter(series => 
        (series.name || "").toLowerCase().includes(quickSearchText.toLowerCase())
      );
      setFilteredContent(filtered);
    }
  }, [content, quickSearchText]);

  useEffect(() => {
    window.scroll(0, 0);
    fetchSeries();
    // eslint-disable-next-line
  }, [genreforURL, page]);

  return (
    <div className="series-container">
      <span className="pageTitle">Discover Series</span>
      
      {loading ? (
        <div className="loading-container">Loading series...</div>
      ) : (
        <>
          <div className="content-grid">
            {filteredContent && filteredContent.length > 0 ? (
              filteredContent.map((series) => (
                <SingleContent
                  key={series.id}
                  id={series.id}
                  poster={series.poster_path}
                  title={series.name}
                  date={series.first_air_date}
                  media_type="tv"
                  vote_average={series.vote_average}
                />
              ))
            ) : quickSearchText.trim() !== "" ? (
              <div className="no-results">No series found matching "{quickSearchText}"</div>
            ) : (
              <div className="no-results">No series found for selected genres</div>
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

export default Series;