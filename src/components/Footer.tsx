'use client'

import { useAuth } from '@/contexts/AuthContext'

export default function Footer() {
  const { user, signInWithGoogle } = useAuth()

  const handleAuthAction = async () => {
    if (user) {
      // If user is authenticated, redirect to dashboard
      window.location.href = '/dashboard'
    } else {
      // If not authenticated, sign in with Google
      await signInWithGoogle()
    }
  }

  const scrollToFeatures = (e: React.MouseEvent) => {
    e.preventDefault()
    const featuresSection = document.getElementById('features')
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <footer className="w-full px-4 sm:px-6 lg:px-8 py-12 sm:py-16 bg-white border-t border-gray-200">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between space-y-6 sm:space-y-0">
          {/* Logo */}
          <div className="flex-shrink-0">
            <a href="/" className="block">
              <div className="text-lg sm:text-xl font-bold text-gray-900 tracking-wide">
                VortoxAI
              </div>
            </a>
          </div>
          
          {/* Links */}
          <div className="flex items-center space-x-8">
            <button onClick={handleAuthAction} className="text-gray-600 hover:text-gray-900 transition-colors duration-200 text-sm font-medium">
              {user ? 'Access Design Prompts' : 'Design Prompts'}
            </button>
            <button onClick={handleAuthAction} className="text-gray-600 hover:text-gray-900 transition-colors duration-200 text-sm font-medium">
              {user ? 'Access Slideshow Generator' : 'Slideshow Generator'}
            </button>
            <button onClick={scrollToFeatures} className="text-gray-600 hover:text-gray-900 transition-colors duration-200 text-sm font-medium">
              Viral Guides
            </button>
          </div>
          
          {/* Copyright */}
          <div className="text-gray-500 text-xs sm:text-sm">
            © 2025 VortoxAI. All rights reserved.
          </div>
        </div>
        
        {/* Bottom Section */}
        <div className="mt-8 pt-8 border-t border-gray-200 text-center">
          <p className="text-gray-500 text-sm">
            Built with ❤️ for content creators worldwide
          </p>
        </div>
      </div>
    </footer>
  )
} 