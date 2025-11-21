import React, { useState } from 'react'
import { useAppContext } from '../context/AppContext'
import { assets } from '../assets/assets'

const Sidebar = () => {

  const { chats, setSelectedChat, theme, setTheme, user } = useAppContext()
  const [search, setSearch] = useState('')

  return (
    <div className='flex flex-col h-screen min-w-72 p-5 dark:bg-gradient-to-b from-[#242124]/30 to-[#000000]/30 border-r border-[#80609F]/30 backdrop-blur-3xl transition-all duration-500 max-md:absolute left-0 z-1'>
      {/* Logo */}
      <img src={theme === 'dark' ? assets.logo_full : assets.logo_full_dark } alt='' className='w-full max-w-48' />

      {/* New Chat Button */}
      <button className='flex justify-center items-center w-full py-2 mt-10 text-white bg-gradient-to-r from-[#A456F7] to-[#3D81F6] text-sm rounded-md cursor-pointer'>
        <span>+</span> New Chat
      </button>

      {/* Search Conversations */}
      <div className='flex items-center gap-2 p-3 mt-4 border border-gray-400 dark:border-white/20 rounded-md'>
        <img src={assets.search_icon} alt='' className='w-4 not-dark:invert' />
        <input onChange={(e)=>setSearch(e.target.value)} value={search} type="text" placeholder='Buscar conversaciones' className='text-xs placeholder:text-gray-400 outline-none' />
      </div>

      {/* Resent Chats */}
      {chats.length > 0 && <p className='mt-4 text-sm'>Chats recientes</p>}
      <div>
        
      </div>
    </div>
  )
}

export default Sidebar
