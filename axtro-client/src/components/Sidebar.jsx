import React, { useState } from 'react'
import { useAppContext } from '../context/AppContext'
import { assets } from '../assets/assets'
import moment from 'moment'

const Sidebar = ({ isMenuOpen, setIsMenuOpen }) => {

  const { chats, setSelectedChat, theme, setTheme, user, navigate, logout } = useAppContext()
  const [search, setSearch] = useState('')

  return (
    <div className={`flex flex-col h-screen min-w-72 p-5 bg-[#F8F4FF] dark:bg-[#1C1426] border-r border-[#E2D4FF] dark:border-[#3B2A4F] backdrop-blur-3xl transition-all duration-500 max-md:absolute left-0 z-1 ${!isMenuOpen && 'max-md:-translate-x-full'}`}>
      {/* Logo */}
      <div className='flex items-center'>
        <img src={theme === 'dark' ? assets.logo_full : assets.logo_full_dark } alt='' className='w-full max-w-22' /> <p className='text-2xl text-[#4C1D95] dark:text-white'><i>Axtro AI</i></p>
      </div>

      {/* New Chat Button */}
      <button className='flex justify-center items-center w-full py-2 mt-10 text-white bg-[#7C3AED] hover:bg-[#6931C9] text-sm rounded-md cursor-pointer transition-colors'>
        <span className='mr-1'> + </span>Nuevo chat
      </button>

      {/* Search Conversations */}
      <div className='flex items-center gap-2 p-3 mt-4 border border-[#D8C8FF] dark:border-[#3B2A4F] bg-white/40 dark:bg-transparent rounded-md'>
        <img src={assets.search_icon} alt='' className='w-4 not-dark:invert opacity-70' />
        <input onChange={(e)=>setSearch(e.target.value)} value={search} type="text" placeholder='Buscar conversaciones' className='text-xs placeholder:text-[#B19CD6] text-[#4C1D95] dark:text-white outline-none bg-transparent' />
      </div>

      {/* Resent Chats */}
      {chats.length > 0 && <p className='mt-4 text-sm text-[#4C1D95] dark:text-white'>Chats recientes</p>}
      <div className='flex-1 min-h-0 overflow-y-auto custom-scrollbar mt-3 text-sm space-y-3 pr-2'>
        {
          chats.filter((chat) => chat.messages[0] ? chat.messages[0]?.content.toLowerCase().includes(search.toLocaleLowerCase()) : chat.name.toLowerCase().includes(search.toLocaleLowerCase())).map((chat) => (
            <div onClick={()=>{navigate('/'); setSelectedChat(chat); setIsMenuOpen(false)}} key={chat._id} className='p-2 px-4 bg-[#F4EEFF] dark:bg-[#2B1B3D] border border-[#E2D4FF] dark:border-[#3B2A4F] flex justify-between group text-[#33204D] dark:text-white'>
              <div>
                <p className='truncate w-full '>
                  {chat.messages.length > 0 ? chat.messages[0].content.slice(0,32) : chat.name}
                </p>
                <p className='text-xs text-[#8C7AB5] dark:text-[#B1A6C0]'>
                  {moment(chat.updatedAt).fromNow()}
                </p>
              </div>
              <img src={assets.bin_icon} className='hidden group-hover:block w-4 cursor-pointer not-dark:invert opacity-70 hover:opacity-100' alt="" />
            </div>
          ))
        }
      </div>

      {/* Community Images */}
      {/* <div onClick={()=>{navigate('/community'); ; setIsMenuOpen(false)}} className='flex items-center gap-2 p-3 mt-4 border border-gray-300 dark:border-white/15 rounder-md cursor-pointer hover:scale-103 transition-all'>
        <img src={assets.gallery_icon} className='w-4.5 not-dark:invert' alt="" />
        <div className='flex flex-col text-sm dark:text-white'>
          <p>Community Images</p>
        </div>
      </div> */}

      {/* Credits Purchases Option */}
      {/* <div onClick={()=>{navigate('/credits'); setIsMenuOpen(false)}} className='flex items-center gap-2 p-3 mt-4 border border-gray-300 dark:border-white/15 rounder-md cursor-pointer hover:scale-103 transition-all'>
        <img src={assets.diamond_icon} className='w-4.5 dark:invert' alt="" />
        <div className='flex flex-col text-sm dark:text-white'>
          <p>Credits : {user?.credits}</p>
          <p className='text-xs text-gray-400'>Purchase credits to use Axtro AI</p>
        </div>
      </div> */}

      {/* Dark Mode Toggle */}
      <div className='flex items-center justify-between gap-2 p-3 mt-4 border border-[#D8C8FF] dark:border-[#3B2A4F] bg-white/40 dark:bg-[#20152E] rounded-md'>
        <div className='flex items-center gap-2 text-sm text-[#4C1D95] dark:text-white'>
          <img src={assets.theme_icon} className='w-4 not-dark:invert opacity-70' alt="" />
          <p>Modo Oscuro</p>
        </div>
        <label className='relative inline-flex cursor-pointer'>
          <input onChange={()=>setTheme(theme === 'dark' ? 'ligth' : 'dark')} type="checkbox" className='sr-only peer' checked={theme === 'dark'} />
          <div className='w-9 h-5 bg-[#CDBAFD] rounded-full peer-checked:bg-[#7C3AED] transition-all'>
          </div>
          <span className='absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition-transform peer-checked:translate-x-4'></span>
        </label>
      </div>

      {/* Usser Account */}
      <div className='flex items-center gap-2 p-3 mt-4 border border-[#D8C8FF] dark:border-[#3B2A4F] rounded-md cursor-pointer bg-white/40 dark:bg-[#20152E]'>
        <img src={assets.user_icon} className='w-7 rounder-full' alt="" />
        <p className='flex-1 text-sm text-[#4C1D95] dark:text-[#E6CCFF] truncate'>{user ? user.name : 'Login your account'}</p>
        { user && <img 
          src={assets.logout_icon} 
          className='h-5 cursor-pointer not-dark:invert hover:opacity-70 transition-opacity' 
          alt="Cerrar sesión"
          onClick={(e) => {
            e.stopPropagation();
            logout();
          }}
          title="Cerrar sesión"
        /> }
      </div>

      <img onClick={()=>setIsMenuOpen(false)} src={assets.close_icon} className='hidden max-md:block absolute top-3 right-3 w-5 h-5 cursor-pointer not-dark:invert' alt="" />

    </div>
  )
}

export default Sidebar
