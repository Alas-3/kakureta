import { Inter } from "next/font/google"
import "@/styles/globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Anime Streaming App",
  description: "Stream your favorite anime shows",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="oledDark">
      <body className={`${inter.className} min-h-screen bg-background text-foreground`}>{children}</body>
    </html>
  )
}

