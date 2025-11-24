import React, { useState, useEffect, useRef } from 'react'
import Swal from 'sweetalert2'
import { useAppContext } from '../context/AppContext'
import { assets } from '../assets/assets'
import moment from 'moment/min/moment-with-locales'
import { chatService } from '../services/chatService'
import { FiSettings, FiUser, FiInfo } from 'react-icons/fi'

moment.locale('es')

const Sidebar = ({ isMenuOpen, setIsMenuOpen }) => {

  const { chats, setSelectedChat, theme, setTheme, user, navigate, logout, selectedChat, fetchUserChats, isInformationOpen, setIsInformationOpen } = useAppContext()
  const [search, setSearch] = useState('')
  const [isCreatingChat, setIsCreatingChat] = useState(false)
  const [deletingChatId, setDeletingChatId] = useState(null)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const userMenuRef = useRef(null)

  const handleCreateChat = async () => {
    if (isCreatingChat) return;
    try {
      setIsCreatingChat(true)
      const response = await chatService.createChat()
      if(response.success){
        if (response.chat) {
          setSelectedChat(response.chat)
        }
        await fetchUserChats()
      }else{
        console.error(response.message || 'Error al crear chat')
      }
    } catch (error) {
      console.error('Error al crear chat', error)
    } finally {
      setIsCreatingChat(false)
    }
  }

  const handleDeleteChat = async (e, chatId) => {
    e.stopPropagation()
    if (deletingChatId) return;

    setDeletingChatId(chatId)

    try {
      const result = await Swal.fire({
        title: '¿Estás seguro de borrar el chat?',
        text: 'Esta acción eliminará la conversación de forma permanente.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, borrar',
        cancelButtonText: 'Cancelar',
        reverseButtons: true,
        buttonsStyling: false,
        showLoaderOnConfirm: true,
        customClass: {
          popup: 'swal2-rounded',
          confirmButton: 'swal2-confirm-btn',
          cancelButton: 'swal2-cancel-btn',
          title: 'swal2-title-text',
          htmlContainer: 'swal2-body-text',
        },
        allowOutsideClick: () => !Swal.isLoading(),
        preConfirm: async () => {
          const response = await chatService.deleteChat(chatId)
          if (!response.success) {
            throw new Error(response.message || 'No se pudo eliminar el chat.')
          }
          return response
        }
      })

      if (result.isConfirmed) {
        if (selectedChat?._id === chatId) {
          setSelectedChat(null)
        }
        await fetchUserChats()
        Swal.fire({
          icon: 'success',
          title: 'Chat eliminado',
          text: 'La conversación se eliminó correctamente.',
          confirmButtonText: 'Entendido',
          buttonsStyling: false,
          customClass: {
            popup: 'swal2-rounded',
            confirmButton: 'swal2-confirm-btn',
            title: 'swal2-title-text',
            htmlContainer: 'swal2-body-text'
          }
        })
      }
    } catch (error) {
      console.error('Error al eliminar chat', error)
      Swal.fire({
        icon: 'error',
        title: 'Algo salió mal',
        text: 'Intenta nuevamente en unos segundos.',
        confirmButtonText: 'Entendido',
        buttonsStyling: false,
        customClass: {
          popup: 'swal2-rounded',
          confirmButton: 'swal2-confirm-btn',
          title: 'swal2-title-text',
          htmlContainer: 'swal2-body-text'
        }
      })
    } finally {
      setDeletingChatId(null)
    }
  }

  // Cerrar menú de usuario al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false)
      }
    }

    if (isUserMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isUserMenuOpen])

  const handleUserMenuClick = (e) => {
    e.stopPropagation()
    if (user) {
      setIsUserMenuOpen(!isUserMenuOpen)
    }
  }

  const handleMenuOption = (option) => {
    setIsUserMenuOpen(false)
    switch(option) {
      case 'configuracion':
        navigate('/configuration')
        break
      case 'cuenta':
        navigate('/account')
        break
      case 'informacion':
        setIsInformationOpen(true)
        break
      default:
        break
    }
  }

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: '¿Estás seguro de querer cerrar sesión?',
      text: 'Serás redirigido a la página de inicio.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, cerrar sesión',
      cancelButtonText: 'Cancelar',
      reverseButtons: true,
      buttonsStyling: false,
      customClass: {
        popup: 'swal2-rounded',
        confirmButton: 'swal2-confirm-btn',
        cancelButton: 'swal2-cancel-btn',
        title: 'swal2-title-text',
        htmlContainer: 'swal2-body-text',
      }
    })

    if (result.isConfirmed) {
      logout()
    }
  }

  return (
    <div className={`flex flex-col h-screen min-w-72 p-5 bg-[#F8F4FF] dark:bg-[#1C1426] border-r border-[#E2D4FF] dark:border-[#3B2A4F] backdrop-blur-3xl transition-all duration-500 ease-out max-md:absolute left-0 z-50 ${!isMenuOpen ? 'max-md:-translate-x-full max-md:opacity-0' : 'max-md:translate-x-0 max-md:opacity-100'}`}>
      {/* Logo */}
      <div className='flex items-center'>
        <img src={theme === 'dark' ? assets.logo_full : assets.logo_full_dark } alt='' className='w-full max-w-22' /> <p className='text-2xl text-[#4C1D95] dark:text-white'><i>Axtro AI</i></p>
      </div>

      {/* New Chat Button */}
      <button
        onClick={handleCreateChat}
        disabled={isCreatingChat}
        className='flex justify-center items-center w-full py-2 mt-10 text-white bg-[#7C3AED] hover:bg-[#6931C9] text-sm rounded-md cursor-pointer transition-colors disabled:opacity-60 disabled:cursor-not-allowed'
      >
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
          chats.filter((chat) => chat.messages[0] ? chat.messages[0]?.content.toLowerCase().includes(search.toLocaleLowerCase()) : chat.name.toLowerCase().includes(search.toLocaleLowerCase())).map((chat) => {
            const isActive = selectedChat?._id === chat._id
            return (
            <div
              onClick={()=>{navigate('/'); setSelectedChat(chat); setIsMenuOpen(false)}}
              key={chat._id}
              className={`p-2 px-4 border flex justify-between group text-[#33204D] dark:text-white cursor-pointer ${isActive ? 'bg-[#E5D9FF] border-[#C2A7FF] dark:bg-[#3A2751]' : 'bg-[#F4EEFF] dark:bg-[#2B1B3D] border-[#E2D4FF] dark:border-[#3B2A4F]'}`}
            >
              <div>
                <p className='truncate w-full '>
                  {chat.messages.length > 0 ? chat.messages[0].content.slice(0,32) : chat.name}
                </p>
                <p className='text-xs text-[#8C7AB5] dark:text-[#B1A6C0]'>
                  {moment(chat.updatedAt).locale('es').fromNow()}
                </p>
              </div>
              <img
                src={assets.bin_icon}
                className='hidden group-hover:block w-4 cursor-pointer not-dark:invert opacity-70 hover:opacity-100'
                alt="Eliminar chat"
                title="Eliminar chat"
                onClick={(e)=>handleDeleteChat(e, chat._id)}
              />
            </div>
          )})
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

      {/* User Account */}
      <div className='relative' ref={userMenuRef}>
        <div 
          onClick={handleUserMenuClick}
          className='flex items-center gap-2 p-3 mt-4 border border-[#D8C8FF] dark:border-[#3B2A4F] rounded-md cursor-pointer bg-white/40 dark:bg-[#20152E] hover:bg-white/60 dark:hover:bg-[#2A1B3A] transition-colors'
        >
          {user?.profilePicture ? (
            <img src={user.profilePicture} className='w-7 h-7 rounded-full object-cover' alt="Usuario" />
          ) : (
            <div className='w-7 h-7 rounded-full bg-gradient-to-br from-[#7C3AED] to-[#9B5CFF] flex items-center justify-center text-white text-xs font-bold'>
              {user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'U'}
            </div>
          )}
          <p className='flex-1 text-sm text-[#4C1D95] dark:text-[#E6CCFF] truncate'>{user ? user.name : 'Login your account'}</p>
          { user && <img 
            src={assets.logout_icon} 
            className='h-5 cursor-pointer not-dark:invert hover:opacity-70 transition-opacity' 
            alt="Cerrar sesión"
            onClick={(e) => {
              e.stopPropagation();
              handleLogout();
            }}
            title="Cerrar sesión"
          /> }
        </div>

        {/* User Menu Dropdown */}
        {isUserMenuOpen && user && (
          <div className='absolute bottom-full left-0 mb-2 w-full bg-white dark:bg-[#2B1B3D] border border-[#E2D4FF] dark:border-[#3B2A4F] rounded-lg shadow-lg overflow-hidden z-50 animate-fade-in'>
            <button
              onClick={() => handleMenuOption('configuracion')}
              className='w-full flex items-center gap-3 px-4 py-3 text-sm text-[#4C1D95] dark:text-[#E6CCFF] hover:bg-[#F1E6FF] dark:hover:bg-[#3A2751] transition-colors text-left cursor-pointer'
            >
              <FiSettings className='text-lg' />
              <span>Configuración</span>
            </button>
            <button
              onClick={() => handleMenuOption('cuenta')}
              className='w-full flex items-center gap-3 px-4 py-3 text-sm text-[#4C1D95] dark:text-[#E6CCFF] hover:bg-[#F1E6FF] dark:hover:bg-[#3A2751] transition-colors text-left border-t border-[#E2D4FF] dark:border-[#3B2A4F] cursor-pointer'
            >
              <FiUser className='text-lg' />
              <span>Cuenta</span>
            </button>
            <button
              onClick={() => handleMenuOption('informacion')}
              className='w-full flex items-center gap-3 px-4 py-3 text-sm text-[#4C1D95] dark:text-[#E6CCFF] hover:bg-[#F1E6FF] dark:hover:bg-[#3A2751] transition-colors text-left border-t border-[#E2D4FF] dark:border-[#3B2A4F] cursor-pointer'
            >
              <FiInfo className='text-lg' />
              <span>Información</span>
            </button>
          </div>
        )}
      </div>

      <img onClick={()=>setIsMenuOpen(false)} src={assets.close_icon} className='hidden max-md:block absolute top-3 right-3 w-5 h-5 cursor-pointer not-dark:invert' alt="" />

    </div>
  )
}

export default Sidebar
