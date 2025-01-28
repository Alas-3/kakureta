"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import BottomNav from "@/pages/components/bottom-nav";
import { getSearchResults } from "@/pages/api/api";

export default function Search() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const router = useRouter();

  const handleSearch = useCallback(
    async (e) => {
      e.preventDefault();

      if (!query.trim()) return;

      setLoading(true);
      try {
        const data = await getSearchResults(query, page);
        setResults(data.results || []);
        setTotalPages(data.totalPages || 0);
      } catch (error) {
        console.error("Error fetching search results:", error);
      } finally {
        setLoading(false);
      }
    },
    [query, page]
  );

  const handleAnimeClick = (anime) => {
    if (anime.type === "TV Series") {
      router.push(`/anime/${anime.id}/page`);
      return;
    }

    const shouldNavigate = window.confirm(
      `You're selecting "${anime.title}" (${anime.type}${
        anime.year ? ` - ${anime.year}` : ""
      }). Continue?`
    );
    if (shouldNavigate) {
      router.push(`/anime/${anime.id}`);
    }
  };

  const handlePageChange = useCallback(
    (newPage) => {
      setPage(newPage);
      handleSearch(new Event("submit"));
    },
    [handleSearch]
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header/Navbar */}
      <header className="navbar bg-base-200 sticky top-0 z-50 backdrop-blur-lg bg-opacity-90">
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
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />
              </svg>
            </label>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
            >
              <li>
                <Link href="/">Home</Link>
              </li>
              <li>
                <Link href="/search">Search</Link>
              </li>
              <li>
                <Link href="/bookmarks">Bookmarks</Link>
              </li>
              <li>
                <Link href="/profile">Profile</Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <Link href="/search">Search</Link>
            </li>
            <li>
              <Link href="/bookmarks">Bookmarks</Link>
            </li>
            <li>
              <Link href="/profile">Profile</Link>
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

      {/* Main Content */}
      <main className="container mx-auto max-w-7xl pb-16 lg:pb-0">
        {/* Search Section */}
        <div className="p-4 lg:p-6 space-y-6">
          <div className="max-w-2xl mx-auto space-y-4">
            <h1 className="text-2xl font-bold text-center lg:text-3xl">
              Discover Anime
            </h1>
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search for anime..."
                className="input input-lg w-full bg-base-200/50 border-2 border-primary/20 focus:border-primary transition-colors pl-12"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <button
                type="submit"
                className="absolute right-4 top-1/2 -translate-y-1/2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-muted-foreground"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>
            </form>
          </div>

          {/* Custom Results Section */}
          <div className="space-y-6">
            {loading ? (
              <div className="space-y-4">
                <div className="h-8 bg-muted w-48 rounded animate-pulse"></div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                  {[...Array(10)].map((_, i) => (
                    <div key={i} className="space-y-2">
                      <div className="aspect-[2/3] bg-muted rounded-lg animate-pulse"></div>
                      <div className="h-4 bg-muted w-3/4 rounded animate-pulse"></div>
                      <div className="h-4 bg-muted w-1/2 rounded animate-pulse"></div>
                    </div>
                  ))}
                </div>
              </div>
            ) : results.length > 0 ? (
              <>
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">
                    Results for "{query}"
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                    {results.map((anime) => (
                      <div
                        key={anime.id}
                        onClick={() => handleAnimeClick(anime)}
                        className="cursor-pointer group"
                      >
                        <div className="relative aspect-[2/3] overflow-hidden rounded-lg">
                          <img
                            src={
                              anime.image ||
                              "https://via.placeholder.com/300x450"
                            }
                            alt={anime.title}
                            className="object-cover w-full h-full transition-transform group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <span className="text-white text-sm font-medium px-2 text-center">
                              {anime.type === "TV Series"
                                ? "Watch Now"
                                : "View Details"}
                            </span>
                          </div>
                        </div>
                        <div className="mt-2 space-y-1">
                          <h3 className="font-medium line-clamp-2 group-hover:text-primary transition-colors">
                            {anime.title}
                          </h3>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <span className="capitalize">{anime.type}</span>
                            {anime.year && (
                              <>
                                <span className="mx-1">•</span>
                                <span>{anime.year}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pagination */}
                <div className="flex justify-center items-center gap-4 pt-4">
                  <button
                    disabled={page <= 1}
                    onClick={() => handlePageChange(page - 1)}
                    className="btn btn-circle btn-primary btn-sm"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </button>
                  <span className="text-sm font-medium">
                    Page {page} of {totalPages}
                  </span>
                  <button
                    disabled={page >= totalPages}
                    onClick={() => handlePageChange(page + 1)}
                    className="btn btn-circle btn-primary btn-sm"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </div>
              </>
            ) : query ? (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium">No results found</h3>
                <p className="text-muted-foreground">
                  Try searching for something else
                </p>
              </div>
            ) : null}
          </div>
        </div>
      </main>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
