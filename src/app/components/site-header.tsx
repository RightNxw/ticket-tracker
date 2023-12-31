"use client"

import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import { Icons } from "@/src/app/components/icons"
import { MainNav } from "@/src/app/components/main-nav"
import { ThemeToggle } from "@/src/app/components/theme-toggle"
import { buttonVariants } from "@/src/app/components/ui/button"
import { siteConfig } from "@/src/app/config/site"

import { SearchBox } from "./search"

export function SiteHeader() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const selectedEventParam = searchParams.get("selectedEvent")
  return (
    <header className="bg-background sticky top-0 z-40 w-full border-b">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <MainNav items={siteConfig.mainNav} />
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-1">
            {pathname === "/" && (
              <SearchBox defaultValue={selectedEventParam} />
            )}
            <Link
              href={siteConfig.links.github}
              target="_blank"
              rel="noreferrer"
            >
              <div
                className={buttonVariants({
                  size: "icon",
                  variant: "ghost",
                })}
              >
                <Icons.gitHub className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </div>
            </Link>
            <Link
              href={siteConfig.links.twitter}
              target="_blank"
              rel="noreferrer"
            >
              <div
                className={buttonVariants({
                  size: "icon",
                  variant: "ghost",
                })}
              >
                <Icons.twitter className="h-5 w-5 fill-current" />
                <span className="sr-only">Twitter</span>
              </div>
            </Link>
            <ThemeToggle />
          </nav>
        </div>
      </div>
    </header>
  )
}
