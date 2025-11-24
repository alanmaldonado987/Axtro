import React from 'react'
import { FiX, FiInfo, FiCode, FiHeart, FiUser, FiMail, FiGithub, FiLinkedin, FiInstagram } from 'react-icons/fi'

const Information = ({ isOpen, onClose }) => {
  if (!isOpen) return null

  return (
    <div 
      className='fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in'
      onClick={onClose}
    >
      <div 
        className='bg-white dark:bg-[#1C1426] rounded-2xl shadow-2xl max-w-lg w-full border border-[#E2D4FF] dark:border-[#3B2A4F] overflow-hidden animate-fade-in'
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className='flex items-center justify-between p-6 border-b border-[#E2D4FF] dark:border-[#3B2A4F] bg-[#F8F4FF] dark:bg-[#2B1B3D]'>
          <div className='flex items-center gap-3'>
            <div className='p-2 bg-[#7C3AED] rounded-lg'>
              <FiInfo className='text-white text-xl' />
            </div>
            <h2 className='text-xl font-bold text-[#4C1D95] dark:text-[#E6CCFF]'>Información de Axtro AI</h2>
          </div>
          <button
            onClick={onClose}
            className='p-2 hover:bg-[#E5D9FF] dark:hover:bg-[#3A2751] rounded-lg transition-colors cursor-pointer'
          >
            <FiX className='text-[#4C1D95] dark:text-[#E6CCFF] text-xl' />
          </button>
        </div>

        {/* Content */}
        <div className='p-6 space-y-4'>
          <div className='space-y-3'>
            <div className='flex items-start gap-3'>
              <FiCode className='text-[#7C3AED] text-lg mt-1 flex-shrink-0' />
              <div>
                <p className='text-sm font-semibold text-[#4C1D95] dark:text-[#E6CCFF] mb-1'>Versión</p>
                <p className='text-sm text-[#6B4AA6] dark:text-[#CFC0E6]'>1.0.0</p>
              </div>
            </div>

            <div className='flex items-start gap-3'>
              <FiInfo className='text-[#7C3AED] text-lg mt-1 flex-shrink-0' />
              <div>
                <p className='text-sm font-semibold text-[#4C1D95] dark:text-[#E6CCFF] mb-1'>Descripción</p>
                <p className='text-sm text-[#6B4AA6] dark:text-[#CFC0E6] leading-relaxed'>
                  Asistente de IA inteligente diseñado para ayudarte con tus tareas diarias, responder preguntas y potenciar tu productividad.
                </p>
              </div>
            </div>
          </div>

          <div className='pt-4 border-t border-[#E2D4FF] dark:border-[#3B2A4F]'>
            <div className='space-y-4'>
              <div className='flex items-center gap-2 text-[#6B4AA6] dark:text-[#CFC0E6]'>
                <FiHeart className='text-[#7C3AED]' />
                <p className='text-sm'>Desarrollado con ❤️ para mejorar tu productividad</p>
              </div>

              {/* Developer Info */}
              <div className='pt-3 space-y-3'>
                <div className='flex items-start gap-3'>
                  <FiUser className='text-[#7C3AED] text-lg mt-1 flex-shrink-0' />
                  <div>
                    <p className='text-sm font-semibold text-[#4C1D95] dark:text-[#E6CCFF] mb-1'>Desarrollador</p>
                    <p className='text-sm text-[#6B4AA6] dark:text-[#CFC0E6]'>Alan</p>
                  </div>
                </div>

                <div className='flex items-start gap-3'>
                  <FiMail className='text-[#7C3AED] text-lg mt-1 flex-shrink-0' />
                  <div>
                    <p className='text-sm font-semibold text-[#4C1D95] dark:text-[#E6CCFF] mb-1'>Contacto</p>
                    <a 
                      href='mailto:alanma407@hotmail.com' 
                      className='text-sm text-[#7C3AED] dark:text-[#BFA0FF] hover:underline'
                    >
                      alanma407@hotmail.com
                    </a>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div className='pt-3 border-t border-[#E2D4FF] dark:border-[#3B2A4F]'>
                <p className='text-sm font-semibold text-[#4C1D95] dark:text-[#E6CCFF] mb-3'>Síguenos en redes sociales</p>
                <div className='flex items-center gap-3'>
                  <a
                    href='https://github.com'
                    target='_blank'
                    rel='noopener noreferrer'
                    className='p-2.5 bg-[#F1E6FF] dark:bg-[#3A2751] hover:bg-[#E5D9FF] dark:hover:bg-[#4A2C67] rounded-lg transition-colors group'
                    title='GitHub'
                  >
                    <FiGithub className='text-[#4C1D95] dark:text-[#E6CCFF] text-lg group-hover:text-[#7C3AED] transition-colors' />
                  </a>
                  <a
                    href='https://linkedin.com'
                    target='_blank'
                    rel='noopener noreferrer'
                    className='p-2.5 bg-[#F1E6FF] dark:bg-[#3A2751] hover:bg-[#E5D9FF] dark:hover:bg-[#4A2C67] rounded-lg transition-colors group'
                    title='LinkedIn'
                  >
                    <FiLinkedin className='text-[#4C1D95] dark:text-[#E6CCFF] text-lg group-hover:text-[#7C3AED] transition-colors' />
                  </a>
                  <a
                    href='https://instagram.com'
                    target='_blank'
                    rel='noopener noreferrer'
                    className='p-2.5 bg-[#F1E6FF] dark:bg-[#3A2751] hover:bg-[#E5D9FF] dark:hover:bg-[#4A2C67] rounded-lg transition-colors group'
                    title='Instagram'
                  >
                    <FiInstagram className='text-[#4C1D95] dark:text-[#E6CCFF] text-lg group-hover:text-[#7C3AED] transition-colors' />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className='p-4 border-t border-[#E2D4FF] dark:border-[#3B2A4F] bg-[#F8F4FF] dark:bg-[#2B1B3D]'>
          <button
            onClick={onClose}
            className='w-full py-2.5 px-4 bg-[#7C3AED] hover:bg-[#6931C9] text-white font-semibold rounded-lg transition-colors text-sm cursor-pointer'
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  )
}

export default Information

