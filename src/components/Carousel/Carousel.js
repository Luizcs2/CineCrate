import axios from "axios";
import React, { useEffect, useState } from "react";
import AliceCarousel from "react-alice-carousel";
import "react-alice-carousel/lib/alice-carousel.css";
import { img_300, noPicture } from "../../config/config";
import "./Carousel.css";

const handleDragStart = (e) => e.preventDefault();

const Gallery = ({ id, media_type }) => {
  const [credits, setCredits] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCredits = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `https://api.themoviedb.org/3/${media_type}/${id}/credits?api_key=${process.env.REACT_APP_API_KEY}&language=en-US`
      );
      
      // Filter to show only cast members with profile images if possible
      const filteredCast = data.cast.filter(
        (member) => member.profile_path || data.cast.length <= 10
      );
      
      // Limit to top 20 cast members
      setCredits(filteredCast.slice(0, 20));
    } catch (error) {
      console.error("Error fetching credits:", error);
      setCredits([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCredits();
    // eslint-disable-next-line
  }, [id, media_type]);

  const items = credits.map((person) => (
    <div className="carouselItem" key={person.id}>
      <img
        src={person.profile_path ? `${img_300}/${person.profile_path}` : noPicture}
        alt={person.name}
        onDragStart={handleDragStart}
        className="carouselItem__img"
        loading="lazy"
      />
      <b className="carouselItem__txt">{person.name}</b>
      {person.character && (
        <span className="carouselItem__character">{person.character}</span>
      )}
    </div>
  ));

  const responsive = {
    0: {
      items: 3,
    },
    512: {
      items: 4,
    },
    768: {
      items: 5,
    },
    1024: {
      items: 7,
    },
  };

  return (
    <>
      {loading ? (
        <div style={{ textAlign: 'center', padding: '20px' }}>Loading cast...</div>
      ) : credits.length > 0 ? (
        <AliceCarousel
          mouseTracking
          infinite
          disableDotsControls={credits.length <= responsive[0].items}
          disableButtonsControls={true}
          responsive={responsive}
          items={items}
          autoPlay
          autoPlayInterval={3000}
          animationDuration={800}
        />
      ) : (
        <div style={{ textAlign: 'center', padding: '20px' }}>No cast information available</div>
      )}
    </>
  );
};

export default Gallery;