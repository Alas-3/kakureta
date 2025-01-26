// AnimeCarousel.js
import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';


function AnimeCarousel() {
  const [topAnime, setTopAnime] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const animeData = await getTopAnimeFromMAL();
      setTopAnime(animeData);
    };

    fetchData();
  }, []);

  if (topAnime.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <Slider
        dots={true}
        infinite={true}
        speed={500}
        slidesToShow={1}
        slidesToScroll={1}
        className="carousel"
      >
        {topAnime.map((anime) => (
          <div key={anime.mal_id} className="relative">
            <img
              src={anime.images.webp.large_image_url}
              alt={anime.title}
              className="object-cover w-full h-60 md:h-80"
            />
            <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black via-transparent p-4">
              <h3 className="text-white text-xl font-bold">{anime.title}</h3>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
}

export default AnimeCarousel;
