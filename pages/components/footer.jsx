import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full bg-black/50 backdrop-blur-md border-t border-white/5">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {/* Logo and Tagline Section */}
          <div className="flex flex-col items-center md:items-start space-y-4">
            <Link
              href="/"
              className="text-3xl md:text-3xl font-bold tracking-wider hover:text-primary transition-all duration-300 transform hover:scale-105 gradient-text"
              style={{
                fontFamily: "var(--font-russo-one)",
              }}
            >
              KAKURETA.隠れた
            </Link>
            <p className="text-sm text-white/60 text-center md:text-left">
              Your ultimate destination for anime streaming
            </p>
          </div>
        </div>

        {/* Disclaimer and Copyright */}
        <div className="mt-12 pt-8 border-t border-white/10 text-center">
          <p className="text-sm text-white/60 italic leading-relaxed mb-4 max-w-3xl mx-auto">
            This site does not store any files on our server, we only linked to
            the media which is hosted on 3rd party services.
          </p>
          <p className="text-xs text-white/40">
            © {new Date().getFullYear()} Kakureta. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
