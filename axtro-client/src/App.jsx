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
import { useAppContext } from './context/AppContext'

const App = () => {

  const { user } = useAppContext()

  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { pathname } = useLocation()

  if (pathname === '/loading') return <Loading />

  return (
    <>
    {!isMenuOpen && <img src={assets.menu_icon} className='absolute top-3 left-3 w-8 h-8 cursor-pointer md:hidden not-dark:invert' onClick={()=>setIsMenuOpen(true)} />}
    {user ? (
      <div className='bg-[#F7F4FF] dark:bg-[#0F0618] transition-colors duration-300'>
        <div className='flex h-screen w-screen'>
          <Sidebar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
          <Routes>
            <Route path='/' element={<ChatBox/>} />
            <Route path='/credits' element={<Credits/>} />
            <Route path='/community' element={<Community/>} />
          </Routes>
        </div>
      </div>
    ) : (
      <div>
        <LoginRegister />
      </div>
    )}
    </>
  )
}

export default App
