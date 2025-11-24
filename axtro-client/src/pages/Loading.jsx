import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const Loading = () => {

  const navigate = useNavigate()
  
  useEffect(()=>{
    const timeout = setTimeout(()=>{
      navigate('/')
    }, 8000)
    return ()=>clearTimeout(timeout)
  }, [])

  return (
    <div className='bg-[#2B0F4A] flex items-center justify-center h-screen w-screen text-[#E6CCFF] text-2xl'>
      <div className='w-10 h-10 rounded-full border-3 border-[#E6CCFF] border-t-transparent animate-spin'></div>
    </div>
  )
}

export default Loading
