import React, { useState } from 'react'
import Sidebar from './components/Sidebar'
import ChatBox from './components/ChatBox'
import { Route, Routes, useLocation } from 'react-router-dom'
import Credits from './pages/Credits'
import Community from './pages/Community'
import { assets } from './assets/assets'
import './styles/prism.css'
import Loading from './pages/Loading'
import LoginRegister from './pages/LoginRegister'
import AuthCallback from './pages/AuthCallback'
import { useAppContext } from './context/AppContext'
import Configuration from './pages/Configuration'
import Account from './pages/Account'
import Information from './pages/Information'
import { FiMenu } from 'react-icons/fi'
import NotificationToast from './components/NotificationToast'

const App = () => {

  const { user, isInformationOpen, setIsInformationOpen } = useAppContext()

  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { pathname } = useLocation()

  if (pathname === '/loading') return <Loading />

  // La ruta /auth/callback debe estar disponible siempre
  if (pathname === '/auth/callback') {
    return <AuthCallback />
  }

  return (
    <>
    {user && !isMenuOpen && (
      <button 
        onClick={()=>setIsMenuOpen(true)}
        className='absolute top-3 left-3 w-10 h-10 flex items-center justify-center cursor-pointer md:hidden bg-white/80 dark:bg-[#1C1426]/80 backdrop-blur-sm rounded-lg border border-[#E2D4FF] dark:border-[#3B2A4F] hover:bg-white dark:hover:bg-[#2B1B3D] transition-all shadow-sm hover:shadow-md z-40 animate-fade-in'
        aria-label="Abrir menú"
      >
        <FiMenu className='w-6 h-6 text-[#4C1D95] dark:text-[#E6CCFF] transition-transform hover:scale-110' />
      </button>
    )}
    {user ? (
      <div className='bg-[#F7F4FF] dark:bg-[#0F0618] transition-colors duration-300'>
        {/* Overlay para móvil cuando el menú está abierto */}
        {isMenuOpen && (
          <div 
            onClick={() => setIsMenuOpen(false)}
            className='fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm z-40 md:hidden animate-fade-in'
          />
        )}
        <div className='flex h-screen w-screen'>
          <Sidebar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
          <Routes>
            <Route path='/' element={<ChatBox/>} />
            <Route path='/credits' element={<Credits/>} />
            <Route path='/community' element={<Community/>} />
            <Route path='/configuration' element={<Configuration/>} />
            <Route path='/account' element={<Account/>} />
          </Routes>
        </div>
      </div>
    ) : (
      <Routes>
        <Route path='*' element={<LoginRegister />} />
      </Routes>
    )}
    {/* Information Modal - Renderizado a nivel de aplicación */}
    <Information isOpen={isInformationOpen} onClose={() => setIsInformationOpen(false)} />
    <NotificationToast />
    </>
  )
}

export default App
