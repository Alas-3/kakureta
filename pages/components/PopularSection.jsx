// components/PopularSection.js
import React, { useEffect, useState } from 'react';

const PopularSection = () => {
    const [topAnime, setTopAnime] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function getTopAnime() {
            try {
                const response = await fetch('/api/scrape');  // This calls the API route we created
                const data = await response.json();
                setTopAnime(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching top anime:', error);
                setLoading(false);
            }
        }
        getTopAnime();
    }, []);

    return (
        <section className="popular-section py-8">
            <h2 className="text-2xl font-bold mb-6">Popular Anime</h2>
            {loading ? (
                <div>Loading...</div>  // Show loading indicator
            ) : (
                <div className="anime-list grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {topAnime.map((anime, index) => (
                        <div key={index} className="anime-card bg-gray-800 text-white p-4 rounded-lg">
                            <a href={anime.link}>
                                <img src={anime.image} alt={anime.title} className="w-full h-auto mb-4 rounded-lg" />
                                <h3 className="text-lg font-semibold">{anime.title}</h3>
                                <p>{anime.episodeCount} Episodes</p>
                            </a>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
};

export default PopularSection;
