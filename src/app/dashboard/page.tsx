'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { signOut } from '@/lib/supabase'

export default function Dashboard() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [userName, setUserName] = useState('')
  const [activeSection, setActiveSection] = useState('home')
  const [showProfileDropdown, setShowProfileDropdown] = useState(false)
  const [flippedCards, setFlippedCards] = useState(new Set())
  const [billingPeriod, setBillingPeriod] = useState('monthly') // 'weekly' or 'monthly'

  useEffect(() => {
    // Add custom CSS for 3D flip animation
    const style = document.createElement('style')
    style.textContent = `
      .perspective-1000 {
        perspective: 1000px;
      }
      .transform-style-preserve-3d {
        transform-style: preserve-3d;
      }
      .backface-hidden {
        backface-visibility: hidden;
      }
      .rotate-y-180 {
        transform: rotateY(180deg);
      }
    `
    document.head.appendChild(style)
    
    return () => {
      document.head.removeChild(style)
    }
  }, [])

  useEffect(() => {
    if (!loading && !user) {
      router.push('/')
    }
    if (user) {
      // Use the user's actual name from Google account, fallback to email extraction
      const fullName = user.user_metadata?.full_name || user.user_metadata?.name
      if (fullName) {
        setUserName(fullName)
      } else {
        // Fallback to extracting name from email
        const name = user.email?.split('@')[0] || 'Creator'
        setUserName(name.charAt(0).toUpperCase() + name.slice(1))
      }
    }
  }, [user, loading, router])

  const handleSignOut = async () => {
    try {
      await signOut()
      router.push('/')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const handleCardFlip = (cardId: string) => {
    setFlippedCards(prev => {
      const newSet = new Set(prev)
      if (newSet.has(cardId)) {
        newSet.delete(cardId)
      } else {
        newSet.add(cardId)
      }
      return newSet
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Sidebar */}
      <div className="w-64 bg-white shadow-lg flex flex-col">
        {/* Logo Section */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{stopColor:'#3b82f6', stopOpacity:1}} />
                    <stop offset="100%" style={{stopColor:'#8b5cf6', stopOpacity:1}} />
                  </linearGradient>
                  <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="1" stdDeviation="1" floodColor="#000000" floodOpacity="0.2"/>
                  </filter>
                </defs>
                <rect width="32" height="32" rx="8" fill="url(#logoGradient)" filter="url(#shadow)"/>
                <text x="16" y="23" fontFamily="system-ui, -apple-system, sans-serif" fontSize="20" fontWeight="800" textAnchor="middle" fill="white" style={{textShadow: '0 1px 2px rgba(0,0,0,0.3)'}}>V</text>
              </svg>
            </div>
            <span className="text-xl font-bold text-gray-800">VortoxAI</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 flex flex-col">
          <div className="space-y-2">
            <button
              onClick={() => setActiveSection('home')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 cursor-pointer ${
                activeSection === 'home' 
                  ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span className="font-medium">Home</span>
            </button>

            <button
              onClick={() => setActiveSection('design-prompts')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 cursor-pointer ${
                activeSection === 'design-prompts' 
                  ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              <span className="font-medium">Design Prompts</span>
            </button>

            <button
              onClick={() => setActiveSection('ai-avatar')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 cursor-pointer ${
                activeSection === 'ai-avatar' 
                  ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="font-medium">AI Avatar</span>
            </button>

            <button
              onClick={() => setActiveSection('viral-content')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 cursor-pointer ${
                activeSection === 'viral-content' 
                  ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span className="font-medium">Viral Content Ideas</span>
            </button>

            <button
              onClick={() => setActiveSection('slideshows')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 cursor-pointer ${
                activeSection === 'slideshows' 
                  ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <div className="flex-1 flex items-center justify-between">
                <span className="font-medium">Slideshows</span>
                <span className="text-xs bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded font-medium">
                  Soon
                </span>
              </div>
            </button>

            <div className="border-t border-gray-200 my-4"></div>

            {/* Upgrade Button - Prominent placement */}
            <button
              onClick={() => setActiveSection('pricing')}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
              <span className="font-medium">Upgrade</span>
            </button>
          </div>

          {/* Spacer to push bottom buttons down */}
          <div className="flex-1"></div>

          <div className="space-y-2">
            <button
              onClick={() => setActiveSection('settings')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 cursor-pointer ${
                activeSection === 'settings' 
                  ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="font-medium">Settings</span>
            </button>

            <button
              onClick={() => setActiveSection('support')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 cursor-pointer ${
                activeSection === 'support' 
                  ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-medium">Support</span>
            </button>
          </div>
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3 px-4 py-3 rounded-lg bg-gray-50">
            <div className="w-8 h-8 rounded-full overflow-hidden">
              {user.user_metadata?.avatar_url ? (
                <img 
                  src={user.user_metadata.avatar_url} 
                  alt={userName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    {userName.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-800 text-sm">{userName}</p>
              <p className="text-xs text-gray-500">Free User</p>
            </div>
            <div className="relative group">
              <button
                onClick={handleSignOut}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all duration-200 hover:scale-110 cursor-pointer"
                title="Sign Out"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
              {/* Tooltip */}
              <div className="absolute bottom-full right-0 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                Log out
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  {activeSection === 'home' && 'Dashboard'}
                  {activeSection === 'design-prompts' && 'Design Prompts'}
                  {activeSection === 'ai-avatar' && 'AI Avatar'}
                  {activeSection === 'slideshows' && 'TikTok Slideshows'}
                  {activeSection === 'viral-content' && 'Viral Content Ideas'}
                  {activeSection === 'pricing' && 'Pricing & Plans'}
                  {activeSection === 'settings' && 'Settings'}
                  {activeSection === 'support' && 'Support'}
                </h1>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          {activeSection === 'home' && (
            <div className="max-w-6xl mx-auto">
              {/* Welcome Section */}
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-xl">V</span>
                </div>
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Welcome back, {user?.user_metadata?.full_name || 'User'}!</h2>
                <p className="text-gray-600">Ready to create some viral content?</p>
              </div>

              {/* Quick Actions Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div 
                  onClick={() => setActiveSection('design-prompts')}
                  className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
                >
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Design Prompts</h3>
                  <p className="text-gray-600 mb-4">Get AI-powered design ideas</p>
                  <button className="text-blue-600 hover:text-blue-700 font-medium cursor-pointer">Get Started →</button>
                </div>

                <div 
                  onClick={() => setActiveSection('ai-avatar')}
                  className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
                >
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">AI Avatar</h3>
                  <p className="text-gray-600 mb-4">Create realistic AI avatars</p>
                  <button className="text-purple-600 hover:text-purple-700 font-medium cursor-pointer">Create Now →</button>
                </div>

                <div 
                  onClick={() => setActiveSection('viral-content')}
                  className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
                >
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Viral Content Ideas</h3>
                  <p className="text-gray-600 mb-4">Generate trending content ideas</p>
                  <button className="text-green-600 hover:text-green-700 font-medium cursor-pointer">Generate →</button>
                </div>

                <div 
                  onClick={() => setActiveSection('slideshows')}
                  className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow cursor-pointer relative"
                >
                  <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="absolute top-4 right-4">
                    <span className="text-xs bg-pink-100 text-pink-600 px-2 py-1 rounded-full font-medium">Coming Soon</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">TikTok Slideshows</h3>
                  <p className="text-gray-600 mb-4">Create viral slideshows</p>
                  <button className="text-pink-600 hover:text-pink-700 font-medium cursor-pointer">Learn More →</button>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'design-prompts' && (
            <div className="max-w-6xl mx-auto">
              {/* Header */}
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Design Prompts Library</h2>
                <p className="text-gray-600">Browse our collection of AI-generated design prompts organized by category</p>
              </div>

              {/* Filter Tags */}
              <div className="flex flex-wrap gap-3 mb-8 justify-center">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition-colors cursor-pointer">
                  All
                </button>
                <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-full font-medium hover:bg-gray-300 transition-colors cursor-pointer">
                  Fashion
                </button>
                <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-full font-medium hover:bg-gray-300 transition-colors cursor-pointer">
                  Athletics
                </button>
                <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-full font-medium hover:bg-gray-300 transition-colors cursor-pointer">
                  Luxury
                </button>
                <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-full font-medium hover:bg-gray-300 transition-colors cursor-pointer">
                  Technology
                </button>
                <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-full font-medium hover:bg-gray-300 transition-colors cursor-pointer">
                  Food & Drink
                </button>
                <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-full font-medium hover:bg-gray-300 transition-colors cursor-pointer">
                  Travel
                </button>
                <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-full font-medium hover:bg-gray-300 transition-colors cursor-pointer">
                  Lifestyle
                </button>
              </div>

              {/* Prompts Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Fashion Prompt 1 */}
                <div className="h-80 perspective-1000">
                  <div 
                    className={`relative w-full h-full transition-transform duration-700 transform-style-preserve-3d cursor-pointer ${
                      flippedCards.has('fashion-1') ? 'rotate-y-180' : ''
                    }`}
                    onClick={() => handleCardFlip('fashion-1')}
                  >
                    {/* Front of card - Image only */}
                    <div className="absolute inset-0 w-full h-full backface-hidden">
                      <div className="bg-white rounded-2xl shadow-lg overflow-hidden h-full hover:shadow-xl transition-shadow">
                        <div className="h-full relative">
                          <img 
                            src="/designs/1.png" 
                            alt="Fashion Design" 
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute bottom-4 left-4">
                            <span className="inline-block bg-pink-100 text-pink-800 text-xs px-2 py-1 rounded-full font-medium">Fashion</span>
                          </div>
                          <div className="absolute bottom-4 right-4">
                            <span className="text-white text-xs font-medium bg-black/20 px-2 py-1 rounded">Prompt</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Back of card - Prompt text */}
                    <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180">
                      <div className="bg-white rounded-2xl shadow-lg overflow-hidden h-full hover:shadow-xl transition-shadow">
                        <div className="h-full p-6 flex flex-col justify-between">
                          <div>
                            <div className="flex items-center justify-between mb-4">
                              <span className="inline-block bg-pink-100 text-pink-800 text-xs px-2 py-1 rounded-full font-medium">Fashion</span>
                              <button className="text-gray-400 hover:text-gray-600 transition-colors">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                              </button>
                            </div>
                            <p className="text-gray-700 text-sm leading-relaxed">
                              "A minimalist fashion photoshoot featuring a model in elegant streetwear, soft natural lighting, urban background with modern architecture"
                            </p>
                          </div>
                          <div className="text-center mt-4">
                            <p className="text-xs text-gray-500">Click to flip back</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Athletics Prompt 1 */}
                <div className="h-80 perspective-1000">
                  <div 
                    className={`relative w-full h-full transition-transform duration-700 transform-style-preserve-3d cursor-pointer ${
                      flippedCards.has('athletics-1') ? 'rotate-y-180' : ''
                    }`}
                    onClick={() => handleCardFlip('athletics-1')}
                  >
                    {/* Front of card - Image only */}
                    <div className="absolute inset-0 w-full h-full backface-hidden">
                      <div className="bg-white rounded-2xl shadow-lg overflow-hidden h-full hover:shadow-xl transition-shadow">
                        <div className="h-full relative">
                          <img 
                            src="/designs/2.png" 
                            alt="Athletics Design" 
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute bottom-4 left-4">
                            <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium">Athletics</span>
                          </div>
                          <div className="absolute bottom-4 right-4">
                            <span className="text-white text-xs font-medium bg-black/20 px-2 py-1 rounded">Prompt</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Back of card - Prompt text */}
                    <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180">
                      <div className="bg-white rounded-2xl shadow-lg overflow-hidden h-full hover:shadow-xl transition-shadow">
                        <div className="h-full p-6 flex flex-col justify-between">
                          <div>
                            <div className="flex items-center justify-between mb-4">
                              <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium">Athletics</span>
                              <button className="text-gray-400 hover:text-gray-600 transition-colors">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                              </button>
                            </div>
                            <p className="text-gray-700 text-sm leading-relaxed">
                              "Dynamic fitness photography showing an athlete in motion, high-energy workout scene, dramatic lighting, gym environment with modern equipment"
                            </p>
                          </div>
                          <div className="text-center mt-4">
                            <p className="text-xs text-gray-500">Click to flip back</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Luxury Prompt 1 */}
                <div className="h-80 perspective-1000">
                  <div 
                    className={`relative w-full h-full transition-transform duration-700 transform-style-preserve-3d cursor-pointer ${
                      flippedCards.has('luxury-1') ? 'rotate-y-180' : ''
                    }`}
                    onClick={() => handleCardFlip('luxury-1')}
                  >
                    {/* Front of card - Image only */}
                    <div className="absolute inset-0 w-full h-full backface-hidden">
                      <div className="bg-white rounded-2xl shadow-lg overflow-hidden h-full hover:shadow-xl transition-shadow">
                        <div className="h-full relative">
                          <img 
                            src="/designs/3.png" 
                            alt="Luxury Design" 
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute bottom-4 left-4">
                            <span className="inline-block bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full font-medium">Luxury</span>
                          </div>
                          <div className="absolute bottom-4 right-4">
                            <span className="text-white text-xs font-medium bg-black/20 px-2 py-1 rounded">Prompt</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Back of card - Prompt text */}
                    <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180">
                      <div className="bg-white rounded-2xl shadow-lg overflow-hidden h-full hover:shadow-xl transition-shadow">
                        <div className="h-full p-6 flex flex-col justify-between">
                          <div>
                            <div className="flex items-center justify-between mb-4">
                              <span className="inline-block bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full font-medium">Luxury</span>
                              <button className="text-gray-400 hover:text-gray-600 transition-colors">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                              </button>
                            </div>
                            <p className="text-gray-700 text-sm leading-relaxed">
                              "Elegant luxury product photography, premium watch on marble surface, golden hour lighting, sophisticated composition with rich textures"
                            </p>
                          </div>
                          <div className="text-center mt-4">
                            <p className="text-xs text-gray-500">Click to flip back</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Technology Prompt 1 */}
                <div className="h-80 perspective-1000">
                  <div 
                    className={`relative w-full h-full transition-transform duration-700 transform-style-preserve-3d cursor-pointer ${
                      flippedCards.has('technology-1') ? 'rotate-y-180' : ''
                    }`}
                    onClick={() => handleCardFlip('technology-1')}
                  >
                    {/* Front of card - Image only */}
                    <div className="absolute inset-0 w-full h-full backface-hidden">
                      <div className="bg-white rounded-2xl shadow-lg overflow-hidden h-full hover:shadow-xl transition-shadow">
                        <div className="h-full relative">
                          <img 
                            src="/designs/4.png" 
                            alt="Technology Design" 
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute bottom-4 left-4">
                            <span className="inline-block bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full font-medium">Technology</span>
                          </div>
                          <div className="absolute bottom-4 right-4">
                            <span className="text-white text-xs font-medium bg-black/20 px-2 py-1 rounded">Prompt</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Back of card - Prompt text */}
                    <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180">
                      <div className="bg-white rounded-2xl shadow-lg overflow-hidden h-full hover:shadow-xl transition-shadow">
                        <div className="h-full p-6 flex flex-col justify-between">
                          <div>
                            <div className="flex items-center justify-between mb-4">
                              <span className="inline-block bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full font-medium">Technology</span>
                              <button className="text-gray-400 hover:text-gray-600 transition-colors">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                              </button>
                            </div>
                            <p className="text-gray-700 text-sm leading-relaxed">
                              "Futuristic tech product showcase, sleek smartphone with holographic interface, neon lighting, dark background with digital elements"
                            </p>
                          </div>
                          <div className="text-center mt-4">
                            <p className="text-xs text-gray-500">Click to flip back</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Food & Drink Prompt 1 */}
                <div className="h-80 perspective-1000">
                  <div 
                    className={`relative w-full h-full transition-transform duration-700 transform-style-preserve-3d cursor-pointer ${
                      flippedCards.has('food-1') ? 'rotate-y-180' : ''
                    }`}
                    onClick={() => handleCardFlip('food-1')}
                  >
                    {/* Front of card - Image only */}
                    <div className="absolute inset-0 w-full h-full backface-hidden">
                      <div className="bg-white rounded-2xl shadow-lg overflow-hidden h-full hover:shadow-xl transition-shadow">
                        <div className="h-full relative">
                          <img 
                            src="/designs/5.png" 
                            alt="Food & Drink Design" 
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute bottom-4 left-4">
                            <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">Food & Drink</span>
                          </div>
                          <div className="absolute bottom-4 right-4">
                            <span className="text-white text-xs font-medium bg-black/20 px-2 py-1 rounded">Prompt</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Back of card - Prompt text */}
                    <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180">
                      <div className="bg-white rounded-2xl shadow-lg overflow-hidden h-full hover:shadow-xl transition-shadow">
                        <div className="h-full p-6 flex flex-col justify-between">
                          <div>
                            <div className="flex items-center justify-between mb-4">
                              <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">Food & Drink</span>
                              <button className="text-gray-400 hover:text-gray-600 transition-colors">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                              </button>
                            </div>
                            <p className="text-gray-700 text-sm leading-relaxed">
                              "Artisanal coffee photography, steaming cup with latte art, warm wooden table, natural morning light, cozy café atmosphere"
                            </p>
                          </div>
                          <div className="text-center mt-4">
                            <p className="text-xs text-gray-500">Click to flip back</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Travel Prompt 1 */}
                <div className="h-80 perspective-1000">
                  <div 
                    className={`relative w-full h-full transition-transform duration-700 transform-style-preserve-3d cursor-pointer ${
                      flippedCards.has('travel-1') ? 'rotate-y-180' : ''
                    }`}
                    onClick={() => handleCardFlip('travel-1')}
                  >
                    {/* Front of card - Image only */}
                    <div className="absolute inset-0 w-full h-full backface-hidden">
                      <div className="bg-white rounded-2xl shadow-lg overflow-hidden h-full hover:shadow-xl transition-shadow">
                        <div className="h-full relative">
                          <img 
                            src="/designs/6.png" 
                            alt="Travel Design" 
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute bottom-4 left-4">
                            <span className="inline-block bg-teal-100 text-teal-800 text-xs px-2 py-1 rounded-full font-medium">Travel</span>
                          </div>
                          <div className="absolute bottom-4 right-4">
                            <span className="text-white text-xs font-medium bg-black/20 px-2 py-1 rounded">Prompt</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Back of card - Prompt text */}
                    <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180">
                      <div className="bg-white rounded-2xl shadow-lg overflow-hidden h-full hover:shadow-xl transition-shadow">
                        <div className="h-full p-6 flex flex-col justify-between">
                          <div>
                            <div className="flex items-center justify-between mb-4">
                              <span className="inline-block bg-teal-100 text-teal-800 text-xs px-2 py-1 rounded-full font-medium">Travel</span>
                              <button className="text-gray-400 hover:text-gray-600 transition-colors">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                              </button>
                            </div>
                            <p className="text-gray-700 text-sm leading-relaxed">
                              "Breathtaking landscape photography, mountain vista at sunset, dramatic clouds, adventurous traveler silhouette, inspiring wanderlust mood"
                            </p>
                          </div>
                          <div className="text-center mt-4">
                            <p className="text-xs text-gray-500">Click to flip back</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Lifestyle Prompt 1 */}
                <div className="h-80 perspective-1000">
                  <div 
                    className={`relative w-full h-full transition-transform duration-700 transform-style-preserve-3d cursor-pointer ${
                      flippedCards.has('lifestyle-1') ? 'rotate-y-180' : ''
                    }`}
                    onClick={() => handleCardFlip('lifestyle-1')}
                  >
                    {/* Front of card - Image only */}
                    <div className="absolute inset-0 w-full h-full backface-hidden">
                      <div className="bg-white rounded-2xl shadow-lg overflow-hidden h-full hover:shadow-xl transition-shadow">
                        <div className="h-full relative">
                          <img 
                            src="/designs/7.png" 
                            alt="Lifestyle Design" 
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute bottom-4 left-4">
                            <span className="inline-block bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full font-medium">Lifestyle</span>
                          </div>
                          <div className="absolute bottom-4 right-4">
                            <span className="text-white text-xs font-medium bg-black/20 px-2 py-1 rounded">Prompt</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Back of card - Prompt text */}
                    <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180">
                      <div className="bg-white rounded-2xl shadow-lg overflow-hidden h-full hover:shadow-xl transition-shadow">
                        <div className="h-full p-6 flex flex-col justify-between">
                          <div>
                            <div className="flex items-center justify-between mb-4">
                              <span className="inline-block bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full font-medium">Lifestyle</span>
                              <button className="text-gray-400 hover:text-gray-600 transition-colors">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                              </button>
                            </div>
                            <p className="text-gray-700 text-sm leading-relaxed">
                              "Modern lifestyle photography, minimalist home decor, natural textures, soft ambient lighting, Instagram-worthy aesthetic"
                            </p>
                          </div>
                          <div className="text-center mt-4">
                            <p className="text-xs text-gray-500">Click to flip back</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Load More Button */}
              <div className="text-center mt-8">
                <button 
                  onClick={() => setActiveSection('pricing')}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 cursor-pointer"
                >
                  Load More Prompts
                </button>
              </div>
            </div>
          )}

          {activeSection === 'ai-avatar' && (
            <div className="max-w-6xl mx-auto">
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">AI Avatar Generator</h2>
                  <p className="text-gray-600 mb-6">Create realistic AI avatars for your content with advanced AI technology</p>
                </div>

                {/* Avatar Selection Tabs */}
                <div className="flex justify-center mb-8">
                  <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
                    <button className="flex-1 py-2 px-6 text-sm font-medium text-gray-900 bg-white rounded-md shadow-sm">
                      Pre-made Avatars
                    </button>
                    <button className="flex-1 py-2 px-6 text-sm font-medium text-gray-500 hover:text-gray-700">
                      Generate Custom
                    </button>
                  </div>
                </div>

                {/* Pre-made Avatars Gallery */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Choose from our collection</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {/* Avatar 1 */}
                    <div className="relative group cursor-pointer">
                      <div className="aspect-square bg-gradient-to-br from-blue-400 to-purple-600 rounded-xl overflow-hidden">
                        <img 
                          src="/avatars/avatar-1.jpg" 
                          alt="AI Avatar 1" 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
                            if (nextElement) {
                              nextElement.style.display = 'flex';
                            }
                          }}
                        />
                        <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center" style={{display: 'none'}}>
                          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                      </div>
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded-xl flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <button className="bg-white text-gray-800 px-3 py-1 rounded-full text-sm font-medium shadow-lg">
                            Select
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Avatar 2 */}
                    <div className="relative group cursor-pointer">
                      <div className="aspect-square bg-gradient-to-br from-pink-400 to-red-600 rounded-xl overflow-hidden">
                        <img 
                          src="/avatars/avatar-2.jpg" 
                          alt="AI Avatar 2" 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
                            if (nextElement) {
                              nextElement.style.display = 'flex';
                            }
                          }}
                        />
                        <div className="w-full h-full bg-gradient-to-br from-pink-400 to-red-600 flex items-center justify-center" style={{display: 'none'}}>
                          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                      </div>
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded-xl flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <button className="bg-white text-gray-800 px-3 py-1 rounded-full text-sm font-medium shadow-lg">
                            Select
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Avatar 3 */}
                    <div className="relative group cursor-pointer">
                      <div className="aspect-square bg-gradient-to-br from-green-400 to-teal-600 rounded-xl overflow-hidden">
                        <img 
                          src="/avatars/avatar-3.jpg" 
                          alt="AI Avatar 3" 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
                            if (nextElement) {
                              nextElement.style.display = 'flex';
                            }
                          }}
                        />
                        <div className="w-full h-full bg-gradient-to-br from-green-400 to-teal-600 flex items-center justify-center" style={{display: 'none'}}>
                          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                      </div>
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded-xl flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <button className="bg-white text-gray-800 px-3 py-1 rounded-full text-sm font-medium shadow-lg">
                            Select
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Avatar 4 */}
                    <div className="relative group cursor-pointer">
                      <div className="aspect-square bg-gradient-to-br from-yellow-400 to-orange-600 rounded-xl overflow-hidden">
                        <img 
                          src="/avatars/avatar-4.jpg" 
                          alt="AI Avatar 4" 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
                            if (nextElement) {
                              nextElement.style.display = 'flex';
                            }
                          }}
                        />
                        <div className="w-full h-full bg-gradient-to-br from-yellow-400 to-orange-600 flex items-center justify-center" style={{display: 'none'}}>
                          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                      </div>
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded-xl flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <button className="bg-white text-gray-800 px-3 py-1 rounded-full text-sm font-medium shadow-lg">
                            Select
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Avatar 5 */}
                    <div className="relative group cursor-pointer">
                      <div className="aspect-square bg-gradient-to-br from-indigo-400 to-purple-600 rounded-xl overflow-hidden">
                        <img 
                          src="/avatars/avatar-5.jpg" 
                          alt="AI Avatar 5" 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
                            if (nextElement) {
                              nextElement.style.display = 'flex';
                            }
                          }}
                        />
                        <div className="w-full h-full bg-gradient-to-br from-indigo-400 to-purple-600 flex items-center justify-center" style={{display: 'none'}}>
                          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                      </div>
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded-xl flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <button className="bg-white text-gray-800 px-3 py-1 rounded-full text-sm font-medium shadow-lg">
                            Select
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Avatar 6 */}
                    <div className="relative group cursor-pointer">
                      <div className="aspect-square bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl overflow-hidden">
                        <img 
                          src="/avatars/avatar-6.jpg" 
                          alt="AI Avatar 6" 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
                            if (nextElement) {
                              nextElement.style.display = 'flex';
                            }
                          }}
                        />
                        <div className="w-full h-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center" style={{display: 'none'}}>
                          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                      </div>
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded-xl flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <button className="bg-white text-gray-800 px-3 py-1 rounded-full text-sm font-medium shadow-lg">
                            Select
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Generate Custom Avatar Section */}
                <div className="border-t border-gray-200 pt-8">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Or generate your own</h3>
                  <div className="bg-gray-50 rounded-xl p-6">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800">Custom Avatar Generator</h4>
                        <p className="text-sm text-gray-600">Create a unique AI avatar based on your preferences</p>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Avatar Style</label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                          <option>Professional</option>
                          <option>Casual</option>
                          <option>Creative</option>
                          <option>Minimalist</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                        <textarea 
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                          rows={3}
                          placeholder="Describe your ideal avatar... (e.g., young professional, friendly smile, modern clothing)"
                        />
                      </div>
                      
                      <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-200">
                        Generate Avatar
                      </button>
                    </div>
                  </div>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2 text-center">Custom Avatars</h3>
                    <p className="text-gray-600 text-sm text-center">Generate unique AI avatars tailored to your brand and style preferences</p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2 text-center">Video Ready</h3>
                    <p className="text-gray-600 text-sm text-center">Create avatars optimized for video content and social media platforms</p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-6">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2 text-center">Instant Generation</h3>
                    <p className="text-gray-600 text-sm text-center">Get high-quality avatars in seconds with our advanced AI technology</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'slideshows' && (
            <div className="max-w-6xl mx-auto">
              <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-pink-100 to-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">TikTok Slideshow Creator</h2>
                <p className="text-gray-600 mb-8">Create viral TikTok slideshows with AI-powered content generation</p>
                
                {/* Features Preview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-gradient-to-br from-pink-50 to-orange-50 rounded-xl p-6">
                    <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">AI Content Generation</h3>
                    <p className="text-gray-600 text-sm">Generate engaging slideshow content with AI prompts and templates</p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Visual Templates</h3>
                    <p className="text-gray-600 text-sm">Choose from multiple slideshow types and visual styles</p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-xl p-6">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Mobile Optimized</h3>
                    <p className="text-gray-600 text-sm">Perfect for TikTok's mobile-first vertical format</p>
                  </div>
                </div>

                {/* Coming Soon Badge */}
                <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-pink-100 to-orange-100 rounded-full mb-6">
                  <svg className="w-4 h-4 text-pink-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-pink-700 font-medium text-sm">Coming Soon</span>
                </div>
                
                <button className="bg-gradient-to-r from-pink-600 to-orange-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-pink-700 hover:to-orange-700 transition-all duration-200 cursor-pointer opacity-75">
                  Get Early Access
                </button>
                
                <p className="text-gray-500 text-sm mt-4">Be the first to create viral TikTok slideshows when this feature launches</p>
              </div>
            </div>
          )}

          {activeSection === 'viral-content' && (
            <div className="max-w-6xl mx-auto">
              {/* Header */}
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Viral Content Ideas</h2>
                <p className="text-gray-600">Generate trending content ideas and strategies to boost your social media presence</p>
              </div>

              {/* Content Generator */}
              <div className="bg-white rounded-2xl p-8 shadow-lg mb-8">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">AI Content Idea Generator</h3>
                    <p className="text-gray-600">Generate viral content ideas tailored to your niche</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Content Niche</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                      <option>Lifestyle & Wellness</option>
                      <option>Business & Entrepreneurship</option>
                      <option>Technology & Innovation</option>
                      <option>Fashion & Beauty</option>
                      <option>Food & Cooking</option>
                      <option>Travel & Adventure</option>
                      <option>Fitness & Health</option>
                      <option>Entertainment & Pop Culture</option>
                      <option>Education & Learning</option>
                      <option>DIY & Crafts</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Platform</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                      <option>TikTok</option>
                      <option>Instagram Reels</option>
                      <option>YouTube Shorts</option>
                      <option>Instagram Posts</option>
                      <option>Twitter/X</option>
                      <option>LinkedIn</option>
                      <option>All Platforms</option>
                    </select>
                  </div>
                </div>

                <div className="mt-6">
                  <button className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white py-3 rounded-lg font-semibold hover:from-green-700 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg">
                    Generate Viral Ideas
                  </button>
                </div>
              </div>

              {/* Trending Topics */}
              <div className="bg-white rounded-2xl p-8 shadow-lg mb-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-6">🔥 Trending Topics This Week</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-lg p-4 border border-red-200">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-red-600 font-bold">#1</span>
                      <span className="text-sm text-red-600 font-medium">Trending</span>
                    </div>
                    <h4 className="font-semibold text-gray-800 mb-1">AI Productivity Hacks</h4>
                    <p className="text-sm text-gray-600">Show how AI tools save time in daily tasks</p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg p-4 border border-orange-200">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-orange-600 font-bold">#2</span>
                      <span className="text-sm text-orange-600 font-medium">Hot</span>
                    </div>
                    <h4 className="font-semibold text-gray-800 mb-1">Micro-Habits That Changed My Life</h4>
                    <p className="text-sm text-gray-600">Small daily changes with big impact</p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-lg p-4 border border-green-200">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-green-600 font-bold">#3</span>
                      <span className="text-sm text-green-600 font-medium">Rising</span>
                    </div>
                    <h4 className="font-semibold text-gray-800 mb-1">Budget-Friendly Home Upgrades</h4>
                    <p className="text-sm text-gray-600">Transform your space without breaking the bank</p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-blue-600 font-bold">#4</span>
                      <span className="text-sm text-blue-600 font-medium">Viral</span>
                    </div>
                    <h4 className="font-semibold text-gray-800 mb-1">Things I Wish I Knew at 20</h4>
                    <p className="text-sm text-gray-600">Life lessons and wisdom sharing</p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-200">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-purple-600 font-bold">#5</span>
                      <span className="text-sm text-purple-600 font-medium">Growing</span>
                    </div>
                    <h4 className="font-semibold text-gray-800 mb-1">Side Hustle Success Stories</h4>
                    <p className="text-sm text-gray-600">Real people making extra income</p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-gray-600 font-bold">#6</span>
                      <span className="text-sm text-gray-600 font-medium">Steady</span>
                    </div>
                    <h4 className="font-semibold text-gray-800 mb-1">Sustainable Living Tips</h4>
                    <p className="text-sm text-gray-600">Easy ways to live more eco-friendly</p>
                  </div>
                </div>
              </div>

              {/* Content Types */}
              <div className="bg-white rounded-2xl p-8 shadow-lg mb-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-6">📱 High-Performing Content Types</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-blue-600 font-bold text-sm">1</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-1">Before & After Transformations</h4>
                        <p className="text-sm text-gray-600">Show dramatic changes in any area - room makeovers, fitness journeys, skill development</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-green-600 font-bold text-sm">2</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-1">Quick Tips & Hacks</h4>
                        <p className="text-sm text-gray-600">"3 ways to...", "5 secrets to...", "The hack that changed everything"</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-purple-600 font-bold text-sm">3</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-1">Behind the Scenes</h4>
                        <p className="text-sm text-gray-600">Show your process, daily routine, or how you create content</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                      <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-orange-600 font-bold text-sm">4</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-1">Myth Busting</h4>
                        <p className="text-sm text-gray-600">"Actually, that's not true..." - correct common misconceptions in your niche</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                      <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-pink-600 font-bold text-sm">5</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-1">Relatable Struggles</h4>
                        <p className="text-sm text-gray-600">"POV: When you...", "Things that just make sense", "We've all been there"</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                      <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-teal-600 font-bold text-sm">6</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-1">Trend Participation</h4>
                        <p className="text-sm text-gray-600">Put your own spin on trending sounds, challenges, or formats</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-6 border border-green-200">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Content Calendar</h3>
                  <p className="text-gray-600 mb-4">Plan your viral content strategy with our AI-powered calendar</p>
                  <button className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-green-700 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg">
                    Create Calendar
                  </button>
                </div>
                
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 4v10a2 2 0 002 2h6a2 2 0 002-2V8M7 8h10M9 12h6m-6 4h6" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Trend Tracker</h3>
                  <p className="text-gray-600 mb-4">Stay ahead of the curve with real-time trend analysis</p>
                  <button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-md hover:shadow-lg">
                    Track Trends
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'pricing' && (
            <div className="max-w-6xl mx-auto">
              {/* Pricing Header */}
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Choose Your Plan</h2>
                <p className="text-gray-600 text-lg mb-6">Select the perfect plan to supercharge your content creation</p>
                
                {/* Billing Toggle */}
                <div className="flex items-center justify-center mb-6">
                  <div className="bg-white rounded-full p-1 flex items-center border border-gray-200 shadow-sm">
                    <button
                      onClick={() => setBillingPeriod('weekly')}
                      className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                        billingPeriod === 'weekly' 
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md' 
                          : 'text-gray-600 hover:text-gray-800'
                      }`}
                    >
                      Weekly billing
                    </button>
                    <button
                      onClick={() => setBillingPeriod('monthly')}
                      className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
                        billingPeriod === 'monthly' 
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md' 
                          : 'text-gray-600 hover:text-gray-800'
                      }`}
                    >
                      <span>Monthly billing</span>
                      <span className="bg-white text-blue-600 text-xs px-2 py-1 rounded-full font-semibold">-30%</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Pricing Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Starter Plan */}
                <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Starter</h3>
                    <div className="mb-4">
                      <span className="text-4xl font-bold text-gray-800">
                        ${billingPeriod === 'weekly' ? '7' : '19'}
                      </span>
                      <span className="text-gray-600 ml-2">per {billingPeriod === 'weekly' ? 'week' : 'month'}</span>
                      {billingPeriod === 'monthly' && (
                        <div className="text-sm text-gray-500 mt-1">
                          <span className="line-through">$28</span> <span className="text-green-600 font-medium">Save 30%</span>
                        </div>
                      )}
                    </div>
                    <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg cursor-pointer">
                      Buy Now
                    </button>
                  </div>
                  <ul className="space-y-3">
                    <li className="flex items-start space-x-3">
                      <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">Access to all design prompts</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">New prompts added weekly</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">Browse by category (Fashion, Tech, Travel, etc.)</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">Copy prompts for your projects</span>
                    </li>
                  </ul>
                </div>

                {/* Growth Plan */}
                <div className="bg-white rounded-2xl p-6 border-2 border-blue-500 relative shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-medium shadow-md">Most Popular</span>
                  </div>
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Growth</h3>
                    <div className="mb-4">
                      <span className="text-4xl font-bold text-gray-800">
                        ${billingPeriod === 'weekly' ? '17' : '49'}
                      </span>
                      <span className="text-gray-600 ml-2">per {billingPeriod === 'weekly' ? 'week' : 'month'}</span>
                      {billingPeriod === 'monthly' && (
                        <div className="text-sm text-gray-500 mt-1">
                          <span className="line-through">$68</span> <span className="text-green-600 font-medium">Save 30%</span>
                        </div>
                      )}
                    </div>
                    <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg cursor-pointer">
                      Buy Now
                    </button>
                  </div>
                  <ul className="space-y-3">
                    <li className="flex items-start space-x-3">
                      <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">Everything in Starter, plus...</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">50 TikTok slideshows per month</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">AI slideshow generator access</span>
                    </li>
                  </ul>
                </div>

                {/* Scale Plan */}
                <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Scale</h3>
                    <div className="mb-4">
                      <span className="text-4xl font-bold text-gray-800">
                        ${billingPeriod === 'weekly' ? '33' : '95'}
                      </span>
                      <span className="text-gray-600 ml-2">per {billingPeriod === 'weekly' ? 'week' : 'month'}</span>
                      {billingPeriod === 'monthly' && (
                        <div className="text-sm text-gray-500 mt-1">
                          <span className="line-through">$132</span> <span className="text-green-600 font-medium">Save 30%</span>
                        </div>
                      )}
                    </div>
                    <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg cursor-pointer">
                      Buy Now
                    </button>
                  </div>
                  <ul className="space-y-3">
                    <li className="flex items-start space-x-3">
                      <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">Everything in Growth, plus...</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">150 TikTok slideshows per month</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">Priority support</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Unlimited Videos Section */}
              <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 mb-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Unlimited Videos</h3>
                    <p className="text-gray-600">If you're looking to do more than {billingPeriod === 'weekly' ? '38+ per week' : '150+ per month'}, I recommend this option.</p>
                  </div>
                  <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg cursor-pointer">
                    Message me
                  </button>
                </div>
              </div>

              {/* FAQ Section */}
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Frequently Asked Questions</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h4 className="font-semibold text-gray-800 mb-2">Can I change my plan anytime?</h4>
                    <p className="text-gray-600 text-sm">Yes! You can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h4 className="font-semibold text-gray-800 mb-2">What payment methods do you accept?</h4>
                    <p className="text-gray-600 text-sm">We accept all major credit cards, PayPal, and bank transfers for annual subscriptions.</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h4 className="font-semibold text-gray-800 mb-2">Is there a free trial?</h4>
                    <p className="text-gray-600 text-sm">Yes! All plans come with a 7-day free trial. No credit card required to start.</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h4 className="font-semibold text-gray-800 mb-2">Can I cancel anytime?</h4>
                    <p className="text-gray-600 text-sm">Absolutely! You can cancel your subscription at any time. You'll continue to have access until the end of your billing period.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'settings' && (
            <div className="max-w-4xl mx-auto">
              <div className="space-y-6">
                {/* Account Settings */}
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                  <h3 className="text-xl font-semibold text-gray-800 mb-6">Account Settings</h3>
                  
                  <div className="space-y-6">
                    {/* Profile Information */}
                    <div>
                      <h4 className="font-medium text-gray-800 mb-3">Profile Information</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                          <input 
                            type="text" 
                            value={userName} 
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            readOnly
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                          <input 
                            type="email" 
                            value={user.email || ''} 
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            readOnly
                          />
                        </div>
                      </div>
                    </div>

                    {/* Account Status */}
                    <div>
                      <h4 className="font-medium text-gray-800 mb-3">Account Status</h4>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-800">Current Plan</p>
                            <p className="text-sm text-gray-600">Free User</p>
                          </div>
                          <button 
                            onClick={() => setActiveSection('pricing')}
                            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 cursor-pointer"
                          >
                            Upgrade Plan
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'support' && (
            <div className="max-w-4xl mx-auto">
              <div className="space-y-6">
                {/* Help Center */}
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                  <h3 className="text-xl font-semibold text-gray-800 mb-6">Help Center</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-medium text-gray-800">Getting Started</h4>
                      <div className="space-y-2">
                        <button className="w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                          <p className="font-medium text-gray-800">How to create your first design prompt</p>
                        </button>
                        <button className="w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                          <p className="font-medium text-gray-800">Setting up your TikTok slideshow</p>
                        </button>
                        <button className="w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                          <p className="font-medium text-gray-800">Understanding viral content strategies</p>
                        </button>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h4 className="font-medium text-gray-800">Account & Billing</h4>
                      <div className="space-y-2">
                        <button className="w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                          <p className="font-medium text-gray-800">How to upgrade your plan</p>
                        </button>
                        <button className="w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                          <p className="font-medium text-gray-800">Managing your subscription</p>
                        </button>
                        <button className="w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                          <p className="font-medium text-gray-800">Billing and payment issues</p>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact Support */}
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                  <h3 className="text-xl font-semibold text-gray-800 mb-6">Contact Support</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="text-center p-6 bg-blue-50 rounded-xl">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <h4 className="font-medium text-gray-800 mb-2">Email Support</h4>
                        <p className="text-sm text-gray-600 mb-4">Get help via email within 24 hours</p>
                        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer">
                          Send Email
                        </button>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="text-center p-6 bg-green-50 rounded-xl">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                        </div>
                        <h4 className="font-medium text-gray-800 mb-2">Live Chat</h4>
                        <p className="text-sm text-gray-600 mb-4">Chat with our support team in real-time</p>
                        <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors cursor-pointer">
                          Start Chat
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* FAQ */}
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                  <h3 className="text-xl font-semibold text-gray-800 mb-6">Frequently Asked Questions</h3>
                  
                  <div className="space-y-4">
                    <div className="border-b border-gray-200 pb-4">
                      <h4 className="font-medium text-gray-800 mb-2">How do I create my first video?</h4>
                      <p className="text-gray-600 text-sm">Start by navigating to the Design Prompts section and clicking "Generate New Prompt". Follow the guided steps to create your first AI-generated video content.</p>
                    </div>
                    
                    <div className="border-b border-gray-200 pb-4">
                      <h4 className="font-medium text-gray-800 mb-2">What's included in the free plan?</h4>
                      <p className="text-gray-600 text-sm">The free plan includes access to basic design prompts and limited video generation. You can create up to 3 videos per month with watermarks.</p>
                    </div>
                    
                    <div className="border-b border-gray-200 pb-4">
                      <h4 className="font-medium text-gray-800 mb-2">Can I cancel my subscription anytime?</h4>
                      <p className="text-gray-600 text-sm">Yes, you can cancel your subscription at any time from your account settings. You'll continue to have access until the end of your current billing period.</p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-800 mb-2">How do I export my videos?</h4>
                      <p className="text-gray-600 text-sm">Once your video is generated, you can export it in various formats (MP4, MOV, AVI) directly from the video editor. Premium users get access to higher quality exports.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
} 