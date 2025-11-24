import React, { useEffect, useRef, useState } from 'react'
import { useAppContext } from '../context/AppContext'
import { assets } from '../assets/assets'
import Message from './Message'
import { messageService } from '../services/messageService'
import { FiMic } from 'react-icons/fi'
import { RiVoiceprintFill } from 'react-icons/ri'

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
  const recognitionRef = useRef(null)
  const abortControllerRef = useRef(null)

  const { selectedChat, theme, setChats, setSelectedChat, fetchUserChats } = useAppContext()
  const messages = selectedChat?.messages || []

  const [sending, setSending] = useState(false)
  const [prompt, setPrompt] = useState('')
  const [mode, setMode] = useState('texto')
  const [isPublished, setIsPublished] = useState(false)
  const [error, setError] = useState('')
  const [errorFading, setErrorFading] = useState(false)
  const [emptyPrompt, setEmptyPrompt] = useState(getRandomEmptyPrompt)
  const [isListening, setIsListening] = useState(false)

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      recognitionRef.current = null
      return
    }

    const recognition = new SpeechRecognition()
    recognition.lang = 'es-ES'
    recognition.interimResults = false
    recognition.maxAlternatives = 1

    recognition.onstart = () => setIsListening(true)
    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map(result => result[0].transcript)
        .join(' ')
        .trim()
      if (transcript) {
        setPrompt(prev => prev ? `${prev} ${transcript}` : transcript)
      }
    }
    recognition.onerror = () => {
      setIsListening(false)
      setError('No se pudo captar tu voz, intenta nuevamente.')
      setErrorFading(false)
    }
    recognition.onend = () => {
      setIsListening(false)
    }

    recognitionRef.current = recognition

    return () => {
      recognition.stop?.()
      recognitionRef.current = null
    }
  }, [])

  useEffect(() => {
    return () => {
      // Limpiar AbortController al desmontar
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [])

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
    setErrorFading(false)
    const userMessage = { role: 'user', content: prompt, timestamp: Date.now(), isImage: false }
    appendMessagesToCurrentChat([userMessage])
    setPrompt('')
    setSending(true)
    
    // Crear AbortController para poder cancelar la petición
    abortControllerRef.current = new AbortController()
    const signal = abortControllerRef.current.signal

    try {
      const response = mode === 'imagen'
        ? await messageService.sendImageMessage(selectedChat._id, userMessage.content, isPublished, signal)
        : await messageService.sendTextMessage(selectedChat._id, userMessage.content, signal)

      if (response.success && response.reply) {
        appendMessagesToCurrentChat([response.reply])
      } else {
        setError(response.message || 'No se pudo enviar el mensaje.')
        setErrorFading(false)
        await fetchUserChats()
      }
    } catch (err) {
      if (err.name === 'AbortError' || err.message === 'canceled') {
        setError('Envío cancelado.')
        setErrorFading(false)
        setChats(prev => prev.map(chat => {
          if (chat._id === selectedChat._id) {
            return {...chat, messages: chat.messages.filter(m => m.timestamp !== userMessage.timestamp), updatedAt: Date.now()}
          }
          return chat
        }))
        setSelectedChat(prev => prev && prev._id === selectedChat._id ? {...prev, messages: prev.messages.filter(m => m.timestamp !== userMessage.timestamp), updatedAt: Date.now()} : prev)
        
        setTimeout(() => {
          setErrorFading(true)
          setTimeout(() => {
            setError('')
            setErrorFading(false)
          }, 500)
        }, 3500)
      } else {
        setError('Error al conectar con el servidor.')
        setErrorFading(false)
        await fetchUserChats()
      }
    } finally {
      setSending(false)
      abortControllerRef.current = null
    }
  }

  const handleStop = () => {
    if (abortControllerRef.current && sending) {
      abortControllerRef.current.abort()
      setSending(false)
    }
  }

  const handleMicToggle = () => {
    if (!recognitionRef.current) {
      setError('Tu navegador no soporta dictado por voz.')
      setErrorFading(false)
      return
    }

    if (isListening) {
      recognitionRef.current.stop()
      return
    }

    setError('')
    setErrorFading(false)
    try {
      recognitionRef.current.start()
    } catch (err) {
      setError('No se pudo iniciar el micrófono.')
      setErrorFading(false)
      setIsListening(false)
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
        <p className={`text-center text-sm text-red-500 mb-2 transition-opacity duration-500 ${errorFading ? 'opacity-0' : 'opacity-100'}`}>{error}</p>
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
        <button
          type="button"
          onClick={handleMicToggle}
          className={`relative p-2 rounded-full transition-all cursor-pointer border ${isListening ? 'bg-[#7C3AED] text-white border-[#BFA0FF] shadow-[0_0_18px_rgba(124,58,237,0.5)]' : 'bg-[#E5D9FF] dark:bg-[#3A2751] text-[#4C1D95] dark:text-white border-transparent hover:bg-[#DCC6FF] dark:hover:bg-[#4A2C67]'}`}
          title={isListening ? 'Detener dictado' : 'Dictar con micrófono'}
          disabled={!selectedChat}
        >
          {isListening ? (
            <>
              <RiVoiceprintFill className='text-xl relative z-10 voice-recording-icon' />
              <span className="absolute inset-0 rounded-full bg-[#7C3AED] voice-wave-1"></span>
              <span className="absolute inset-0 rounded-full bg-[#7C3AED] voice-wave-2"></span>
              <span className="absolute inset-0 rounded-full bg-[#7C3AED] voice-wave-3"></span>
            </>
          ) : (
            <FiMic className='text-lg' />
          )}
        </button>
        <button 
          type={sending ? 'button' : 'submit'}
          onClick={sending ? handleStop : undefined}
          disabled={!selectedChat}
          className={sending ? 'cursor-pointer' : ''}
        >
          <img src={sending ? assets.stop_icon : assets.send_icon} className='w-8 cursor-pointer' alt={sending ? 'Detener' : 'Enviar'} />
        </button>
      </form>
    </div>
  )
}

export default ChatBox
