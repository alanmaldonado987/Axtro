import React, { useEffect } from 'react'
import { assets } from '../assets/assets'
import moment from 'moment/min/moment-with-locales'
import Markdown from 'react-markdown'
import Prism from 'prismjs'
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypePrism from "rehype-prism-plus";
import { useAppContext } from '../context/AppContext'

moment.locale('es')

const Message = ({ message }) => {
  const { user } = useAppContext()

  // Obtener iniciales del nombre
  const getInitials = (name) => {
    if (!name) return 'U'
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  // Obtener avatar del usuario
  const getUserAvatar = () => {
    if (user?.profilePicture) {
      return user.profilePicture
    }
    return null
  }

  useEffect(()=>{
    Prism.highlightAll();
  }, [message.content])

  return (
    <div>
      {message.role === 'user' ? (
        <div className='flex items-start justify-end my-4 gap-2'>
          <div className='flex flex-col gap-2 p-3 px-5 bg-white dark:bg-[#2F1B45] border border-[#E2D4FF] dark:border-[#7C3AED]/40 rounded-2xl shadow-sm max-w-3xl text-right'>
            <p className='text-sm text-[#2F1B45] dark:text-white leading-relaxed'>{message.content}</p>
            <span className='text-xs text-[#9A8AB8] dark:text-[#D4C8F2]'>{moment(message.timestamp).locale('es').fromNow()}</span>
          </div>
          {getUserAvatar() ? (
            <img src={getUserAvatar()} className='w-8 h-8 rounded-full object-cover' alt="Usuario" />
          ) : (
            <div className='w-8 h-8 rounded-full bg-gradient-to-br from-[#7C3AED] to-[#9B5CFF] flex items-center justify-center text-white text-xs font-bold'>
              {getInitials(user?.name)}
            </div>
          )}
        </div>
      )
      :
      (
        <div className='inline-flex flex-col gap-2 p-3 px-5 max-w-3xl bg-[#F1E6FF] dark:bg-[#1B0F2B] border border-[#E2D4FF] dark:border-[#7C3AED]/30 rounded-2xl shadow-sm my-4'>
          {message.isImage ? (
            <img src={message.content} className='w-full max-w-md mt-2 rounded-md' alt='' />
          ) : 
          (
            <div className="text-sm text-[#2F1B45] dark:text-[#F2E9FF] leading-relaxed reset-tw">
              <Markdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw, rehypePrism]}
              >
                {message.content}
              </Markdown>
            </div>
          )
          }
          <span className='text-xs text-[#8C7AB5] dark:text-[#D4C8F2]'>{moment(message.timestamp).locale('es').fromNow()}</span>
        </div>
      ) 
      }
    </div>
  )
}

export default Message
