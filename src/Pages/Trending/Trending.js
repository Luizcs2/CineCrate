import axios from "axios";
import "./Trending.css";
import { useEffect, useState } from "react";
import SingleContent from "../../components/SingleContent/SingleContent";
import CustomPagination from "../../components/Pagination/CustomPagination";

const Trending = () => {
  const [page, setPage] = useState(1);
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTrending = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `https://api.themoviedb.org/3/trending/all/day?api_key=${process.env.REACT_APP_API_KEY}&page=${page}`
      );
      setContent(data.results);
    } catch (error) {
      console.error("Error fetching trending content:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    window.scroll(0, 0);
    fetchTrending();
    // eslint-disable-next-line
  }, [page]);

  return (
    <div className="trending-container">
      <h1 className="pageTitle">Trending Today</h1>

      {loading ? (
        <div className="loading">Loading trending content...</div>
      ) : (
        <div className="trending">
          {content && content.length > 0 ? (
            content.map((c) => (
              <SingleContent
                key={c.id}
                id={c.id}
                poster={c.poster_path}
                title={c.title || c.name}
                date={c.first_air_date || c.release_date}
                media_type={c.media_type}
                vote_average={c.vote_average}
              />
            ))
          ) : (
            <div>No trending content found</div>
          )}
        </div>
      )}

      <div className="pagination-container">
        <CustomPagination setPage={setPage} />
      </div>
    </div>
  );
};

export default Trending;
