import axios from "axios";

// Base URL for the Consumet API
const baseUrl = "https://api.consumet.stream";

// Function to fetch a list of anime from Zoro
export const getAnimeList = async (page = 1, query = "") => {
  try {
    const response = await axios.get(`${baseUrl}/zoro/anime`, {
      params: {
        page: page,
        query: query,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching anime list:", error);
    return { results: [] };  // Returning an empty array in case of error
  }
};

// Function to fetch details of a specific anime
export const getAnimeDetails = async (animeId) => {
  try {
    const response = await axios.get(`${baseUrl}/zoro/anime-details/${animeId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching anime details:", error);
    return null;
  }
};

// Function to fetch episodes of a specific anime
export const getAnimeEpisodes = async (animeId) => {
  try {
    const response = await axios.get(`${baseUrl}/zoro/anime-episodes/${animeId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching anime episodes:", error);
    return { episodes: [] };  // Returning an empty array in case of error
  }
};
