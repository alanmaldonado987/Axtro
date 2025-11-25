import React, { useState } from 'react'
import { FiSettings, FiBell, FiClock, FiLock, FiUser, FiX, FiChevronDown, FiPlay, FiEye, FiEyeOff } from 'react-icons/fi'
import { useAppContext } from '../context/AppContext'
import { authService } from '../services/authService'

const Configuration = () => {
  const { navigate, theme, setTheme, user, setUser, fetchUser, logout } = useAppContext()
  const [activeSection, setActiveSection] = useState('general')
  const [settings, setSettings] = useState({
    aspecto: 'Sistema',
    colorAcento: 'Predeterminada',
    idioma: 'Automático',
    idiomaHablado: 'Automático',
    voz: 'Breeze'
  })

  // Estados para cambio de email
  const [emailForm, setEmailForm] = useState({
    newEmail: '',
    password: ''
  })
  const [emailLoading, setEmailLoading] = useState(false)
  const [emailError, setEmailError] = useState('')
  const [emailSuccess, setEmailSuccess] = useState('')
  const [showEmailPassword, setShowEmailPassword] = useState(false)

  // Estados para cambio de contraseña
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [passwordError, setPasswordError] = useState('')
  const [passwordSuccess, setPasswordSuccess] = useState('')
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [deleteForm, setDeleteForm] = useState({
    password: '',
    confirmText: ''
  })
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [deleteError, setDeleteError] = useState('')
  const [showDeletePassword, setShowDeletePassword] = useState(false)

  const menuItems = [
    { id: 'general', icon: FiSettings, label: 'General' },
    { id: 'notificaciones', icon: FiBell, label: 'Notificaciones' },
    { id: 'personalizacion', icon: FiClock, label: 'Personalización' },
    { id: 'seguridad', icon: FiLock, label: 'Seguridad' },
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

  // Manejar cambio de email
  const handleEmailChange = async (e) => {
    e.preventDefault()
    setEmailError('')
    setEmailSuccess('')

    if (!emailForm.newEmail || !emailForm.password) {
      setEmailError('Todos los campos son requeridos')
      return
    }

    setEmailLoading(true)
    try {
      const response = await authService.changeEmail(emailForm.newEmail, emailForm.password)
      if (response.success) {
        setEmailSuccess('Correo electrónico actualizado correctamente')
        setEmailForm({ newEmail: '', password: '' })
        // Actualizar usuario en el contexto
        if (response.user) {
          setUser(response.user)
        } else {
          await fetchUser()
        }
        setTimeout(() => setEmailSuccess(''), 3000)
      } else {
        setEmailError(response.message || 'Error al cambiar el correo')
      }
    } catch (error) {
      setEmailError('Error al cambiar el correo electrónico')
    } finally {
      setEmailLoading(false)
    }
  }

  // Manejar cambio de contraseña
  const handlePasswordChange = async (e) => {
    e.preventDefault()
    setPasswordError('')
    setPasswordSuccess('')

    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      setPasswordError('Todos los campos son requeridos')
      return
    }

    if (passwordForm.newPassword.length < 6) {
      setPasswordError('La nueva contraseña debe tener al menos 6 caracteres')
      return
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('Las contraseñas no coinciden')
      return
    }

    setPasswordLoading(true)
    try {
      const response = await authService.changePassword(passwordForm.currentPassword, passwordForm.newPassword)
      if (response.success) {
        setPasswordSuccess('Contraseña actualizada correctamente')
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
        setTimeout(() => setPasswordSuccess(''), 3000)
      } else {
        setPasswordError(response.message || 'Error al cambiar la contraseña')
      }
    } catch (error) {
      setPasswordError('Error al cambiar la contraseña')
    } finally {
      setPasswordLoading(false)
    }
  }

  // Manejar eliminación de cuenta
  const handleDeleteAccount = async (e) => {
    e.preventDefault()
    setDeleteError('')

    const isOAuthUser = user?.provider

    // Para usuarios OAuth, solo requiere confirmación de texto
    if (isOAuthUser) {
      if (deleteForm.confirmText !== 'ELIMINAR') {
        setDeleteError('Por favor escribe "ELIMINAR" para confirmar')
        return
      }
    } else {
      // Para usuarios normales, requiere contraseña y confirmación
      if (!deleteForm.password || deleteForm.confirmText !== 'ELIMINAR') {
        setDeleteError('Por favor completa todos los campos correctamente')
        return
      }
    }

    setDeleteLoading(true)
    try {
      const response = await authService.deleteAccount(deleteForm.password || null)
      if (response.success) {
        // Cerrar sesión y redirigir
        logout()
        navigate('/login?message=account_deleted')
      } else {
        setDeleteError(response.message || 'Error al eliminar la cuenta')
      }
    } catch (error) {
      setDeleteError('Error al eliminar la cuenta')
    } finally {
      setDeleteLoading(false)
    }
  }

  const renderSecuritySettings = () => {
    const isOAuthUser = user?.provider

    return (
      <div className="space-y-6 sm:space-y-8">
        {/* Cambiar correo electrónico */}
        <div className="border-b border-gray-200 dark:border-[#3B2A4F] pb-6">
          <h3 className="text-lg font-semibold text-[#1C1426] dark:text-[#E6CCFF] mb-2">
            Cambiar correo electrónico
          </h3>
          <p className="text-sm text-gray-600 dark:text-[#CFC0E6]/70 mb-4">
            {isOAuthUser 
              ? `Tu cuenta está vinculada con ${user.provider === 'google' ? 'Google' : 'Facebook'}. No puedes cambiar tu correo desde aquí.`
              : 'Actualiza tu dirección de correo electrónico. Se requiere tu contraseña actual para confirmar el cambio.'
            }
          </p>
          
          {!isOAuthUser && (
            <form onSubmit={handleEmailChange} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#1C1426] dark:text-[#E6CCFF] mb-2">
                  Nuevo correo electrónico
                </label>
                <input
                  type="email"
                  value={emailForm.newEmail}
                  onChange={(e) => setEmailForm({ ...emailForm, newEmail: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-[#3B2A4F] bg-white dark:bg-[#2B1B3D] text-[#1C1426] dark:text-[#E6CCFF] focus:outline-none focus:ring-2 focus:ring-[#7C3AED] dark:focus:ring-[#9B5CFF]"
                  placeholder="nuevo@correo.com"
                  disabled={emailLoading}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#1C1426] dark:text-[#E6CCFF] mb-2">
                  Contraseña actual
                </label>
                <div className="relative">
                  <input
                    type={showEmailPassword ? 'text' : 'password'}
                    value={emailForm.password}
                    onChange={(e) => setEmailForm({ ...emailForm, password: e.target.value })}
                    className="w-full px-4 py-2 pr-10 rounded-lg border border-gray-300 dark:border-[#3B2A4F] bg-white dark:bg-[#2B1B3D] text-[#1C1426] dark:text-[#E6CCFF] focus:outline-none focus:ring-2 focus:ring-[#7C3AED] dark:focus:ring-[#9B5CFF]"
                    placeholder="Ingresa tu contraseña actual"
                    disabled={emailLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowEmailPassword(!showEmailPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-[#CFC0E6] hover:text-[#7C3AED] dark:hover:text-[#9B5CFF]"
                  >
                    {showEmailPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {emailError && (
                <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                  <p className="text-sm text-red-600 dark:text-red-400">{emailError}</p>
                </div>
              )}

              {emailSuccess && (
                <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                  <p className="text-sm text-green-600 dark:text-green-400">{emailSuccess}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={emailLoading}
                className="px-6 py-2 rounded-lg bg-[#7C3AED] text-white hover:bg-[#6931C9] transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {emailLoading ? 'Actualizando...' : 'Actualizar correo'}
              </button>
            </form>
          )}
        </div>

        {/* Cambiar contraseña */}
        <div className="pb-6">
          <h3 className="text-lg font-semibold text-[#1C1426] dark:text-[#E6CCFF] mb-2">
            Cambiar contraseña
          </h3>
          <p className="text-sm text-gray-600 dark:text-[#CFC0E6]/70 mb-4">
            {isOAuthUser
              ? `Tu cuenta está vinculada con ${user.provider === 'google' ? 'Google' : 'Facebook'}. No puedes cambiar tu contraseña desde aquí.`
              : 'Actualiza tu contraseña. Se requiere tu contraseña actual para confirmar el cambio.'
            }
          </p>

          {!isOAuthUser && (
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#1C1426] dark:text-[#E6CCFF] mb-2">
                  Contraseña actual
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? 'text' : 'password'}
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                    className="w-full px-4 py-2 pr-10 rounded-lg border border-gray-300 dark:border-[#3B2A4F] bg-white dark:bg-[#2B1B3D] text-[#1C1426] dark:text-[#E6CCFF] focus:outline-none focus:ring-2 focus:ring-[#7C3AED] dark:focus:ring-[#9B5CFF]"
                    placeholder="Ingresa tu contraseña actual"
                    disabled={passwordLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-[#CFC0E6] hover:text-[#7C3AED] dark:hover:text-[#9B5CFF]"
                  >
                    {showCurrentPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1C1426] dark:text-[#E6CCFF] mb-2">
                  Nueva contraseña
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                    className="w-full px-4 py-2 pr-10 rounded-lg border border-gray-300 dark:border-[#3B2A4F] bg-white dark:bg-[#2B1B3D] text-[#1C1426] dark:text-[#E6CCFF] focus:outline-none focus:ring-2 focus:ring-[#7C3AED] dark:focus:ring-[#9B5CFF]"
                    placeholder="Mínimo 6 caracteres"
                    disabled={passwordLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-[#CFC0E6] hover:text-[#7C3AED] dark:hover:text-[#9B5CFF]"
                  >
                    {showNewPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1C1426] dark:text-[#E6CCFF] mb-2">
                  Confirmar nueva contraseña
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                    className="w-full px-4 py-2 pr-10 rounded-lg border border-gray-300 dark:border-[#3B2A4F] bg-white dark:bg-[#2B1B3D] text-[#1C1426] dark:text-[#E6CCFF] focus:outline-none focus:ring-2 focus:ring-[#7C3AED] dark:focus:ring-[#9B5CFF]"
                    placeholder="Confirma tu nueva contraseña"
                    disabled={passwordLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-[#CFC0E6] hover:text-[#7C3AED] dark:hover:text-[#9B5CFF]"
                  >
                    {showConfirmPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {passwordError && (
                <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                  <p className="text-sm text-red-600 dark:text-red-400">{passwordError}</p>
                </div>
              )}

              {passwordSuccess && (
                <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                  <p className="text-sm text-green-600 dark:text-green-400">{passwordSuccess}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={passwordLoading}
                className="px-6 py-2 rounded-lg bg-[#7C3AED] text-white hover:bg-[#6931C9] transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {passwordLoading ? 'Actualizando...' : 'Actualizar contraseña'}
              </button>
            </form>
          )}
        </div>

        {/* Eliminar cuenta */}
        <div className="border-t border-red-200 dark:border-red-800 pt-6">
          <h3 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-2">
            Eliminar cuenta
          </h3>
          <p className="text-sm text-gray-600 dark:text-[#CFC0E6]/70 mb-4">
            Esta acción es permanente e irreversible. Se eliminarán todos tus datos, chats y configuraciones. 
            {!isOAuthUser && ' Se requiere tu contraseña para confirmar.'}
          </p>

          <form onSubmit={handleDeleteAccount} className="space-y-4">
            {!isOAuthUser && (
              <div>
                <label className="block text-sm font-medium text-[#1C1426] dark:text-[#E6CCFF] mb-2">
                  Contraseña
                </label>
                <div className="relative">
                  <input
                    type={showDeletePassword ? 'text' : 'password'}
                    value={deleteForm.password}
                    onChange={(e) => setDeleteForm({ ...deleteForm, password: e.target.value })}
                    className="w-full px-4 py-2 pr-10 rounded-lg border border-red-300 dark:border-red-700 bg-white dark:bg-[#2B1B3D] text-[#1C1426] dark:text-[#E6CCFF] focus:outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-red-600"
                    placeholder="Ingresa tu contraseña"
                    disabled={deleteLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowDeletePassword(!showDeletePassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-[#CFC0E6] hover:text-red-600 dark:hover:text-red-400"
                  >
                    {showDeletePassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-[#1C1426] dark:text-[#E6CCFF] mb-2">
                Escribe <span className="font-bold text-red-600 dark:text-red-400">ELIMINAR</span> para confirmar
              </label>
              <input
                type="text"
                value={deleteForm.confirmText}
                onChange={(e) => setDeleteForm({ ...deleteForm, confirmText: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-red-300 dark:border-red-700 bg-white dark:bg-[#2B1B3D] text-[#1C1426] dark:text-[#E6CCFF] focus:outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-red-600"
                placeholder="ELIMINAR"
                disabled={deleteLoading}
              />
            </div>

            {deleteError && (
              <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                <p className="text-sm text-red-600 dark:text-red-400">{deleteError}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={deleteLoading}
              className="px-6 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {deleteLoading ? 'Eliminando...' : 'Eliminar cuenta'}
            </button>
          </form>
        </div>
      </div>
    )
  }

  const renderGeneralSettings = () => {
    return (
      <div className="space-y-4 sm:space-y-6">
        {/* Aspecto */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 py-3 border-b border-gray-200 dark:border-[#3B2A4F]">
          <span className="text-sm sm:text-base text-[#1C1426] dark:text-[#E6CCFF] font-medium">Aspecto</span>
          <div className="flex items-center gap-2">
            <span className="text-xs sm:text-sm text-[#6B4AA6] dark:text-[#CFC0E6]">{settings.aspecto}</span>
            <FiChevronDown className="text-[#6B4AA6] dark:text-[#CFC0E6] w-4 h-4" />
          </div>
        </div>

        {/* Color de acento */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 py-3 border-b border-gray-200 dark:border-[#3B2A4F]">
          <span className="text-sm sm:text-base text-[#1C1426] dark:text-[#E6CCFF] font-medium">Color de acento</span>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-gray-400 border border-gray-300 flex-shrink-0"></div>
            <span className="text-xs sm:text-sm text-[#6B4AA6] dark:text-[#CFC0E6]">{settings.colorAcento}</span>
            <FiChevronDown className="text-[#6B4AA6] dark:text-[#CFC0E6] w-4 h-4" />
          </div>
        </div>

        {/* Idioma */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 py-3 border-b border-gray-200 dark:border-[#3B2A4F]">
          <span className="text-sm sm:text-base text-[#1C1426] dark:text-[#E6CCFF] font-medium">Idioma</span>
          <div className="flex items-center gap-2">
            <span className="text-xs sm:text-sm text-[#6B4AA6] dark:text-[#CFC0E6]">{settings.idioma}</span>
            <FiChevronDown className="text-[#6B4AA6] dark:text-[#CFC0E6] w-4 h-4" />
          </div>
        </div>

        {/* Idioma hablado */}
        <div className="py-3 border-b border-gray-200 dark:border-[#3B2A4F]">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
            <span className="text-sm sm:text-base text-[#1C1426] dark:text-[#E6CCFF] font-medium">Idioma hablado</span>
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm text-[#6B4AA6] dark:text-[#CFC0E6]">{settings.idiomaHablado}</span>
              <FiChevronDown className="text-[#6B4AA6] dark:text-[#CFC0E6] w-4 h-4" />
            </div>
          </div>
          <p className="text-xs text-gray-500 dark:text-[#CFC0E6]/70 mt-2">
            Para obtener mejores resultados, selecciona el idioma principal. Si no está incluido, podría estar disponible a través de la detección automática.
          </p>
        </div>

        {/* Voz */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 py-3">
          <span className="text-sm sm:text-base text-[#1C1426] dark:text-[#E6CCFF] font-medium">Voz</span>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
            <button className="flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg bg-[#7C3AED] text-white hover:bg-[#6931C9] transition-colors cursor-pointer">
              <FiPlay className="w-3.5 h-3.5" />
              <span className="text-xs sm:text-sm font-medium">Reproducir</span>
            </button>
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm text-[#6B4AA6] dark:text-[#CFC0E6]">{settings.voz}</span>
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
      case 'seguridad':
        return renderSecuritySettings()
      case 'cuenta':
        return <div className="text-[#6B4AA6] dark:text-[#CFC0E6]">Configuración de cuenta</div>
      default:
        return renderGeneralSettings()
    }
  }

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 dark:bg-black/60 backdrop-blur-sm p-2 sm:p-4"
      onClick={handleClose}
    >
      <div 
        className="bg-white dark:bg-[#1C1426] rounded-2xl shadow-2xl w-full max-w-4xl h-[95vh] sm:h-[90vh] md:h-[80vh] max-h-[700px] flex flex-col md:flex-row overflow-hidden animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sidebar izquierdo */}
        <div className="w-full md:w-64 bg-white dark:bg-[#2B1B3D] border-b md:border-b-0 md:border-r border-gray-200 dark:border-[#3B2A4F] flex flex-col max-h-[40vh] md:max-h-none">
          {/* Botón cerrar y título en móvil */}
          <div className="p-4 border-b border-gray-200 dark:border-[#3B2A4F] flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#4C1D95] dark:text-[#E6CCFF] md:hidden">
              {menuItems.find(item => item.id === activeSection)?.label || 'General'}
            </h2>
            <button
              onClick={handleClose}
              className="text-[#4C1D95] dark:text-[#E6CCFF] hover:text-[#7C3AED] dark:hover:text-[#9B5CFF] transition-colors cursor-pointer ml-auto"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>

          {/* Menú de navegación */}
          <div className="flex-1 overflow-y-auto py-2 flex flex-row md:flex-col overflow-x-auto md:overflow-x-hidden">
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive = activeSection === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2 md:py-3 text-left transition-colors whitespace-nowrap md:w-full ${
                    isActive
                      ? 'bg-gray-100 dark:bg-[#3A2751] text-[#7C3AED] dark:text-[#9B5CFF]'
                      : 'text-[#1C1426] dark:text-[#E6CCFF] hover:bg-gray-50 dark:hover:bg-[#3B2A4F]'
                  }`}
                >
                  <Icon className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" />
                  <span className="text-xs md:text-sm font-medium">{item.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Área de contenido */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="p-4 sm:p-6 md:p-8 overflow-y-auto">
            <h2 className="text-xl sm:text-2xl font-bold text-[#4C1D95] dark:text-[#E6CCFF] mb-4 md:mb-6 hidden md:block">
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
