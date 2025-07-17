'use client'

import { useState, useEffect, useRef } from 'react'
import { useAuth } from '@/contexts/AuthContext'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const isScrollingRef = useRef(false)
  const { user, loading, signInWithGoogle, signOut } = useAuth()

  const scrollToFeatures = (e: React.MouseEvent) => {
    e.preventDefault()
    isScrollingRef.current = true // Prevent scroll handler interference
    setActiveSection('features') // Immediately set to features when clicked
    const featuresSection = document.getElementById('features')
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' })
      // Reset the flag after scroll animation completes (approximately 1 second)
      setTimeout(() => {
        isScrollingRef.current = false
      }, 1000)
    }
    setIsMenuOpen(false) // Close mobile menu if open
  }

  const scrollToHome = (e: React.MouseEvent) => {
    e.preventDefault()
    isScrollingRef.current = true // Prevent scroll handler interference
    setActiveSection('home') // Immediately set to home when clicked
    window.scrollTo({ top: 0, behavior: 'smooth' })
    // Reset the flag after scroll animation completes (approximately 1 second)
    setTimeout(() => {
      isScrollingRef.current = false
    }, 1000)
    setIsMenuOpen(false)
  }

  const handleAuthAction = async () => {
    if (user) {
      await signOut()
    } else {
      await signInWithGoogle()
    }
    setIsMenuOpen(false)
  }

  useEffect(() => {
    const featuresSection = document.getElementById('features')
    if (!featuresSection) return

    const handleScroll = () => {
      // Don't update active section if we're currently programmatically scrolling
      if (isScrollingRef.current) return

      const scrollY = window.scrollY
      const windowHeight = window.innerHeight
      
      // Get the absolute position of the features section
      const featuresRect = featuresSection.getBoundingClientRect()
      const featuresTopFromViewport = featuresRect.top
      
      // Features section is considered "active" when it's visible in the upper half of the viewport
      // This means when the top of features section is at or above the middle of the screen
      if (featuresTopFromViewport <= windowHeight / 2) {
        console.log('Features section active - top:', featuresTopFromViewport, 'threshold:', windowHeight / 2)
        setActiveSection('features')
      } else {
        console.log('Home section active - top:', featuresTopFromViewport, 'threshold:', windowHeight / 2)
        setActiveSection('home')
      }
    }

    // Initial check after a small delay to ensure page is loaded
    const initialCheck = setTimeout(handleScroll, 200)

    // Add scroll listener
    window.addEventListener('scroll', handleScroll, { passive: true })
    
    // Also listen for resize events
    window.addEventListener('resize', handleScroll, { passive: true })

    return () => {
      clearTimeout(initialCheck)
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
    }
  }, [])

  return (
    <div className="w-full fixed top-0 left-0 right-0 pt-4 px-4 sm:px-6 lg:px-8 z-50">
      <header className="max-w-4xl mx-auto bg-white/95 backdrop-blur-md rounded-full shadow-lg border border-gray-200/50">
        <div className="px-6 sm:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <button 
                onClick={scrollToHome}
                className="text-lg sm:text-xl font-bold text-gray-900 hover:text-blue-600 transition-all duration-200 cursor-pointer hover:scale-105"
              >
                VortoxAI
              </button>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <button 
                onClick={scrollToHome}
                className={`font-medium transition-all duration-200 text-sm cursor-pointer hover:scale-105 px-4 py-2 rounded-full ${
                  activeSection === 'home' 
                    ? 'text-blue-700 bg-blue-100 font-semibold' 
                    : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                }`}
              >
                Home
              </button>
              <button 
                onClick={scrollToFeatures}
                className={`font-medium transition-all duration-200 text-sm cursor-pointer hover:scale-105 px-4 py-2 rounded-full ${
                  activeSection === 'features' 
                    ? 'text-blue-700 bg-blue-100 font-semibold' 
                    : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                }`}
              >
                Features
              </button>
              {user && (
                <a
                  href="/dashboard"
                  className="text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 text-sm font-medium px-4 py-2 rounded-full"
                >
                  Dashboard
                </a>
              )}
            </nav>

            {/* Auth Button */}
            <div className="hidden sm:flex items-center">
              {loading ? (
                <div className="bg-gray-200 animate-pulse px-6 py-2.5 rounded-full text-sm">
                  Loading...
                </div>
              ) : (
                <button
                  onClick={handleAuthAction}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2.5 rounded-full font-medium transition-all duration-200 text-sm shadow-md hover:shadow-lg hover:scale-105"
                >
                  {user ? (
                    <span className="flex items-center space-x-2">
                      <span className="hidden lg:inline">Sign Out</span>
                      <span className="lg:hidden">Out</span>
                    </span>
                  ) : (
                    <span className="flex items-center space-x-2">
                      <span className="hidden lg:inline">Get Started</span>
                      <span className="lg:hidden">Start</span>
                    </span>
                  )}
                </button>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-700 hover:text-gray-900 focus:outline-none focus:text-gray-900 transition-colors duration-200"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {isMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden border-t border-gray-200/50 bg-white/95 backdrop-blur-md rounded-b-3xl mt-2">
              <div className="px-4 pt-3 pb-4 space-y-2">
                <button
                  onClick={scrollToHome}
                  className={`block w-full text-left px-4 py-3 rounded-full font-medium transition-all duration-200 text-sm cursor-pointer hover:scale-105 ${
                    activeSection === 'home' 
                      ? 'text-blue-700 bg-blue-100 font-semibold' 
                      : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  Home
                </button>
                <button
                  onClick={scrollToFeatures}
                  className={`block w-full text-left px-4 py-3 rounded-full font-medium transition-all duration-200 text-sm cursor-pointer hover:scale-105 ${
                    activeSection === 'features' 
                      ? 'text-blue-700 bg-blue-100 font-semibold' 
                      : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  Features
                </button>
                {user && (
                  <a
                    href="/dashboard"
                    className="block w-full text-left px-4 py-3 rounded-full font-medium transition-all duration-200 text-sm text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                  >
                    Dashboard
                  </a>
                )}
                <div className="pt-2">
                  {loading ? (
                    <div className="block w-full text-center bg-gray-200 animate-pulse px-6 py-3 rounded-full text-sm">
                      Loading...
                    </div>
                  ) : (
                    <button
                      onClick={handleAuthAction}
                      className="block w-full text-center bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-full font-medium transition-all duration-200 text-sm shadow-md hover:shadow-lg"
                    >
                      {user ? 'Sign Out' : 'Get Started'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </header>
    </div>
  )
} 