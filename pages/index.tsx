import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useAuth } from '../hooks/useAuth'
import CrudUser from "../components/layouts/crud_user"
import CrudBanner from "../components/layouts/crud_banner"
import CrudBlog from "../components/layouts/crud_blog"
import ItemForSale from "../components/layouts/item_for_sale"
import ItemList from "../components/layouts/item_list"
import Image from 'next/image'
import { ItemForSaleType } from '../types/item';

// Add this type definition at the top of the file, after the imports
type SectionType = 'dashboard' | 'crud-user' | 'Upload-Banner' | 'upload-blog' | 'item-for-sale';

const DashboardPage = () => {
const [activeSection, setActiveSection] = useState<SectionType>('dashboard')
const [hoverSection, setHoverSection] = useState<SectionType | null>(null)
const { user, isAdmin, loading, isAuthenticated, signOut } = useAuth()
const router = useRouter()

  useEffect(() => {
    if (!loading && (!isAuthenticated || !isAdmin)) {
      router.push('/login')
    }
  }, [isAuthenticated, isAdmin, loading, router])

  if (loading) {
    return <div>Loading...</div>
  }

  if (!isAuthenticated || !isAdmin) {
    return null // Don't render anything while redirecting
  }

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <div className="bg-white border-b p-3 border-gray-200">
            <ItemList/>
          </div>
        )
      case 'crud-user':
        return (
          <div className="bg-white border-b border-gray-200">
            <CrudUser/>
          </div>
        )
      case 'Upload-Banner':
        return (
          <div className="bg-white border-b p-3 border-gray-200">
            <CrudBanner/>
          </div>
        )
      case 'upload-blog':
        return (
          <div className="bg-white border-b p-3 border-gray-200">
            <CrudBlog/>
          </div>
        )
      case 'item-for-sale':
        return (
          <div className="bg-white border-b p-3 border-gray-200">
            <ItemForSale
              item={{} as ItemForSaleType}
              onUpdate={(updatedItem: ItemForSaleType) => {
                console.log('Item updated:', updatedItem);
                // Handle the update logic here
              }}
              onCancel={() => setActiveSection('dashboard')}
            />
          </div>
        )
      default:
        return null
    }
  }

  const handleNavClick = (section: SectionType) => {
    setActiveSection(section)
  }

  const handleNavHover = (section: SectionType | null) => {
    setHoverSection(section)
  }

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="home-container">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex justify-items-center">
              <Image src="/../public/icon_app.png" alt='logo' width={25} height={5}></Image>
            </div>
            <div className="hidden md:block">
              <div className="ml-4 flex items-center md:ml-6">
              <button
                className="text-left py-2 px-4 mt-auto text-red-600 hover:bg-red-100"
                onClick={handleSignOut}
                >
              Sign Out
            </button>
              </div>
            </div>
            <div className="-mr-2 flex md:hidden">
              <button className="bg-gray-800 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                <span className="sr-only">Open main menu</span>
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                <svg className="hidden h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>
      <div className="flex bg-gray-100">
        {/* Sidebar */}
        <div className="w-55 bg-white shadow-md">
          <nav className="mt-4 flex flex-col p-5 h-screen">
            <button
              className={`text-left py-2 px-4 ${activeSection === 'dashboard' ? 'border-b-2 border-blue-500' : ''} ${hoverSection === 'dashboard' ? 'bg-gray-100' : ''}`}
              onClick={() => handleNavClick('dashboard')}
              onMouseEnter={() => handleNavHover('dashboard')}
              onMouseLeave={() => handleNavHover(null)}
            >
              Dashboard
            </button>
            <button
              className={`text-left py-2 px-4 ${activeSection === 'crud-user' ? 'border-b-2 border-blue-500' : ''} ${hoverSection === 'crud-user' ? 'bg-gray-100' : ''}`}
              onClick={() => handleNavClick('crud-user')}
              onMouseEnter={() => handleNavHover('crud-user')}
              onMouseLeave={() => handleNavHover(null)}
            >
              CRUD User
            </button>
            <button
              className={`text-left py-2 px-4 ${activeSection === 'Upload-Banner' ? 'border-b-2 border-blue-500' : ''} ${hoverSection === 'Upload-Banner' ? 'bg-gray-100' : ''}`}
              onClick={() => handleNavClick('Upload-Banner')}
              onMouseEnter={() => handleNavHover('Upload-Banner')}
              onMouseLeave={() => handleNavHover(null)}
            >
              CRUD Banner
            </button>
            <button
              className={`text-left py-2 px-4 ${activeSection === 'upload-blog' ? 'border-b-2 border-blue-500' : ''} ${hoverSection === 'upload-blog' ? 'bg-gray-100' : ''}`}
              onClick={() => handleNavClick('upload-blog')}
              onMouseEnter={() => handleNavHover('upload-blog')}
              onMouseLeave={() => handleNavHover(null)}
            >
              Upload Blog
            </button>
            <button
              className={`text-left py-2 px-4 ${activeSection === 'item-for-sale' ? 'border-b-2 border-blue-500' : ''} ${hoverSection === 'item-for-sale' ? 'bg-gray-100' : ''}`}
              onClick={() => handleNavClick('item-for-sale')}
              onMouseEnter={() => handleNavHover('item-for-sale')}
              onMouseLeave={() => handleNavHover(null)}
            >
              Item For Sale
            </button>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-5">
          <div className="bg-white overflow-hidden shadow-sm rounded-lg">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
    
  )
}

export default DashboardPage
