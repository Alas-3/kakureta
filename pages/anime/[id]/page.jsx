import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"

// Fetch anime details from Zoro by its ID
async function getAnimeDetailsFromZoro(id) {
  const response = await fetch(`https://kakureta-consumet-api.vercel.app/anime/zoro/info?id=${id}`);
  const data = await response.json();

  if (!data || !data.episodes) {
    console.error("Data or episodes missing:", data);
    return {
      title: "Unknown",
      rating: "N/A",
      synopsis: "No description available",
      image: "", // Include the image field
      episodes: [],
    };
  }

  return {
    title: data.title || "Unknown",
    rating: data.averageScore ? (data.averageScore / 10).toFixed(1) : "N/A",
    synopsis: data.description || "No description available",
    image: data.image || "", // Ensure you get the image field from the API
    episodes: data.episodes.map((ep) => ({
      number: ep.number || "N/A",
      title: ep.title || "Untitled",
      url: ep.url || "#",
    })),
  };
}


export default function AnimePage() {
  const router = useRouter()
  const { id } = router.query

  const [animeDetails, setAnimeDetails] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return

    const fetchAnimeDetails = async () => {
      setLoading(true)
      try {
        const data = await getAnimeDetailsFromZoro(id)
        setAnimeDetails(data)
      } catch (error) {
        console.error("Error fetching anime details:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchAnimeDetails()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!animeDetails) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-xl font-semibold">Anime not found</h2>
          <Link href="/" className="btn btn-primary">
            Go back home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <div className="relative">
        {/* Main Image Container */}
        <div className="relative h-[50vh] md:h-[60vh]">
          <Image
            src={animeDetails.image} // Use the dynamic image from animeDetails
            alt={animeDetails.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        </div>

        {/* Header */}
        <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between">
          <Link href="/" className="btn btn-circle btn-ghost bg-black/50 text-white backdrop-blur-md">
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
            <button className="btn btn-circle btn-ghost bg-black/50 text-white backdrop-blur-md">
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
            <button className="btn btn-circle btn-ghost bg-black/50 text-white backdrop-blur-md">
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

        {/* Bottom Action Buttons */}
        <div className="absolute -bottom-6 left-0 right-0 flex justify-between px-6">
          <button className="btn btn-circle bg-primary text-white shadow-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </button>

          <button className="btn btn-circle btn-primary btn-lg -mb-8 transform translate-y-1 shadow-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
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
          </button>

          <button className="btn btn-circle bg-primary text-white shadow-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684z"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pt-12 pb-6 space-y-6">
        {/* Title and Rating */}
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
            <span className="text-lg">{animeDetails.rating}</span>
          </div>
        </div>

        {/* Tags */}
        <div className="flex gap-2">
          <div className="badge badge-outline">drama</div>
          <div className="badge badge-outline">adventure</div>
          <div className="badge badge-outline">animation</div>
        </div>

        {/* Synopsis */}
        <div className="space-y-2">
          <h2 className="text-lg font-semibold">Synopsis</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">{animeDetails.synopsis}</p>
        </div>

        {/* Episodes */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Episodes</h2>
          <div className="space-y-4">
            {animeDetails.episodes.length > 0 ? (
              animeDetails.episodes.map((episode, index) => (
                <div key={index} className="flex gap-4">
                  <div className="relative w-32 aspect-video rounded-lg overflow-hidden flex-shrink-0 bg-muted">
                    <Image
                      src={animeDetails.image}
                      alt={episode.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm">Episode {episode.number}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-1">{episode.title}</p>
                    <a
                      href={episode.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary btn-sm mt-2"
                    >
                      Watch Now
                    </a>
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

