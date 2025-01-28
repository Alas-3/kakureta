'use client';

import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from "next/link"

function AnimeCard({ title, image, year, duration }) {
  const router = useRouter();

  const handleAnimeClick = async (animeTitle) => {
    try {
      const encodedTitle = encodeURIComponent(animeTitle);
      const response = await fetch(
        `https://kakureta-consumet-api.vercel.app/anime/zoro/${encodedTitle}?page=1`
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
    <div 
      onClick={() => handleAnimeClick(title)}
      className="group flex-shrink-0 w-[160px] cursor-pointer transition-transform hover:scale-[0.98]"
    >
      <div className="relative aspect-[3/4] rounded-lg overflow-hidden mb-2">
        <Image 
          src={image || "/placeholder.svg"} 
          alt={title}
          fill
          className="object-cover"
          sizes="160px"
        />
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-12 h-12 text-white"
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
        </div>
      </div>
      <div className="space-y-1">
        <h3 className="font-medium text-sm text-foreground line-clamp-2">{title}</h3>
        <div className="flex items-center text-xs text-muted-foreground">
          <span>{year}</span>
          {duration && (
            <>
              <span className="mx-1">•</span>
              <span>{duration}</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function MovieList({ title, movies = [], seeAllLink }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg lg:text-xl font-semibold">{title}</h2>
        {seeAllLink && (
          <Link href={seeAllLink} className="text-sm text-muted-foreground hover:text-primary">
            See all
          </Link>
        )}
      </div>
      {movies.length > 0 ? (
        <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 lg:gap-6 lg:-mx-6 lg:px-6">
          {movies.map((movie, index) => (
            <AnimeCard
              key={movie.id || index}
              title={movie.title}
              image={movie.image}
              year={movie.year}
              duration={movie.duration}
            />
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No movies available.</p>
      )}
    </div>
  );
}