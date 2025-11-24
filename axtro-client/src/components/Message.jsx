import React, { useEffect } from 'react'
import { assets } from '../assets/assets'
import moment from 'moment/min/moment-with-locales'
import Markdown from 'react-markdown'
import Prism from 'prismjs'
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypePrism from "rehype-prism-plus";

moment.locale('es')

const Message = ({ message }) => {

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
          <img src={assets.user_icon} className='w-8 rounded-full' alt="" />
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
