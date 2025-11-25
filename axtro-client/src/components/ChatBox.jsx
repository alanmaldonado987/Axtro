import React, { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
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
  const selectedChatIdRef = useRef(null)
  const audioContextRef = useRef(null)

  const { selectedChat, setChats, setSelectedChat, fetchUserChats, notificationSettings, pushNotification, personalizationSettings, assistantSettings } = useAppContext()
  const location = useLocation()
  const messages = selectedChat?.messages || []

  const [sending, setSending] = useState(false)
  const [sendingChatId, setSendingChatId] = useState(null)
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

  useEffect(() => {
    selectedChatIdRef.current = selectedChat?._id || null
  }, [selectedChat?._id])

  const playReplySound = async () => {
    if (personalizationSettings?.notificationSound === 'off') return
    const SoundContext = window.AudioContext || window.webkitAudioContext
    if (!SoundContext) return
    if (!audioContextRef.current) {
      audioContextRef.current = new SoundContext()
    }
    const ctx = audioContextRef.current
    if (ctx.state === 'suspended') {
      try {
        await ctx.resume()
      } catch (error) {
        console.error('No se pudo reanudar el contexto de audio', error)
      }
    }
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    const now = ctx.currentTime
    const isChime = personalizationSettings?.notificationSound === 'chime'
    osc.type = isChime ? 'triangle' : 'sine'
    osc.frequency.setValueAtTime(isChime ? 680 : 540, now)
    gain.gain.setValueAtTime(0.0001, now)
    gain.gain.exponentialRampToValueAtTime(0.08, now + 0.01)
    gain.gain.exponentialRampToValueAtTime(0.00001, now + 0.4)
    osc.connect(gain).connect(ctx.destination)
    osc.start(now)
    osc.stop(now + 0.4)
  }

  const appendMessagesToChat = (chatId, newMessages) => {
    if (!chatId) return
    setChats(prev => prev.map(chat => {
      if (chat._id === chatId) {
        return { ...chat, messages: [...chat.messages, ...newMessages], updatedAt: Date.now() }
      }
      return chat
    }))
    setSelectedChat(prev => prev && prev._id === chatId ? { ...prev, messages: [...prev.messages, ...newMessages], updatedAt: Date.now() } : prev)
  }

  const processSubmit = async () => {
    if (!selectedChat?._id || !prompt.trim() || sending) return
    const chatId = selectedChat._id
    const chatName = selectedChat.name || 'tu chat'
    setError('')
    setErrorFading(false)
    const userMessage = { role: 'user', content: prompt, timestamp: Date.now(), isImage: false }
    appendMessagesToChat(chatId, [userMessage])
    setPrompt('')
    setSending(true)
    setSendingChatId(chatId)
    
    abortControllerRef.current = new AbortController()
    const signal = abortControllerRef.current.signal

    try {
      const response = mode === 'imagen'
        ? await messageService.sendImageMessage(chatId, userMessage.content, isPublished, assistantSettings, signal)
        : await messageService.sendTextMessage(chatId, userMessage.content, assistantSettings, signal)

      if (response.success && response.reply) {
        appendMessagesToChat(chatId, [response.reply])
        playReplySound()
        const isViewingChat = location.pathname === '/' && selectedChatIdRef.current === chatId && !document.hidden
        if (notificationSettings?.newMessageAlerts && !isViewingChat) {
          pushNotification({
            title: 'Axtro respondió',
            message: `Hay una nueva respuesta en "${chatName}".`,
            actionLabel: 'Ver chat',
            chatId
          })
        }
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
          if (chat._id === chatId) {
            return { ...chat, messages: chat.messages.filter(m => m.timestamp !== userMessage.timestamp), updatedAt: Date.now() }
          }
          return chat
        }))
        setSelectedChat(prev => prev && prev._id === chatId ? { ...prev, messages: prev.messages.filter(m => m.timestamp !== userMessage.timestamp), updatedAt: Date.now() } : prev)
        
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
      setSendingChatId(null)
      abortControllerRef.current = null
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    await processSubmit()
  }

  const handleStop = () => {
    if (abortControllerRef.current && sending) {
      abortControllerRef.current.abort()
      setSending(false)
      setSendingChatId(null)
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

  const handlePromptKeyDown = (e) => {
    if (personalizationSettings?.sendBehavior !== 'ctrlEnter') return
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault()
      processSubmit()
    } else if (e.key === 'Enter') {
      e.preventDefault()
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
          <div className='h-full flex flex-col items-center justify-center gap-2'>
            <p className='mt-5 text-4xl sm:text-6xl text-center' style={{ color: 'var(--accent-color)' }}>{emptyPrompt}</p>
          </div>
        )}

        {messages.map((message, index)=> <Message key={index} message={message} /> )}

        {/* Tree Dots Loading */}
        {
          sending && selectedChat?._id === sendingChatId && <div className='loader flex items-center gap-1.5'>
              <div className='w-1.5 h-1.5 rounded-full animate-bounce' style={{ backgroundColor: 'var(--accent-color)' }}></div>
              <div className='w-1.5 h-1.5 rounded-full animate-bounce' style={{ backgroundColor: 'var(--accent-color-strong)', animationDelay: '0.15s' }}></div>
              <div className='w-1.5 h-1.5 rounded-full animate-bounce' style={{ backgroundColor: 'var(--accent-color)', animationDelay: '0.3s', opacity: 0.8 }}></div>
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
      <form
        onSubmit={handleSubmit}
        className='rounded-full w-full max-w-2xl p-3 pl-4 mx-auto flex gap-4 items-center text-[#4C1D95] dark:text-white border'
        style={{
          background: 'var(--accent-soft-bg)',
          borderColor: 'rgba(124,58,237,0.25)',
          color: 'var(--chat-text-strong)'
        }}
      >
        <select
          onChange={(e)=>setMode(e.target.value)}
          value={mode}
          className='text-sm pl-3 pr-2 outline-none bg-transparent'
          style={{ color: 'var(--chat-text-strong)' }}
        >
          <option className='text-inherit bg-white text-[#1C1426]' value="texto">Texto</option>
          <option className='text-inherit bg-white text-[#1C1426]' value="imagen">Imagen</option>
        </select>
        <input
          onChange={(e)=>setPrompt(e.target.value)}
          onKeyDown={handlePromptKeyDown}
          value={prompt}
          className='flex-1 w-full text-sm outline-none bg-transparent text-[#33204D] dark:text-white placeholder:text-[#B19CD6]'
          type="text"
          placeholder={personalizationSettings?.sendBehavior === 'ctrlEnter' ? 'Escribe y presiona Ctrl+Enter…' : 'Escribe aquí…'}
          required
          disabled={!selectedChat}
        />
        <button
          type="button"
          onClick={handleMicToggle}
          className='relative p-2 rounded-full transition-all cursor-pointer border'
          style={isListening ? {
            background: 'var(--accent-color)',
            color: '#fff',
            borderColor: 'var(--accent-color)',
            boxShadow: '0 0 18px rgba(124,58,237,0.45)'
          } : {
            background: 'var(--accent-soft-bg)',
            color: 'var(--chat-text-strong)',
            borderColor: 'rgba(0,0,0,0.08)'
          }}
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
