import React, { useEffect, useRef, useState } from 'react'
import { useAppContext } from '../context/AppContext'
import { assets } from '../assets/assets'
import Message from './Message'
import { messageService } from '../services/messageService'

const EMPTY_STATE_PROMPTS = [
  '¿En qué estás trabajando?',
  '¿En qué piensas hoy?',
  '¿Cuál es el programa de hoy?',
  'Listo cuando tú lo estés.',
  '¿Qué idea quieres explorar hoy?',
  '¿Qué te gustaría aprender ahora?',
  '¿Qué proyecto te gustaría impulsar?',
  '¿Cuál es el reto que quieres resolver?',
  '¿Listo para crear algo nuevo?'
]

const getRandomEmptyPrompt = () => EMPTY_STATE_PROMPTS[Math.floor(Math.random() * EMPTY_STATE_PROMPTS.length)]

const ChatBox = () => {

  const containerRef = useRef(null)

  const { selectedChat, theme, setChats, setSelectedChat, fetchUserChats } = useAppContext()
  const messages = selectedChat?.messages || []

  const [sending, setSending] = useState(false)
  const [prompt, setPrompt] = useState('')
  const [mode, setMode] = useState('texto')
  const [isPublished, setIsPublished] = useState(false)
  const [error, setError] = useState('')
  const [emptyPrompt, setEmptyPrompt] = useState(getRandomEmptyPrompt)

  const appendMessagesToCurrentChat = (newMessages) => {
    if (!selectedChat?._id) return
    setChats(prev => prev.map(chat => {
      if (chat._id === selectedChat._id) {
        return {...chat, messages: [...chat.messages, ...newMessages], updatedAt: Date.now()}
      }
      return chat
    }))
    setSelectedChat(prev => prev && prev._id === selectedChat._id ? {...prev, messages: [...prev.messages, ...newMessages], updatedAt: Date.now()} : prev)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!selectedChat?._id || !prompt.trim() || sending) return
    setError('')
    const userMessage = { role: 'user', content: prompt, timestamp: Date.now(), isImage: false }
    appendMessagesToCurrentChat([userMessage])
    setPrompt('')
    setSending(true)
    try {
      const response = mode === 'imagen'
        ? await messageService.sendImageMessage(selectedChat._id, userMessage.content, isPublished)
        : await messageService.sendTextMessage(selectedChat._id, userMessage.content)

      if (response.success && response.reply) {
        appendMessagesToCurrentChat([response.reply])
      } else {
        setError(response.message || 'No se pudo enviar el mensaje.')
        await fetchUserChats()
      }
    } catch (err) {
      setError('Error al conectar con el servidor.')
      await fetchUserChats()
    } finally {
      setSending(false)
    }
  }

  useEffect(()=>{
    if(messages.length === 0){
      setEmptyPrompt(getRandomEmptyPrompt())
    }
  }, [selectedChat?._id, messages.length])

  useEffect(()=>{
    if(containerRef.current){
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: "smooth",
      })
    }
  }, [messages])

  return (
    <div className='flex-1 flex flex-col justify-between m-5 md:m-10 xl:mx-30 max-md:mt14 2xl:pr-40'>
      
      {/* Chat Messages */}
      <div ref={containerRef} className='flex-1 mb-5 overflow-y-scroll'>
        {messages.length === 0 && (
          <div className='h-full flex flex-col items-center justify-center gap-2 text-[#7C3AED]'>
            {/* <img src={ theme === 'dark' ? assets.logo_full : assets.logo_full_dark } className='w-full max-w-56 sm:max-w-68' alt="" /> */}
            <p className='mt-5 text-4xl sm:text-6xl text-center text-[#7C3AED] dark:text-[#E6CCFF]'>{emptyPrompt}</p>
          </div>
        )}

        {messages.map((message, index)=> <Message key={index} message={message} /> )}

        {/* Tree Dots Loading */}
        {
          sending && <div className='loader flex items-center gap-1.5'>
              <div className='w-1.5 h-1.5 rounded-full bg-[#A07BDD] dark:bg-white animate-bounce'></div>
              <div className='w-1.5 h-1.5 rounded-full bg-[#8D6BC7] dark:bg-white animate-bounce'></div>
              <div className='w-1.5 h-1.5 rounded-full bg-[#7C5AB8] dark:bg-white animate-bounce'></div>
            </div>
        }
      </div>

      {error && (
        <p className='text-center text-sm text-red-500 mb-2'>{error}</p>
      )}

      {mode === 'imagen' && (
        <label className='inline-flex items-center gap-2 mb-3 text-sm mx-auto text-[#4C1D95]'>
          <p className='text-xs'>Publish Generated Image to Community</p>
          <input type="checkbox" className='cursor-pointer' checked={isPublished} onChange={(e)=>setIsPublished(e.target.checked)} />
        </label>
      )}

      {/* Prompt Input Box */}
      <form onSubmit={handleSubmit} className='bg-[#F1E6FF] dark:bg-[#2B1B3D] border border-[#D8C8FF] dark:border-[#3B2A4F] rounded-full w-full max-w-2xl p-3 pl-4 mx-auto flex gap-4 items-center text-[#4C1D95] dark:text-white'>
        <select onChange={(e)=>setMode(e.target.value)} value={mode} className='text-sm pl-3 pr-2 outline-none bg-transparent text-[#4C1D95] dark:text-white'>
          <option className='text-[#4C1D95]' value="texto">Texto</option>
          <option className='text-[#4C1D95]' value="imagen">Imagen</option>
        </select>
        <input onChange={(e)=>setPrompt(e.target.value)} value={prompt} className='flex-1 w-full text-sm outline-none bg-transparent text-[#33204D] dark:text-white placeholder:text-[#B19CD6]' type="text" placeholder='Escribe aquí...' required disabled={!selectedChat} />
        <button disabled={sending || !selectedChat}>
          <img src={sending ? assets.stop_icon : assets.send_icon} className='w-8 cursor-pointer' alt="" />
        </button>
      </form>
    </div>
  )
}

export default ChatBox
