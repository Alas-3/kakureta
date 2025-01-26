import { Suspense } from "react"
import Image from "next/image"
import { BottomNav } from "@/pages/components/bottom-nav"
import { MovieList } from "@/pages/components/movie-list"
import { getFeaturedMovie, getBestAnime, getPopularAnime } from "@/pages/api/api"
import { useRouter } from "next/router"

// FeaturedMovie component
function FeaturedMovie({ onAnimeClick }) {
  const movie = {
    title: "Jujutsu Kaisen",
    image: "https://static1.cbrimages.com/wordpress/wp-content/uploads/2021/03/jujutsu-kaisen-banner.jpg",  // Using the provided image URL
    description: "A high school student gains supernatural powers after a dangerous encounter with a cursed object.",
  };

  return (
    <div className="relative aspect-[2/3] lg:aspect-[21/9] rounded-xl overflow-hidden">
      <Image src={movie.image || "/placeholder.svg"} alt={movie.title} fill className="object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-4 lg:p-6 space-y-2">
        <h1 className="text-2xl lg:text-4xl font-bold">{movie.title}</h1>
        <p className="text-sm lg:text-base opacity-70 line-clamp-2 lg:line-clamp-none max-w-xl">{movie.description}</p>
        <button className="btn btn-primary" onClick={() => onAnimeClick(movie.title)} disabled>
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
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Watch now
        </button>
      </div>
    </div>
  );
}

// Main component for the home page
export default function Home() {
  const router = useRouter()

  // Function to handle anime click
  const handleAnimeClick = async (animeTitle) => {
    try {
      const response = await fetch(`https://kakureta-consumet-api.vercel.app/anime/zoro/${animeTitle}?page=1`)
      const data = await response.json()

      const animeId = data?.data?.[0]?.id
      if (animeId) {
        router.push(`/anime/${animeId}`)
      } else {
        console.log("Anime not found")
      }
    } catch (error) {
      console.error("Error fetching anime details:", error)
    }
  }

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
              <li>
                <a href="/">Home</a>
              </li>
              <li>
                <a href="/search">Search</a>
              </li>
              <li>
                <a href="/bookmarks">Bookmarks</a>
              </li>
              <li>
                <a href="/profile">Profile</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">
            <li>
              <a href="/">Home</a>
            </li>
            <li>
              <a href="/search">Search</a>
            </li>
            <li>
              <a href="/bookmarks">Bookmarks</a>
            </li>
            <li>
              <a href="/profile">Profile</a>
            </li>
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
          <Suspense fallback={<div className="h-96 bg-muted animate-pulse rounded-xl"></div>}>
            <FeaturedMovieWrapper onAnimeClick={handleAnimeClick} />
          </Suspense>

          {/* Best Anime Section */}
          <Suspense fallback={<div className="h-64 bg-muted animate-pulse rounded-xl"></div>}>
            <BestAnimeWrapper onAnimeClick={handleAnimeClick} />
          </Suspense>

          {/* Popular Anime Section */}
          <Suspense fallback={<div className="h-64 bg-muted animate-pulse rounded-xl"></div>}>
            <PopularAnimeWrapper onAnimeClick={handleAnimeClick} />
          </Suspense>
        </div>
      </main>

      {/* Bottom Navigation for mobile */}
      <BottomNav />
    </div>
  )
}

// Wrapper components for data fetching
async function FeaturedMovieWrapper({ onAnimeClick }) {
  // You'll need to implement getFeaturedMovie in your API
  const featuredMovie = await getFeaturedMovie()
  return <FeaturedMovie movie={featuredMovie} onAnimeClick={onAnimeClick} />
}

async function BestAnimeWrapper({ onAnimeClick }) {
  const bestAnime = await getBestAnime()
  return <MovieList title="Best anime" movies={bestAnime} seeAllLink="/category/best" onAnimeClick={onAnimeClick} />
}

async function PopularAnimeWrapper({ onAnimeClick }) {
  const popularAnime = await getPopularAnime()
  return <MovieList title="Popular" movies={popularAnime} seeAllLink="/category/popular" onAnimeClick={onAnimeClick} />
}
