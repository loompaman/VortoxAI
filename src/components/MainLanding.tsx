'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'

export default function MainLanding() {
  const [currentText, setCurrentText] = useState('')
  const { user, loading, signInWithGoogle } = useAuth()

  const handleAuthAction = async () => {
    if (user) {
      // If user is authenticated, redirect to dashboard
      window.location.href = '/dashboard'
    } else {
      // If not authenticated, sign in with Google
      await signInWithGoogle()
    }
  }

  const texts = [
    'designer',
    'marketer',
    'content creator',
    'entrepreneur',
    'brand owner',
    'influencer',
    'freelancer',
    'business owner'
  ]

  useEffect(() => {
    let currentIndex = 0
    let currentChar = 0
    let isDeleting = false
    
    const typeEffect = () => {
      const currentWord = texts[currentIndex]
      
      if (isDeleting) {
        setCurrentText(currentWord.substring(0, currentChar - 1))
        currentChar--
      } else {
        setCurrentText(currentWord.substring(0, currentChar + 1))
        currentChar++
      }
      
      if (!isDeleting && currentChar === currentWord.length) {
        setTimeout(() => {
          isDeleting = true
        }, 2000)
      } else if (isDeleting && currentChar === 0) {
        isDeleting = false
        currentIndex = (currentIndex + 1) % texts.length
      }
    }
    
    const interval = setInterval(typeEffect, isDeleting ? 50 : 100)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="w-full min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.05),rgba(0,0,0,0))]"></div>
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-32 sm:py-40 relative">
        {/* Social Proof Badge */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center px-4 py-2 bg-white rounded-full border border-gray-200 shadow-sm text-gray-700 font-medium text-sm">
            <span className="mr-2">⭐</span>
            Join 1,200+ content creators & brands
          </div>
        </div>

        {/* Main Hero */}
        <div className="text-center mb-16 max-w-5xl mx-auto">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-800 mb-8 leading-tight">
            Create viral content with AI,
            <br />
            as a{' '}
            <span className="text-blue-600 inline-block min-w-[200px] sm:min-w-[250px] lg:min-w-[300px] xl:min-w-[350px] text-left">
              {currentText}
              <span className="animate-pulse">|</span>
            </span>
          </h1>
          
          <p className="text-xl sm:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed">
            Get proven design prompts, automated TikTok slideshows, and viral video guides that help you create content that actually converts and gets millions of views.
          </p>
          
          {/* CTA Buttons */}
          <div className="mb-8 flex flex-col sm:flex-row gap-4 justify-center items-center">
            {/* Get Prompts Button */}
            <button
              onClick={handleAuthAction}
              disabled={loading}
              className="inline-flex items-center justify-center bg-gradient-to-b from-blue-500 to-blue-700 hover:from-blue-400 hover:to-blue-600 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-200 shadow-[0_8px_16px_rgba(59,130,246,0.3),0_4px_8px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.2)] hover:shadow-[0_12px_24px_rgba(59,130,246,0.4),0_6px_12px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.3)] transform hover:scale-105 hover:-translate-y-1 border-t border-blue-300/50 w-full sm:w-auto min-w-[200px] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Loading...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
                  </svg>
                  {user ? 'Access Design Prompts' : 'Get Design Prompts'}
                </>
              )}
            </button>

            {/* Create Viral Content Button */}
            <button
              onClick={handleAuthAction}
              disabled={loading}
              className="inline-flex items-center justify-center bg-white hover:bg-gray-50 text-gray-700 hover:text-gray-800 px-8 py-4 rounded-full font-semibold text-lg transition-all duration-200 shadow-[0_8px_16px_rgba(0,0,0,0.1),0_4px_8px_rgba(0,0,0,0.05),inset_0_1px_0_rgba(255,255,255,0.8)] hover:shadow-[0_12px_24px_rgba(0,0,0,0.15),0_6px_12px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.9)] transform hover:scale-105 hover:-translate-y-1 border border-gray-200 w-full sm:w-auto min-w-[200px] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-700 mr-2"></div>
                  Loading...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd"/>
                  </svg>
                  {user ? 'Create Viral Content' : 'Create Viral Content'}
                </>
              )}
            </button>
          </div>
        </div>

        {/* Design Carousel Section */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">
              Designs that convert
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              See the quality of designs our AI prompts can help you create
            </p>
          </div>

          {/* Carousel Container */}
          <div className="relative overflow-hidden">
            <div className="flex animate-scroll space-x-6">
              {/* Design Card 1 */}
              <div className="flex-shrink-0 w-80 bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
                <div className="aspect-square bg-gradient-to-br from-blue-500 to-purple-600 relative">
                  <img 
                    src="/designs/1.png" 
                    alt="Fashion Collection Design"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      (e.currentTarget.nextElementSibling as HTMLElement)!.style.display = 'flex';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-6xl font-bold hidden">
                    1
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-gray-800 mb-2">Fashion Collection</h3>
                  <p className="text-gray-600 text-sm">Modern fashion brand identity with clean typography</p>
                </div>
              </div>

              {/* Design Card 2 */}
              <div className="flex-shrink-0 w-80 bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
                <div className="aspect-square bg-gradient-to-br from-pink-500 to-red-600 relative">
                  <img 
                    src="/designs/2.png" 
                    alt="Luxury Cosmetics Design"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      (e.currentTarget.nextElementSibling as HTMLElement)!.style.display = 'flex';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-pink-500 to-red-600 flex items-center justify-center text-white text-6xl font-bold hidden">
                    2
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-gray-800 mb-2">Luxury Cosmetics</h3>
                  <p className="text-gray-600 text-sm">Elegant beauty brand with premium aesthetics</p>
                </div>
              </div>

              {/* Design Card 3 */}
              <div className="flex-shrink-0 w-80 bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
                <div className="aspect-square bg-gradient-to-br from-green-500 to-teal-600 relative">
                  <img 
                    src="/designs/3.png" 
                    alt="Athletic Brand Design"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      (e.currentTarget.nextElementSibling as HTMLElement)!.style.display = 'flex';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center text-white text-6xl font-bold hidden">
                    3
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-gray-800 mb-2">Athletic Brand Identity</h3>
                  <p className="text-gray-600 text-sm">Dynamic sports brand with bold energy</p>
                </div>
              </div>

              {/* Design Card 4 */}
              <div className="flex-shrink-0 w-80 bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
                <div className="aspect-square bg-gradient-to-br from-purple-500 to-indigo-600 relative">
                  <img 
                    src="/designs/4.png" 
                    alt="Skincare Packaging Design"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      (e.currentTarget.nextElementSibling as HTMLElement)!.style.display = 'flex';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white text-6xl font-bold hidden">
                    4
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-gray-800 mb-2">Skincare Packaging</h3>
                  <p className="text-gray-600 text-sm">Minimalist wellness brand packaging</p>
                </div>
              </div>

              {/* Design Card 5 */}
              <div className="flex-shrink-0 w-80 bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
                <div className="aspect-square bg-gradient-to-br from-orange-500 to-yellow-600 relative">
                  <img 
                    src="/designs/5.png" 
                    alt="Product Packaging Design"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      (e.currentTarget.nextElementSibling as HTMLElement)!.style.display = 'flex';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-yellow-600 flex items-center justify-center text-white text-6xl font-bold hidden">
                    5
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-gray-800 mb-2">Product Packaging</h3>
                  <p className="text-gray-600 text-sm">Creative packaging with vibrant colors</p>
                </div>
              </div>

              {/* Design Card 6 */}
              <div className="flex-shrink-0 w-80 bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
                <div className="aspect-square bg-gradient-to-br from-cyan-500 to-blue-600 relative">
                  <img 
                    src="/designs/6.png" 
                    alt="Wellness Brand Design"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      (e.currentTarget.nextElementSibling as HTMLElement)!.style.display = 'flex';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white text-6xl font-bold hidden">
                    6
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-gray-800 mb-2">Wellness Brand</h3>
                  <p className="text-gray-600 text-sm">Calming wellness brand with natural tones</p>
                </div>
              </div>

              {/* Design Card 7 */}
              <div className="flex-shrink-0 w-80 bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
                <div className="aspect-square bg-gradient-to-br from-red-500 to-pink-600 relative">
                  <img 
                    src="/designs/7.png" 
                    alt="Food & Beverage Design"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      (e.currentTarget.nextElementSibling as HTMLElement)!.style.display = 'flex';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center text-white text-6xl font-bold hidden">
                    7
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-gray-800 mb-2">Food & Beverage</h3>
                  <p className="text-gray-600 text-sm">Appetizing food brand with warm colors</p>
                </div>
              </div>

              {/* Duplicate cards for seamless loop */}
              <div className="flex-shrink-0 w-80 bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
                <div className="aspect-square bg-gradient-to-br from-blue-500 to-purple-600 relative">
                  <img 
                    src="/designs/1.png" 
                    alt="Fashion Collection Design"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      (e.currentTarget.nextElementSibling as HTMLElement)!.style.display = 'flex';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-6xl font-bold hidden">
                    1
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-gray-800 mb-2">Fashion Collection</h3>
                  <p className="text-gray-600 text-sm">Modern fashion brand identity with clean typography</p>
                </div>
              </div>

              {/* Duplicate Card 2 */}
              <div className="flex-shrink-0 w-80 bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
                <div className="aspect-square bg-gradient-to-br from-pink-500 to-red-600 relative">
                  <img 
                    src="/designs/2.png" 
                    alt="Luxury Cosmetics Design"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      (e.currentTarget.nextElementSibling as HTMLElement)!.style.display = 'flex';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-pink-500 to-red-600 flex items-center justify-center text-white text-6xl font-bold hidden">
                    2
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-gray-800 mb-2">Luxury Cosmetics</h3>
                  <p className="text-gray-600 text-sm">Elegant beauty brand with premium aesthetics</p>
                </div>
              </div>

              {/* Duplicate Card 3 */}
              <div className="flex-shrink-0 w-80 bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
                <div className="aspect-square bg-gradient-to-br from-green-500 to-teal-600 relative">
                  <img 
                    src="/designs/3.png" 
                    alt="Athletic Brand Design"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      (e.currentTarget.nextElementSibling as HTMLElement)!.style.display = 'flex';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center text-white text-6xl font-bold hidden">
                    3
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-gray-800 mb-2">Athletic Brand Identity</h3>
                  <p className="text-gray-600 text-sm">Dynamic sports brand with bold energy</p>
                </div>
              </div>

              {/* Duplicate Card 4 */}
              <div className="flex-shrink-0 w-80 bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
                <div className="aspect-square bg-gradient-to-br from-purple-500 to-indigo-600 relative">
                  <img 
                    src="/designs/4.png" 
                    alt="Skincare Packaging Design"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      (e.currentTarget.nextElementSibling as HTMLElement)!.style.display = 'flex';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white text-6xl font-bold hidden">
                    4
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-gray-800 mb-2">Skincare Packaging</h3>
                  <p className="text-gray-600 text-sm">Minimalist wellness brand packaging</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div id="features" className="mt-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
              Everything you need to go viral
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Three powerful AI tools to create content that converts and engages your audience
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Design Prompt Library */}
            <div className="bg-white rounded-2xl p-8 shadow-[0_8px_32px_rgba(0,0,0,0.08)] hover:shadow-[0_16px_48px_rgba(0,0,0,0.12)] transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Design Prompt Library</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Access thousands of proven design prompts that create viral content. Get instant inspiration for posts, stories, and campaigns.
              </p>
              <button 
                onClick={handleAuthAction}
                disabled={loading}
                className="flex items-center text-blue-600 font-semibold hover:text-blue-700 transition-colors duration-200 cursor-pointer disabled:opacity-50"
              >
                <span>{user ? 'Access Prompts' : 'Explore Prompts'}</span>
                <svg className="w-4 h-4 ml-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"/>
                </svg>
              </button>
            </div>

            {/* TikTok Slideshow Generator */}
            <div className="bg-white rounded-2xl p-8 shadow-[0_8px_32px_rgba(0,0,0,0.08)] hover:shadow-[0_16px_48px_rgba(0,0,0,0.12)] transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Automated TikTok Slideshow Generator</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Transform your content into engaging TikTok slideshows automatically. Perfect timing, transitions, and viral-ready formats.
              </p>
              <button 
                onClick={handleAuthAction}
                disabled={loading}
                className="flex items-center text-purple-600 font-semibold hover:text-purple-700 transition-colors duration-200 cursor-pointer disabled:opacity-50"
              >
                <span>{user ? 'Access Slideshows' : 'Create Slideshows'}</span>
                <svg className="w-4 h-4 ml-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"/>
                </svg>
              </button>
            </div>

            {/* Viral TikTok Guides */}
            <div className="bg-white rounded-2xl p-8 shadow-[0_8px_32px_rgba(0,0,0,0.08)] hover:shadow-[0_16px_48px_rgba(0,0,0,0.12)] transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Viral TikTok Guides</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Step-by-step guides for creating viral TikTok videos including AI baby videos, Bigfoot content, AI ASMR, and trending formats that get millions of views.
              </p>
              <button 
                onClick={handleAuthAction}
                disabled={loading}
                className="flex items-center text-green-600 font-semibold hover:text-green-700 transition-colors duration-200 cursor-pointer disabled:opacity-50"
              >
                <span>{user ? 'Access Video Guides' : 'Get Video Guides'}</span>
                <svg className="w-4 h-4 ml-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 