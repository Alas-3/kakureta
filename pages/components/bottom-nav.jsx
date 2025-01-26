"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

export function BottomNav() {
  const pathname = usePathname()

  const links = [
    { href: "/", icon: "🏠", label: "Home" },
    { href: "/search", icon: "🔍", label: "Search" },
    { href: "/bookmarks", icon: "🔖", label: "Bookmarks" },
    { href: "/profile", icon: "👤", label: "Profile" },
  ]

  return (
    <nav className="btm-nav bg-base-300/80 backdrop-blur-md lg:hidden fixed bottom-0 left-0 right-0">
      {links.map(({ href, icon, label }) => (
        <Link key={href} href={href} className={pathname === href ? "active" : ""}>
          <span className="text-xl">{icon}</span>
          <span className="btm-nav-label">{label}</span>
        </Link>
      ))}
    </nav>
  )
}

