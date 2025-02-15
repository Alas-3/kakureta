import { useRouter } from "next/router";
import Image from "next/image";

export default function AnimeCard({ title, image, year, duration }) {
  const router = useRouter();

  const handleAnimeClick = async (animeTitle) => {
    try {
      const encodedTitle = encodeURIComponent(animeTitle);
      const baseUrl = process.env.NEXT_PUBLIC_CONSUMET_API_URL;
      const response = await fetch(
        `${baseUrl}/anime/zoro/${encodedTitle}?page=1`
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
        <h3 className="font-medium text-sm text-foreground line-clamp-2">
          {title}
        </h3>
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
