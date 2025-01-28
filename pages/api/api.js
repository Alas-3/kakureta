//pages/api/api.js
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

// Helper function to check if we are in the browser
const isBrowser = typeof window !== "undefined";

// Fetch best anime using Jikan API with caching, limited to the first 20
export async function getBestAnime() {
  if (isBrowser) {
    const cachedData = localStorage.getItem("bestAnimeData");

    if (cachedData) {
      return JSON.parse(cachedData); // Return cached data if it exists
    }
  }

  // If not cached, fetch the data
  const response = await fetch("https://api.jikan.moe/v4/top/anime");
  const data = await response.json();
  
  // Check if the data has results
  if (!data.data || data.data.length === 0) {
    return [];  // Return an empty array if no results are found
  }

  // Limit the results to the first 20
  const result = data.data.slice(0, 20).map((anime) => ({
    id: anime.mal_id,
    title: anime.title,
    image: anime.images.jpg.image_url,
    year: anime.year,
    duration: anime.duration || "N/A",
  }));

  if (isBrowser) {
    // Cache the data in localStorage
    localStorage.setItem("bestAnimeData", JSON.stringify(result));
  }

  return result;
}

// Fetch popular anime this season using Jikan API with caching, limited to the first 20
export async function getPopularAnime() {
  if (isBrowser) {
    const cachedData = localStorage.getItem("popularAnimeData");

    if (cachedData) {
      return JSON.parse(cachedData); // Return cached data if it exists
    }
  }

  // If not cached, fetch the data
  const response = await fetch("https://api.jikan.moe/v4/seasons/now");
  const data = await response.json();

  // Check if the data has results
  if (!data.data || data.data.length === 0) {
    return [];  // Return an empty array if no results are found
  }

  // Limit the results to the first 20
  const result = data.data.slice(0, 20).map((anime) => ({
    id: anime.mal_id,
    title: anime.title,
    image: anime.images.jpg.image_url,
    year: anime.year,
    duration: anime.duration || "N/A",
  }));

  if (isBrowser) {
    // Cache the data in localStorage
    localStorage.setItem("popularAnimeData", JSON.stringify(result));
  }

  return result;
}

// Fetch anime details from Zoro by its ID with caching
export async function getAnimeDetails(id) {
  if (isBrowser) {
    const cachedData = localStorage.getItem(`animeDetailsData-${id}`);
    if (cachedData) {
      return JSON.parse(cachedData); // Return cached data if it exists
    }
  }

  // Fetch the data from Zoro if not cached
  try {
    const response = await fetch(`${BASE_URL}/anime/zoro/info?id=${id}`);
    
    // Check for successful response
    if (!response.ok) {
      throw new Error("Failed to fetch anime details");
    }
    
    const data = await response.json();
    
    // Handle cases where the API response might be incomplete or malformed
    if (!data || !data.title || !data.episodes) {
      return {
        title: "Unknown",
        rating: "N/A",
        synopsis: "No description available",
        episodes: [],
      };
    }

    // Prepare the result object
    const result = {
      title: data.title?.romaji || "Unknown",  // Use a fallback if title is missing
      rating: data.averageScore ? (data.averageScore / 10).toFixed(1) : "N/A",  // Ensure rating is a number
      synopsis: data.description || "No description available",  // Use fallback for synopsis
      episodes: data.episodes?.map((ep) => ({
        number: ep.number || "Unknown",  // Fallback if episode number is missing
        title: ep.title || "Unknown",    // Fallback if episode title is missing
        audio: ep.audio || "N/A",        // Fallback if audio info is missing
        bitrate: ep.bitrate ? `${ep.bitrate} kb/s` : "N/A",  // Fallback if bitrate is missing
        runtime: ep.duration ? `${ep.duration} min` : "N/A",  // Fallback if runtime is missing
      })) || [],
    };

    // Cache the result in localStorage for future use
    if (isBrowser) {
      localStorage.setItem(`animeDetailsData-${id}`, JSON.stringify(result));
    }

    return result;
  } catch (error) {
    console.error("Error fetching anime details:", error);
    return {
      title: "Unknown",
      rating: "N/A",
      synopsis: "No description available",
      episodes: [],
    };
  }
}

// Fetch featured movie with caching
export async function getFeaturedMovie() {
  try {
    const response = await fetch("https://api.jikan.moe/v4/top/anime");
    const data = await response.json();

    if (!data.data || data.data.length === 0) {
      return [];
    }

    const result = data.data
      .filter(anime => anime.trailer?.embed_url)
      .slice(0, 5)
      .map((anime) => ({
        id: anime.mal_id,
        title: anime.title || anime.title_english || "No title",
        images: {
          jpg: {
            large_image_url: anime.images?.jpg?.large_image_url || 
                            anime.images?.webp?.large_image_url ||
                            anime.images?.jpg?.image_url,
            image_url: anime.images?.jpg?.image_url
          }
        },
        synopsis: anime.synopsis || "No description available",
        trailer: {
          embed_url: anime.trailer.embed_url,
          images: {
            maximum_image_url: anime.trailer.images.maximum_image_url || 
                             anime.trailer.images.large_image_url
          }
        }
      }));

    return result;
  } catch (error) {
    console.error("Error fetching featured movie:", error);
    return [];
  }
}

// Add this new function to get recently aired anime
export async function getRecentAnime() {
  if (isBrowser) {
    const cachedData = localStorage.getItem("recentAnimeData");

    if (cachedData) {
      return JSON.parse(cachedData);
    }
  }

  try {
    // Fetch recently aired anime from Jikan API
    const response = await fetch("https://api.jikan.moe/v4/seasons/now?sort=start_date");
    const data = await response.json();

    if (!data.data || data.data.length === 0) {
      return [];
    }

    // Process and sort by air date
    const result = data.data
      .filter(anime => anime.aired?.from) // Only include anime with air dates
      .sort((a, b) => new Date(b.aired.from) - new Date(a.aired.from)) // Sort by most recent
      .slice(0, 20) // Limit to 20 results
      .map((anime) => ({
        id: anime.mal_id,
        title: anime.title,
        image: anime.images.jpg.image_url,
        year: anime.year,
        duration: anime.duration || "N/A",
        aired: anime.aired.from,
      }));

    if (isBrowser) {
      localStorage.setItem("recentAnimeData", JSON.stringify(result));
    }

    return result;
  } catch (error) {
    console.error("Error fetching recent anime:", error);
    return [];
  }
}

// pages/api/api.js
export const getSearchResults = async (query, page) => {
  try {
    
    const response = await fetch(`${BASE_URL}/anime/zoro/${query}?page=${page}`)
    const data = await response.json()
    
    // Process the results to better handle series vs movies
    const processedResults = (data.results || []).map(result => {
      // Extract year and type from the title
      const yearMatch = result.title.match(/\((\d{4})\)/)
      const year = yearMatch ? yearMatch[1] : null
      
      // Determine if it's a movie or TV series
      const isMovie = result.title.toLowerCase().includes('movie')
      const type = isMovie ? 'Movie' : 'TV Series'
      
      return {
        ...result,
        year,
        type,
        duration: result.duration || 'Unknown',
        // Keep the original title for the MovieList component
        title: result.title
      }
    })

    // Sort results to prioritize main series over movies
    const sortedResults = processedResults.sort((a, b) => {
      const aTitle = a.title.toLowerCase()
      const bTitle = b.title.toLowerCase()
      const searchQuery = query.toLowerCase()

      // Exact matches get highest priority
      if (aTitle === searchQuery && bTitle !== searchQuery) return -1
      if (bTitle === searchQuery && aTitle !== searchQuery) return 1

      // Then prioritize TV series over movies
      if (a.type !== b.type) {
        return a.type === 'TV Series' ? -1 : 1
      }

      // For same type, prefer newer content
      if (a.year !== b.year) {
        return (b.year || '0') - (a.year || '0')
      }

      return 0
    })

    return {
      results: sortedResults,
      totalPages: data.totalPages || 0,
    }
  } catch (error) {
    console.error("Error fetching search results:", error)
    return { results: [], totalPages: 0 }
  }
}