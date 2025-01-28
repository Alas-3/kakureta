"use client";

import { Suspense } from "react";
import BottomNav from "./components/bottom-nav";
import MovieList from "./components/movie-list";
import Footer from "./components/footer";
import { getFeaturedMovie, getBestAnime, getPopularAnime, getRecentAnime } from "@/pages/api/api";
import { useRouter } from "next/navigation";
import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX } from "lucide-react";

function FeaturedMovie({ movies, onAnimeClick }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [player, setPlayer] = useState(null);
  const playerRef = useRef(null);
  const intervalRef = useRef(null);

  const initializeYouTubePlayer = () => {
    if (!movies[currentIndex]?.trailer?.embed_url) return;
    
    if (player) {
      player.destroy();
    }

    const newPlayer = new window.YT.Player(playerRef.current, {
      videoId: getYouTubeId(movies[currentIndex].trailer.embed_url),
      playerVars: {
        autoplay: 1,
        controls: 0,
        mute: 1,
        rel: 0,
        modestbranding: 1,
        loop: 0,
        playsinline: 1,
        showinfo: 0,
        iv_load_policy: 3,
        origin: window.location.origin,
        widget_referrer: window.location.origin,
        enablejsapi: 1
      },
      events: {
        onReady: (event) => {
          setPlayer(event.target);
          event.target.playVideo();
        },
        onStateChange: (event) => {
          if (event.data === window.YT.PlayerState.ENDED) {
            setCurrentIndex((prev) => (prev + 1) % movies.length);
          }
        },
        onError: (event) => {
          console.log("YouTube player error:", event.data);
          if (event.data === 150 || event.data === 101) {
            const playerElement = playerRef.current;
            if (playerElement) {
              playerElement.innerHTML = `
                <div class="w-full h-full bg-black flex items-center justify-center">
                  <img 
                    src="${movies[currentIndex].images.jpg.large_image_url || movies[currentIndex].images.jpg.image_url}"
                    alt="${movies[currentIndex].title}"
                    class="w-full h-full object-cover"
                  />
                </div>
              `;
            }
          }
        }
      }
    });
  };

  useEffect(() => {
    // Load YouTube IFrame API
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

      window.onYouTubeIframeAPIReady = initializeYouTubePlayer;
    } else {
      initializeYouTubePlayer();
    }

    return () => {
      if (player) {
        player.destroy();
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [currentIndex, movies]);

  const getYouTubeId = (url) => {
    if (!url) return null;
    const match = url.match(/(?:embed\/|watch\?v=|youtu.be\/|\/v\/|\/e\/|watch\?feature=player_embedded&v=)([^#\&\?\/]*)/);
    return match && match[1];
  };

  const handleMuteToggle = () => {
    if (player) {
      if (isMuted) {
        player.unMute();
      } else {
        player.mute();
      }
      setIsMuted(!isMuted);
    }
  };

  const handlePlayPause = () => {
    if (player) {
      if (isPlaying) {
        player.pauseVideo();
      } else {
        player.playVideo();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const currentMovie = movies[currentIndex];
  if (!currentMovie) return null;

  const hasTrailer = currentMovie.trailer?.embed_url;

  return (
    <div className="relative aspect-[2/3] lg:aspect-[21/9] rounded-xl overflow-hidden group">
      {hasTrailer ? (
        <div className="absolute inset-0 w-full h-full bg-black">
          <div ref={playerRef} className="w-full h-full" />
        </div>
      ) : (
        <div className="absolute inset-0 w-full h-full">
          <img 
            src={currentMovie.images.jpg.large_image_url || currentMovie.images.jpg.image_url} 
            alt={currentMovie.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-4 lg:p-6 space-y-2">
        <h1 className="text-2xl lg:text-4xl font-bold text-white">{currentMovie.title}</h1>
        <div className="flex items-center gap-4">
          <button 
            className="inline-flex items-center px-4 py-2 bg-white text-black rounded-lg hover:bg-white/90 transition-colors"
            onClick={() => onAnimeClick(currentMovie.title)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
              />
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
              />
            </svg>
            Watch now
          </button>
          {hasTrailer && (
            <>
              <button
                onClick={handlePlayPause}
                className="p-2 rounded-full bg-black/50 text-white backdrop-blur-sm transition-colors hover:bg-black/70"
              >
                {isPlaying ? (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  </svg>
                )}
              </button>
              <button
                onClick={handleMuteToggle}
                className="p-2 rounded-full bg-black/50 text-white backdrop-blur-sm transition-colors hover:bg-black/70"
              >
                {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Carousel indicators */}
      <div className="absolute bottom-4 right-4 flex gap-2">
        {movies.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentIndex 
                ? 'bg-white w-6' 
                : 'bg-white/50 hover:bg-white/75'
            }`}
            onClick={() => {
              setCurrentIndex(index);
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  const router = useRouter();
  const [featuredMovies, setFeaturedMovies] = useState([]);
  const [bestAnime, setBestAnime] = useState([]);
  const [popularAnime, setPopularAnime] = useState([]);
  const [recentAnime, setRecentAnime] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [featured, best, popular, recent] = await Promise.all([
          getFeaturedMovie(),
          getBestAnime(),
          getPopularAnime(),
          getRecentAnime()
        ]);
        
        setFeaturedMovies(featured || []);
        setBestAnime(best || []);
        setPopularAnime(popular || []);
        setRecentAnime(recent || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleAnimeClick = async (animeTitle) => {
    try {
      const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
      const response = await fetch(
        `${BASE_URL}/anime/zoro/${encodeURIComponent(animeTitle)}?page=1`
      );
      const data = await response.json();

      const animeId = data?.results?.[0]?.id;
      if (animeId) {
        router.push(`/anime/${animeId}/page`);
      } else {
        console.log("Anime not found");
      }
    } catch (error) {
      console.error("Error fetching anime details:", error);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header/Navbar */}
      <header className="navbar bg-base-200">
        <div className="navbar-start">
          <div className="dropdown">
            <label tabIndex={0} className="btn btn-ghost lg:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
              </svg>
            </label>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
            >
              <li><a href="/">Home</a></li>
              <li><a href="/search">Search</a></li>
              <li><a href="/bookmarks">Bookmarks</a></li>
              <li><a href="/profile">Profile</a></li>
            </ul>
          </div>
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">
            <li><a href="/">Home</a></li>
            <li><a href="/search">Search</a></li>
            <li><a href="/bookmarks">Bookmarks</a></li>
            <li><a href="/profile">Profile</a></li>
          </ul>
        </div>
        <div className="navbar-end">
          <button className="btn btn-ghost btn-circle">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="pb-16 lg:pb-0">
        <div className="p-4 lg:p-6 space-y-6 lg:space-y-8">
          {/* Featured Movie Section */}
          <div className="min-h-[400px]">
            {featuredMovies.length > 0 ? (
              <FeaturedMovie movies={featuredMovies} onAnimeClick={handleAnimeClick} />
            ) : (
              <div className="h-96 bg-muted animate-pulse rounded-xl" />
            )}
          </div>

          {/* Movie Lists */}
          <div className="space-y-8">
            {recentAnime.length > 0 && (
              <MovieList
                title="Recently Aired"
                movies={recentAnime}
                seeAllLink="/category/recent"
                onAnimeClick={handleAnimeClick}
              />
            )}

            {bestAnime.length > 0 && (
              <MovieList
                title="Best Anime"
                movies={bestAnime}
                seeAllLink="/category/best"
                onAnimeClick={handleAnimeClick}
              />
            )}

            {popularAnime.length > 0 && (
              <MovieList
                title="Popular"
                movies={popularAnime}
                seeAllLink="/category/popular"
                onAnimeClick={handleAnimeClick}
              />
            )}
          </div>
        </div>
        <Footer />
      </main>

      {/* Bottom Navigation for mobile */}
      <BottomNav />
    </div>
  );
}