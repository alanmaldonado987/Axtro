import React, { useState } from 'react'
import { FiSettings, FiBell, FiClock, FiLink, FiDatabase, FiLock, FiUsers, FiUser, FiX, FiChevronDown, FiPlay } from 'react-icons/fi'
import { useAppContext } from '../context/AppContext'

const Configuration = () => {
  const { navigate, theme, setTheme } = useAppContext()
  const [activeSection, setActiveSection] = useState('general')
  const [settings, setSettings] = useState({
    aspecto: 'Sistema',
    colorAcento: 'Predeterminada',
    idioma: 'Automático',
    idiomaHablado: 'Automático',
    voz: 'Breeze'
  })

  const menuItems = [
    { id: 'general', icon: FiSettings, label: 'General' },
    { id: 'notificaciones', icon: FiBell, label: 'Notificaciones' },
    { id: 'personalizacion', icon: FiClock, label: 'Personalización' },
    { id: 'aplicaciones', icon: FiLink, label: 'Aplicaciones y conecto...' },
    { id: 'datos', icon: FiDatabase, label: 'Controles de datos' },
    { id: 'seguridad', icon: FiLock, label: 'Seguridad' },
    { id: 'parentales', icon: FiUsers, label: 'Controles parentales' },
    { id: 'cuenta', icon: FiUser, label: 'Cuenta' }
  ]

  const handleClose = () => {
    navigate('/')
  }

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const renderGeneralSettings = () => {
    return (
      <div className="space-y-6">
        {/* Aspecto */}
        <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-[#3B2A4F]">
          <span className="text-[#1C1426] dark:text-[#E6CCFF] font-medium">Aspecto</span>
          <div className="flex items-center gap-2">
            <span className="text-[#6B4AA6] dark:text-[#CFC0E6]">{settings.aspecto}</span>
            <FiChevronDown className="text-[#6B4AA6] dark:text-[#CFC0E6] w-4 h-4" />
          </div>
        </div>

        {/* Color de acento */}
        <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-[#3B2A4F]">
          <span className="text-[#1C1426] dark:text-[#E6CCFF] font-medium">Color de acento</span>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-gray-400 border border-gray-300"></div>
            <span className="text-[#6B4AA6] dark:text-[#CFC0E6]">{settings.colorAcento}</span>
            <FiChevronDown className="text-[#6B4AA6] dark:text-[#CFC0E6] w-4 h-4" />
          </div>
        </div>

        {/* Idioma */}
        <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-[#3B2A4F]">
          <span className="text-[#1C1426] dark:text-[#E6CCFF] font-medium">Idioma</span>
          <div className="flex items-center gap-2">
            <span className="text-[#6B4AA6] dark:text-[#CFC0E6]">{settings.idioma}</span>
            <FiChevronDown className="text-[#6B4AA6] dark:text-[#CFC0E6] w-4 h-4" />
          </div>
        </div>

        {/* Idioma hablado */}
        <div className="py-3 border-b border-gray-200 dark:border-[#3B2A4F]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[#1C1426] dark:text-[#E6CCFF] font-medium">Idioma hablado</span>
            <div className="flex items-center gap-2">
              <span className="text-[#6B4AA6] dark:text-[#CFC0E6]">{settings.idiomaHablado}</span>
              <FiChevronDown className="text-[#6B4AA6] dark:text-[#CFC0E6] w-4 h-4" />
            </div>
          </div>
          <p className="text-xs text-gray-500 dark:text-[#CFC0E6]/70 mt-2">
            Para obtener mejores resultados, selecciona el idioma principal. Si no está incluido, podría estar disponible a través de la detección automática.
          </p>
        </div>

        {/* Voz */}
        <div className="flex items-center justify-between py-3">
          <span className="text-[#1C1426] dark:text-[#E6CCFF] font-medium">Voz</span>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#7C3AED] text-white hover:bg-[#6931C9] transition-colors cursor-pointer">
              <FiPlay className="w-3.5 h-3.5" />
              <span className="text-sm font-medium">Reproducir</span>
            </button>
            <div className="flex items-center gap-2">
              <span className="text-[#6B4AA6] dark:text-[#CFC0E6]">{settings.voz}</span>
              <FiChevronDown className="text-[#6B4AA6] dark:text-[#CFC0E6] w-4 h-4" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderContent = () => {
    switch (activeSection) {
      case 'general':
        return renderGeneralSettings()
      case 'notificaciones':
        return <div className="text-[#6B4AA6] dark:text-[#CFC0E6]">Configuración de notificaciones</div>
      case 'personalizacion':
        return <div className="text-[#6B4AA6] dark:text-[#CFC0E6]">Configuración de personalización</div>
      case 'aplicaciones':
        return <div className="text-[#6B4AA6] dark:text-[#CFC0E6]">Aplicaciones y conexiones</div>
      case 'datos':
        return <div className="text-[#6B4AA6] dark:text-[#CFC0E6]">Controles de datos</div>
      case 'seguridad':
        return <div className="text-[#6B4AA6] dark:text-[#CFC0E6]">Configuración de seguridad</div>
      case 'parentales':
        return <div className="text-[#6B4AA6] dark:text-[#CFC0E6]">Controles parentales</div>
      case 'cuenta':
        return <div className="text-[#6B4AA6] dark:text-[#CFC0E6]">Configuración de cuenta</div>
      default:
        return renderGeneralSettings()
    }
  }

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 dark:bg-black/60 backdrop-blur-sm"
      onClick={handleClose}
    >
      <div 
        className="bg-white dark:bg-[#1C1426] rounded-2xl shadow-2xl w-full max-w-4xl h-[80vh] max-h-[700px] flex overflow-hidden animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sidebar izquierdo */}
        <div className="w-64 bg-white dark:bg-[#2B1B3D] border-r border-gray-200 dark:border-[#3B2A4F] flex flex-col">
          {/* Botón cerrar */}
          <div className="p-4 border-b border-gray-200 dark:border-[#3B2A4F]">
            <button
              onClick={handleClose}
              className="text-[#4C1D95] dark:text-[#E6CCFF] hover:text-[#7C3AED] dark:hover:text-[#9B5CFF] transition-colors cursor-pointer"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>

          {/* Menú de navegación */}
          <div className="flex-1 overflow-y-auto py-2">
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive = activeSection === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                    isActive
                      ? 'bg-gray-100 dark:bg-[#3A2751] text-[#7C3AED] dark:text-[#9B5CFF]'
                      : 'text-[#1C1426] dark:text-[#E6CCFF] hover:bg-gray-50 dark:hover:bg-[#3B2A4F]'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{item.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Área de contenido */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="p-8 overflow-y-auto">
            <h2 className="text-2xl font-bold text-[#4C1D95] dark:text-[#E6CCFF] mb-6">
              {menuItems.find(item => item.id === activeSection)?.label || 'General'}
            </h2>
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Configuration
