import React from 'react'
import { FiX, FiMessageCircle } from 'react-icons/fi'
import { useAppContext } from '../context/AppContext'

const NotificationToast = () => {
  const { toast, clearToast, navigate, setSelectedChat, chats } = useAppContext()

  if (!toast) return null

  const handleAction = () => {
    if (toast.onAction) {
      toast.onAction()
    } else if (toast.chatId) {
      navigate('/')
      const chatToOpen = chats.find(chat => chat._id === toast.chatId)
      if (chatToOpen) {
        setSelectedChat(chatToOpen)
      }
    }
    clearToast()
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-[min(90vw,320px)] animate-fade-in">
      <div className="bg-white/95 dark:bg-[#1C1426]/95 border border-[#E2D4FF] dark:border-[#3B2A4F] rounded-2xl shadow-xl backdrop-blur p-4 flex gap-3" style={{ borderColor: 'rgba(124,58,237,0.25)' }}>
        <div className="flex items-start justify-center pt-1">
          <FiMessageCircle className="w-5 h-5" style={{ color: 'var(--accent-color)' }} />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-[#1C1426] dark:text-white">{toast.title}</p>
          {toast.message && (
            <p className="text-xs text-gray-600 dark:text-[#CFC0E6] mt-1 leading-relaxed">
              {toast.message}
            </p>
          )}
          {toast.actionLabel && (
            <button
              onClick={handleAction}
              className="mt-3 text-xs font-semibold text-[#7C3AED] dark:text-[#CAB0FF] hover:text-[#5B21B6] dark:hover:text-white transition-colors"
            >
              {toast.actionLabel}
            </button>
          )}
        </div>
        <button
          onClick={clearToast}
          aria-label="Cerrar notificación"
          className="text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors"
        >
          <FiX className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

export default NotificationToast

