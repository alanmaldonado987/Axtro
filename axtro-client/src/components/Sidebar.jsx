import React from 'react'
import { useAppContext } from '../context/AppContext'

const Sidebar = () => {

  const { chats, setSelectedChat, theme, setTheme, user } = useAppContext()
  

  return (
    <div>
      Sidebar
    </div>
  )
}

export default Sidebar
