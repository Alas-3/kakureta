//pages/anime/[id]/page.jsx
import { useEffect, useState, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Heart, Play, Share2 } from "lucide-react"
import Hls from "hls.js"

// Fetch anime details from Zoro by its ID
async function getAnimeDetailsFromZoro(id) {
  const baseUrl = process.env.NEXT_PUBLIC_CONSUMET_API_URL;
  const response = await fetch(`${baseUrl}/anime/zoro/info?id=${id}`)
  const data = await response.json()

  if (!data || !data.episodes) {
    console.error("Data or episodes missing:", data)
    return {
      title: "Unknown",
      rating: "N/A",
      synopsis: "No description available",
      image: "",
      episodes: [],
    }
  }

  return {
    title: data.title || "Unknown",
    rating: data.averageScore ? (data.averageScore / 10).toFixed(1) : "N/A",
    synopsis: data.description || "No description available",
    image: data.image || "",
    episodes: data.episodes.map((ep) => ({
      number: ep.number || "N/A",
      title: ep.title || "Untitled",
      id: ep.id || "",
    })),
  }
}

// Update the getAnimeDetailsFromJikan function to prioritize extra large images
async function getAnimeDetailsFromJikan(title) {
  try {
    const searchResponse = await fetch(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(title)}&limit=1`)
    const searchData = await searchResponse.json()

    if (!searchData.data || searchData.data.length === 0) {
      return null
    }

    const animeData = searchData.data[0]
    const images = animeData.images
    
    // Try to get the best quality image available
    const bannerImage = 
      images?.jpg?.large_image_url || 
      images?.webp?.large_image_url ||
      images?.jpg?.image_url ||
      images?.webp?.image_url

    return {
      bannerImage,
      genres: animeData.genres.map(genre => genre.name),
      rating: animeData.score ? animeData.score.toFixed(1) : "N/A",
      synopsis: animeData.synopsis || "No description available"
    }
  } catch (error) {
    console.error("Error fetching Jikan data:", error)
    return null
  }
}

// Fetch video sources for an episode
async function getVideoSource(episodeId) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_CONSUMET_API_URL;
    const response = await fetch(
      `${baseUrl}/anime/zoro/watch?episodeId=${episodeId}&server=vidstreaming`,
    )
    const data = await response.json()

    if (data.sources && data.sources.length > 0) {
      const hlsSource = data.sources.find((source) => source.isM3U8)
      return {
        videoUrl: hlsSource ? hlsSource.url : null,
        subtitles: data.subtitles || [],
      }
    }
    return null
  } catch (error) {
    console.error("Error fetching video source:", error)
    return null
  }
}

export default function AnimePage() {
  const params = useParams()
  const id = params?.id
  const videoRef = useRef(null)
  const hlsRef = useRef(null)
  const [animeDetails, setAnimeDetails] = useState(null)
  const [jikanDetails, setJikanDetails] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedEpisode, setSelectedEpisode] = useState(null)
  const [videoUrl, setVideoUrl] = useState(null)
  const [subtitles, setSubtitles] = useState([])
  const [selectedSubtitle, setSelectedSubtitle] = useState(null)
  const [showControls, setShowControls] = useState(true)
  const controlsTimeoutRef = useRef(null)

  useEffect(() => {
    if (!id) return
    const fetchAnimeDetails = async () => {
      setLoading(true)
      try {
        const zoroData = await getAnimeDetailsFromZoro(id)
        setAnimeDetails(zoroData)
        
        // Fetch Jikan details using the anime title
        if (zoroData.title) {
          const jikanData = await getAnimeDetailsFromJikan(zoroData.title)
          if (jikanData) {
            setJikanDetails(jikanData)
          }
        }
      } catch (error) {
        console.error("Error fetching anime details:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchAnimeDetails()
  }, [id])

  useEffect(() => {
    if (!videoUrl || !videoRef.current) return

    if (hlsRef.current) {
      hlsRef.current.destroy()
    }

    if (Hls.isSupported()) {
      const hls = new Hls()
      hlsRef.current = hls
      hls.loadSource(videoUrl)
      hls.attachMedia(videoRef.current)
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        videoRef.current.play().catch((error) => {
          console.error("Error playing video:", error)
        })
      })
    } else if (videoRef.current.canPlayType("application/vnd.apple.mpegurl")) {
      videoRef.current.src = videoUrl
      videoRef.current.play().catch((error) => {
        console.error("Error playing video:", error)
      })
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy()
      }
    }
  }, [videoUrl])

  const handleMouseMove = () => {
    setShowControls(true)
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current)
    }
    controlsTimeoutRef.current = setTimeout(() => {
      setShowControls(false)
    }, 3000)
  }

  useEffect(() => {
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current)
      }
    }
  }, [])

  const handleEpisodeSelect = async (episode) => {
    setSelectedEpisode(episode)
    const sourceData = await getVideoSource(episode.id)
    if (sourceData) {
      setVideoUrl(sourceData.videoUrl)
      setSubtitles(sourceData.subtitles)

      const englishSub = sourceData.subtitles.find((sub) => sub.lang.toLowerCase() === "english")
      if (englishSub) {
        setSelectedSubtitle(englishSub)
      }
    }
  }

  if (!id) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-xl font-semibold">Invalid anime ID</h2>
          <Link href="/" className="text-primary hover:underline">
            Go back home
          </Link>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!animeDetails) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-xl font-semibold">Anime not found</h2>
          <Link href="/" className="text-primary hover:underline">
            Go back home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      {videoUrl && (
        <div
          className="fixed inset-0 z-50 bg-black"
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setShowControls(false)}
        >
          <div className="relative w-full h-full">
            <button
              onClick={() => {
                setVideoUrl(null)
                if (hlsRef.current) {
                  hlsRef.current.destroy()
                }
              }}
              className={`absolute top-4 right-4 z-10 p-2 bg-white/10 rounded-full hover:bg-white/20 transition-opacity duration-300 ${
                showControls ? "opacity-100" : "opacity-0"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <video ref={videoRef} controls className="w-full h-full" crossOrigin="anonymous">
              {subtitles.map((subtitle, index) => (
                <track
                  key={index}
                  kind="subtitles"
                  src={subtitle.url}
                  srcLang={subtitle.lang.toLowerCase()}
                  label={subtitle.lang}
                  default={subtitle.lang.toLowerCase() === "english"}
                />
              ))}
              Your browser does not support the video tag.
            </video>

            <div
              className={`absolute bottom-20 right-4 z-10 transition-opacity duration-300 ${
                showControls ? "opacity-100" : "opacity-0"
              }`}
            >
              <select
                className="bg-black/50 text-white px-4 py-2 rounded-md backdrop-blur-sm"
                value={selectedSubtitle?.lang || ""}
                onChange={(e) => {
                  const selected = subtitles.find((sub) => sub.lang === e.target.value)
                  setSelectedSubtitle(selected)
                }}
              >
                <option value="">No subtitles</option>
                {subtitles.map((subtitle, index) => (
                  <option key={index} value={subtitle.lang}>
                    {subtitle.lang}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      <div className="relative">
        <div className="relative h-[60vh] md:h-[70vh] overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src={jikanDetails?.bannerImage || animeDetails.image || "/placeholder.svg"}
              alt={animeDetails.title}
              fill
              className="object-cover"
              priority
              quality={100}
              sizes="100vw"
              style={{
                objectPosition: 'center 20%'
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />
          </div>
        </div>

        <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between">
          <Link
            href="/"
            className="p-2 rounded-full bg-black/50 text-white backdrop-blur-md transition-colors hover:bg-black/70"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div className="flex gap-4">
            <button className="p-2 rounded-full bg-black/50 text-white backdrop-blur-md transition-colors hover:bg-black/70">
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
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
            </button>
            <button className="p-2 rounded-full bg-black/50 text-white backdrop-blur-md transition-colors hover:bg-black/70">
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
                  strokeWidth={2}
                  d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="absolute -bottom-8 left-0 right-0 flex justify-between px-6">
          <button className="p-3 rounded-full bg-primary text-white shadow-lg transition-transform hover:scale-105">
            <Heart className="h-6 w-6" />
          </button>

          <button className="p-5 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white -mb-8 transform -translate-y-1/3 shadow-xl transition-all hover:scale-110 hover:shadow-2xl hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-purple-300">
            <Play className="h-10 w-10 fill-current" />
          </button>

          <button className="p-3 rounded-full bg-primary text-white shadow-lg transition-transform hover:scale-105">
            <Share2 className="h-6 w-6" />
          </button>
        </div>
      </div>

      <div className="px-4 pt-16 pb-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">{animeDetails.title}</h1>
          <div className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-yellow-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-lg font-semibold">{jikanDetails?.rating || animeDetails.rating}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {jikanDetails?.genres.map((genre, index) => (
            <div key={index} className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
              {genre}
            </div>
          ))}
        </div>

        <div className="space-y-2">
          <h2 className="text-lg font-semibold">Synopsis</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {jikanDetails?.synopsis || animeDetails.synopsis}
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Episodes</h2>
          <div className="space-y-4">
            {animeDetails.episodes.length > 0 ? (
              animeDetails.episodes.map((episode, index) => (
                <div key={index} className="flex gap-4 bg-muted/50 rounded-lg p-3 transition-colors hover:bg-muted/70">
                  <div className="relative w-32 aspect-video rounded-lg overflow-hidden flex-shrink-0 bg-muted">
                    <Image
                      src={jikanDetails?.bannerImage || animeDetails.image || "/placeholder.svg"}
                      alt={episode.title}
                      fill
                      className="object-cover"
                      quality={80}
                      sizes="(max-width: 768px) 100px, 128px"
                    />
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <h3 className="font-medium text-sm">Episode {episode.number}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-1">{episode.title}</p>
                    </div>
                    <button
                      onClick={() => handleEpisodeSelect(episode)}
                      className="self-start mt-2 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
                    >
                      Watch Now
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">No episodes available</div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}