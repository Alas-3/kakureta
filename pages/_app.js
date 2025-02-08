import "@/styles/globals.css";
import { useEffect } from "react"; // Import useEffect from React

export default function App({ Component, pageProps }) {
  useEffect(() => {
    // Clear the cache when the app initializes
    if (typeof window !== 'undefined') {
      localStorage.removeItem('recentEpisodesData');
      localStorage.removeItem('recentAnimeData');
    }
  }, []);

  return <Component {...pageProps} />;
}