"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/Modetoggle"
import { Menu, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { SignInButton, SignedOut, SignedIn, UserButton } from "@clerk/nextjs"

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex items-end space-x-1">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 font-momo text-4xl lg:text-6xl italic font-extrabold animate-bounce leading-none">
                Q
              </span>
              <p className="text-black dark:text-white text-xl lg:text-3xl font-semibold leading-none">line</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <SignedIn>
            <Link
              href="/queues"
              className="text-gray-700 dark:text-gray-200 hover:text-purple-600 dark:hover:text-purple-400 transition-colors text-sm lg:text-base px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              Browse Queues
            </Link>
              <Link
                href="/my-queue"
                className="text-gray-700 dark:text-gray-200 hover:text-purple-600 dark:hover:text-purple-400 transition-colors text-sm lg:text-base px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                My Queue
              </Link>
              <Link
                href="/admin/create"
                className="text-gray-700 dark:text-gray-200 hover:text-purple-600 dark:hover:text-purple-400 transition-colors text-sm lg:text-base px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                Create Queue
              </Link>
              <Link
                href="/admin/dashboard"
                className="text-gray-700 dark:text-gray-200 hover:text-purple-600 dark:hover:text-purple-400 transition-colors text-sm lg:text-base px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                Dashboard
              </Link>
            </SignedIn>
          </nav>

          <div className="flex items-center space-x-3">
            <div className="hidden md:flex items-center space-x-3">
              <SignedOut>
                <SignInButton mode="modal">
                  <Button variant="outline" size="sm" className="px-4 py-2">
                    Log in
                  </Button>
                </SignInButton>
              </SignedOut>

              <SignedIn>
                <UserButton
                  appearance={{
                    elements: {
                      avatarBox: "h-8 w-8",
                    },
                  }}
                />
              </SignedIn>
            </div>

            <ModeToggle />

            <button
              className="md:hidden p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700"
          >
            <div className="container mx-auto px-4 py-4 space-y-3">
              <SignedIn>
              <Link
                href="/queues"
                className="block py-3 px-3 text-gray-700 dark:text-gray-200 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Browse Queues
              </Link>
                <Link
                  href="/my-queue"
                  className="block py-3 px-3 text-gray-700 dark:text-gray-200 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  My Queue
                </Link>
                <Link
                  href="/admin/create"
                  className="block py-3 px-3 text-gray-700 dark:text-gray-200 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Create Queue
                </Link>
                <Link
                  href="/admin/dashboard"
                  className="block py-3 px-3 text-gray-700 dark:text-gray-200 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
              </SignedIn>

              <div className="pt-3 border-t border-gray-200 dark:border-gray-700 flex flex-col space-y-3">
                <SignedOut>
                  <SignInButton mode="modal">
                    <Button variant="outline" size="sm" className="w-full py-3">
                      Log in
                    </Button>
                  </SignInButton>
                </SignedOut>

                <SignedIn>
                  <div className="flex justify-center py-2">
                    <UserButton
                      appearance={{
                        elements: {
                          avatarBox: "h-8 w-8",
                        },
                      }}
                    />
                  </div>
                </SignedIn>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
