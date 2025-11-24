import React, { useEffect } from 'react'
import { assets } from '../assets/assets'
import moment from 'moment'
import Markdown from 'react-markdown'
import Prism from 'prismjs'
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypePrism from "rehype-prism-plus";

const Message = ({ message }) => {

  useEffect(()=>{
    Prism.highlightAll();
  }, [message.content])

  return (
    <div>
      {message.role === 'user' ? (
        <div className='flex items-start justify-end my-4 gap-2'>
          <div className='flex flex-col gap-2 p-2 px-4 bg-[#F4EEFF] dark:bg-[#2B1B3D] border border-[#E2D4FF] dark:border-[#3B2A4F] rounded-md max-w-2xl'>
            <p className='text-sm text-[#33204D] dark:text-[#E6CCFF]'>{message.content}</p>
            <span className='text-sm text-[#8C7AB5] dark:text-[#B1A6C0]'>{moment(message.timestamp).fromNow()}</span>
          </div>
          <img src={assets.user_icon} className='w-8 rounded-full' alt="" />
        </div>
      )
      :
      (
        <div className='inline-flex flex-col gap-2 p-2 px-4 max-w-2xl bg-[#F1E6FF] dark:bg-[#2B1B3D] border border-[#E2D4FF] dark:border-[#3B2A4F] rounded-md my-4'>
          {message.isImage ? (
            <img src={message.content} className='w-full max-w-md mt-2 rounded-md' alt='' />
          ) : 
          (
            <div className="text-sm text-[#33204D] dark:text-[#E6CCFF] reset-tw">
              <Markdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw, rehypePrism]}
              >
                {message.content}
              </Markdown>
            </div>
          )
          }
          <span className='text-xs text-[#8C7AB5] dark:text-[#B1A6C0]'>{moment(message.timestamp).fromNow()}</span>
        </div>
      ) 
      }
    </div>
  )
}

export default Message
