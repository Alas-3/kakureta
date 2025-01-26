import Link from "next/link"
import AnimeCard from "./movie-card" // Import the AnimeCard component

export function MovieList({ title, movies, seeAllLink, onAnimeClick }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg lg:text-xl font-semibold">{title}</h2>
        <Link href={seeAllLink} className="btn btn-link">
          See all
        </Link>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 lg:gap-6 lg:-mx-6 lg:px-6">
        {movies.map((movie) => (
          <AnimeCard
            key={movie.id}
            id={movie.id}
            title={movie.title}
            image={movie.image}
            year={movie.year}
            duration={movie.duration}
            onClick={() => onAnimeClick(movie.title)}
          />
        ))}
      </div>
    </div>
  )
}

