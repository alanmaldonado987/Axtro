import React, { useEffect } from 'react'
import moment from 'moment/min/moment-with-locales'
import Markdown from 'react-markdown'
import Prism from 'prismjs'
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypePrism from "rehype-prism-plus";
import { useAppContext } from '../context/AppContext'

moment.locale('es')

const Message = ({ message }) => {
  const { user, personalizationSettings } = useAppContext()

  const getInitials = (name) => {
    if (!name) return 'U'
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const getUserAvatar = () => {
    if (user?.profilePicture) {
      return user.profilePicture
    }
    return null
  }

  useEffect(()=>{
    Prism.highlightAll();
  }, [message.content])

  const spacingStyle = {
    marginTop: 'calc(var(--message-gap) / 2)',
    marginBottom: 'calc(var(--message-gap) / 2)'
  }

  const bubbleBaseStyle = {
    padding: 'var(--message-padding)',
    borderRadius: 'var(--bubble-radius)'
  }

  const animationClass = personalizationSettings?.messageAnimations === 'gentle'
    ? 'animate-message-gentle'
    : personalizationSettings?.messageAnimations === 'fade'
      ? 'animate-message-fade'
      : ''

  const showTimestamps = personalizationSettings?.showTimestamps !== false

  return (
    <div>
      {message.role === 'user' ? (
        <div className={`flex items-start justify-end gap-2 ${animationClass}`} style={spacingStyle}>
          <div
            className='flex flex-col gap-2 border shadow-sm max-w-3xl text-right'
            style={{
              ...bubbleBaseStyle,
              background: 'var(--chat-user-bg)',
              borderColor: 'rgba(0,0,0,0.05)',
            }}
          >
            <p className='text-sm leading-relaxed' style={{ color: 'var(--chat-text-strong)' }}>
              {message.content}
            </p>
            {showTimestamps && (
              <span className='text-xs' style={{ color: 'var(--chat-text-strong)', opacity: 0.6 }}>
                {moment(message.timestamp).locale('es').fromNow()}
              </span>
            )}
          </div>
          {getUserAvatar() ? (
            <img
              src={getUserAvatar()}
              className='w-8 h-8 object-cover'
              style={{ borderRadius: personalizationSettings?.userAvatarStyle === 'square' ? '0.9rem' : '9999px' }}
              alt="Usuario"
            />
          ) : (
            <div
              className='w-8 h-8 flex items-center justify-center text-white text-xs font-bold'
              style={{
                borderRadius: personalizationSettings?.userAvatarStyle === 'square' ? '0.9rem' : '9999px',
                background: 'linear-gradient(135deg, var(--accent-color), var(--accent-color-strong))'
              }}
            >
              {getInitials(user?.name)}
            </div>
          )}
        </div>
      )
      :
      (
        <div
          className={`inline-flex flex-col gap-2 max-w-3xl border shadow-sm ${animationClass}`}
          style={{
            ...bubbleBaseStyle,
            ...spacingStyle,
            background: 'var(--chat-assistant-bg)',
            borderColor: 'rgba(124,58,237,0.18)'
          }}
        >
          {personalizationSettings?.showAssistantLabel && (
            <span
              className='text-[11px] font-semibold uppercase tracking-wide'
              style={{ color: 'var(--chat-text-strong)' }}
            >
              {personalizationSettings?.assistantName || 'Axtro'}
            </span>
          )}
          {message.isImage ? (
            <img src={message.content} className='w-full max-w-md mt-2 rounded-md' alt='' />
          ) : 
          (
            <div className="text-sm leading-relaxed reset-tw" style={{ color: 'var(--chat-text-strong)' }}>
              <Markdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw, rehypePrism]}
              >
                {message.content}
              </Markdown>
            </div>
          )
          }
          {showTimestamps && (
            <span className='text-xs' style={{ color: 'var(--chat-text-strong)', opacity: 0.6 }}>
              {moment(message.timestamp).locale('es').fromNow()}
            </span>
          )}
        </div>
      ) 
      }
    </div>
  )
}

export default Message
