import React, { useState } from 'react'
import CrudUser from "../components/layouts/curd_user"
import CrudBanner from "../components/layouts/crud_banner"
import CrudBlog from "../components/layouts/curd_blog"

const DashboardPage = () => {
  const [activeSection, setActiveSection] = useState('dashboard')
  const [hoverSection, setHoverSection] = useState(null)

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <div className="bg-white border-b p-3 border-gray-200">
            You're logged in!
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
            item
          </div>
        )
      case 'contact-us':
        return (
          <div className="bg-white border-b p-3 border-gray-200">
            contact-us
          </div>
        )
      case 'about-us':
        return (
          <div className="bg-white border-b p-3 border-gray-200">
            about-us
          </div>
        )
      default:
        return null
    }
  }

  const handleNavClick = (section) => {
    setActiveSection(section)
  }

  const handleNavHover = (section) => {
    setHoverSection(section)
  }

  return (
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
          <button
            className={`text-left py-2 px-4 ${activeSection === 'contact-us' ? 'border-b-2 border-blue-500' : ''} ${hoverSection === 'contact-us' ? 'bg-gray-100' : ''}`}
            onClick={() => handleNavClick('contact-us')}
            onMouseEnter={() => handleNavHover('contact-us')}
            onMouseLeave={() => handleNavHover(null)}
          >
            Contact Us
          </button>
          <button
            className={`text-left py-2 px-4 ${activeSection === 'about-us' ? 'border-b-2 border-blue-500' : ''} ${hoverSection === 'about-us' ? 'bg-gray-100' : ''}`}
            onClick={() => handleNavClick('about-us')}
            onMouseEnter={() => handleNavHover('about-us')}
            onMouseLeave={() => handleNavHover(null)}
          >
            About Us
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
  )
}

export default DashboardPage
