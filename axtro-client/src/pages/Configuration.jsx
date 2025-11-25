import React, { useState } from 'react'
import { FiSettings, FiBell, FiClock, FiLock, FiUser, FiX, FiPlay, FiEye, FiEyeOff } from 'react-icons/fi'
import { useAppContext } from '../context/AppContext'
import { authService } from '../services/authService'

const Configuration = () => {
  const { navigate, theme, setTheme, user, setUser, fetchUser, logout, notificationSettings, setNotificationSettings, personalizationSettings, updatePersonalization, assistantSettings, updateAssistantSettings } = useAppContext()
  const [activeSection, setActiveSection] = useState('general')

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

  const accentOptions = [
    {
      id: 'violet',
      name: 'Atelier violeta',
      description: 'Morados editoriales con matices lavanda, ideal para interfaces elegantes.',
      colors: ['#7C3AED', '#9B5CFF', '#F1E6FF']
    },
    {
      id: 'emerald',
      name: 'Bruma esmeralda',
      description: 'Verdes frescos con acentos azulados que combinan con fondos degradados.',
      colors: ['#0CA678', '#34D399', '#E6FCF5']
    },
    {
      id: 'sunset',
      name: 'Atardecer cítrico',
      description: 'Naranjas suaves con reflejos dorados para experiencias cálidas.',
      colors: ['#F97316', '#FB923C', '#FFF4E6']
    },
    {
      id: 'sand',
      name: 'Costa terracota',
      description: 'Arena y arcilla inspiradas en papel artesanal y tipografías redondeadas.',
      colors: ['#F4A261', '#E9C46A', '#FDF4E3']
    },
    {
      id: 'ocean',
      name: 'Lago boreal',
      description: 'Azules fríos que funcionan con fondos translúcidos o vítreos.',
      colors: ['#2563EB', '#60A5FA', '#E0EDFF']
    },
    {
      id: 'slate',
      name: 'Blueprint nocturno',
      description: 'Grafitos profundos con texto claro, perfecto para modo enfoque.',
      colors: ['#0F172A', '#334155', '#CBD5F5']
    },
    {
      id: 'neon',
      name: 'Neón táctico',
      description: 'Verdes eléctricos con contraste oscuro para dashboards futuristas.',
      colors: ['#00FFD1', '#42A5F5', '#1E1C3B']
    }
  ]

  const backgroundOptions = [
    {
      id: 'soft',
      label: 'Bruma suave',
      description: 'Base neutra ligeramente lavanda para layouts editoriales.',
      preview: 'linear-gradient(135deg,#F8F5FF,#FFFFFF)'
    },
    {
      id: 'gradient',
      label: 'Aurora degradada',
      description: 'Degradé atmosférico inspirado en cielos polares.',
      preview: 'linear-gradient(135deg,#C084FC,#67E8F9)'
    },
    {
      id: 'paper',
      label: 'Papel artesanal',
      description: 'Textura fibrosa con matiz crema para tonos cálidos.',
      preview: 'repeating-linear-gradient(45deg,#FFF8ED 0 10px,#F5E8D8 10px 20px)'
    },
    {
      id: 'glass',
      label: 'Panel translúcido',
      description: 'Efecto vidrio helado que resalta acentos saturados.',
      preview: 'linear-gradient(120deg,rgba(255,255,255,0.6),rgba(255,255,255,0.2))'
    },
    {
      id: 'darkfabric',
      label: 'Lona nocturna',
      description: 'Fondo oscuro texturizado pensado para tonos grafito.',
      preview: 'radial-gradient(circle,#1A1026 0%,#08050E 100%)'
    },
    {
      id: 'mesh',
      label: 'Mesh experimental',
      description: 'Manchas orgánicas vibrantes para temas neón.',
      preview: 'radial-gradient(circle at 20% 20%,rgba(0,255,209,0.3),transparent 45%),radial-gradient(circle at 70% 0,rgba(91,33,182,0.35),transparent 40%)'
    }
  ]

  const themePresets = [
    {
      id: 'atelier-editorial',
      name: 'Atelier editorial',
      description: 'Morados elegantes, fondo bruma suave y serif moderna para lecturas largas.',
      accentPreset: 'violet',
      backgroundStyle: 'soft',
      fontFamily: 'serif',
      fontScale: 'medium',
      bubbleShape: 'rounded',
      messageDensity: 'comfortable',
      messageAnimations: 'gentle',
      notificationSound: 'soft',
      preview: ['#7C3AED', '#F1E6FF', '#4C1D95']
    },
    {
      id: 'aurora-boreal',
      name: 'Aurora boreal',
      description: 'Verdes frescos + degradé polar y tipografía geométrica.',
      accentPreset: 'emerald',
      backgroundStyle: 'gradient',
      fontFamily: 'outfit',
      fontScale: 'medium',
      bubbleShape: 'rounded',
      messageDensity: 'comfortable',
      messageAnimations: 'gentle',
      notificationSound: 'soft',
      preview: ['#34D399', '#67E8F9', '#0F172A']
    },
    {
      id: 'costa-terracota',
      name: 'Costa terracota',
      description: 'Naranjas suaves, textura papel y Poppins para tono cálido y cercano.',
      accentPreset: 'sand',
      backgroundStyle: 'paper',
      fontFamily: 'poppins',
      fontScale: 'large',
      bubbleShape: 'standard',
      messageDensity: 'relaxed',
      messageAnimations: 'gentle',
      notificationSound: 'soft',
      preview: ['#F4A261', '#FEEED8', '#7B341E']
    },
    {
      id: 'midnight-blueprint',
      name: 'Midnight blueprint',
      description: 'Grafitos profundos sobre lona nocturna con Inter compacta.',
      accentPreset: 'slate',
      backgroundStyle: 'darkfabric',
      fontFamily: 'inter',
      fontScale: 'small',
      bubbleShape: 'minimal',
      messageDensity: 'compact',
      messageAnimations: 'fade',
      notificationSound: 'chime',
      preview: ['#0F172A', '#1E1B4B', '#E2E8F0']
    },
    {
      id: 'laguna-bruma',
      name: 'Laguna bruma',
      description: 'Azules frescos con panel translúcido y Outfit equilibrada.',
      accentPreset: 'ocean',
      backgroundStyle: 'glass',
      fontFamily: 'outfit',
      fontScale: 'medium',
      bubbleShape: 'rounded',
      messageDensity: 'comfortable',
      messageAnimations: 'fade',
      notificationSound: 'chime',
      preview: ['#2563EB', '#9EB9FF', '#0B2257']
    },
  ]

  const fontOptions = [
    { id: 'outfit', label: 'Outfit' },
    { id: 'inter', label: 'Inter' },
    { id: 'poppins', label: 'Poppins' },
    { id: 'serif', label: 'Serif clásica' },
    { id: 'mono', label: 'Monoespaciada' }
  ]

  const fontScaleOptions = [
    { id: 'small', label: 'Pequeña' },
    { id: 'medium', label: 'Media' },
    { id: 'large', label: 'Grande' }
  ]

  const densityOptions = [
    { id: 'compact', label: 'Compacto' },
    { id: 'comfortable', label: 'Cómodo' },
    { id: 'relaxed', label: 'Amplio' }
  ]

  const bubbleOptions = [
    { id: 'rounded', label: 'Redondeado' },
    { id: 'standard', label: 'Clásico' },
    { id: 'minimal', label: 'Cuadrado' }
  ]

  const animationOptions = [
    { id: 'gentle', label: 'Suave' },
    { id: 'fade', label: 'Deslizar' },
    { id: 'none', label: 'Sin animación' }
  ]

  const soundOptions = [
    { id: 'soft', label: 'Sutil' },
    { id: 'chime', label: 'Campana' },
    { id: 'off', label: 'Silenciar' }
  ]

  const sendOptions = [
    { id: 'enter', label: 'Enter para enviar' },
    { id: 'ctrlEnter', label: 'Ctrl/Cmd + Enter' }
  ]

  const avatarOptions = [
    { id: 'circle', label: 'Circular' },
    { id: 'square', label: 'Cuadrado' }
  ]

  const assistantLanguageOptions = [
    { id: 'auto', label: 'Detectar automáticamente' },
    { id: 'es', label: 'Español' },
    { id: 'en', label: 'Inglés' },
    { id: 'pt', label: 'Portugués' },
    { id: 'fr', label: 'Francés' }
  ]

  const toneOptions = [
    { id: 'cercano', label: 'Cercano' },
    { id: 'neutral', label: 'Neutro' },
    { id: 'entusiasta', label: 'Entusiasta' },
    { id: 'formal', label: 'Formal' }
  ]

  const speakingStyleOptions = [
    { id: 'equilibrado', label: 'Equilibrado' },
    { id: 'resolutivo', label: 'Resolutivo' },
    { id: 'creativo', label: 'Creativo' },
    { id: 'mentor', label: 'Mentor' }
  ]

  const verbosityOptions = [
    { id: 'conciso', label: 'Conciso' },
    { id: 'balanceado', label: 'Balanceado' },
    { id: 'detallado', label: 'Detallado' }
  ]

  const menuItems = [
    { id: 'general', icon: FiSettings, label: 'General' },
    { id: 'notificaciones', icon: FiBell, label: 'Notificaciones' },
    { id: 'personalizacion', icon: FiClock, label: 'Personalización' },
    { id: 'seguridad', icon: FiLock, label: 'Seguridad' }
  ]

  const handleClose = () => {
    navigate('/')
  }

  const handleNotificationToggle = (key) => {
    setNotificationSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  const handleThemePresetApply = (preset) => {
    updatePersonalization({
      themePreset: preset.id,
      accentPreset: preset.accentPreset,
      backgroundStyle: preset.backgroundStyle,
      fontFamily: preset.fontFamily,
      fontScale: preset.fontScale,
      bubbleShape: preset.bubbleShape,
      messageDensity: preset.messageDensity,
      messageAnimations: preset.messageAnimations,
      notificationSound: preset.notificationSound
    })
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

  const renderNotificationSettings = () => {
    return (
      <div className="space-y-6 sm:space-y-8">
        <div className="border border-gray-200 dark:border-[#3B2A4F] rounded-2xl p-4 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-[#1C1426] dark:text-[#E6CCFF]">Alertas de nuevos mensajes</h3>
              <p className="text-sm text-gray-600 dark:text-[#CFC0E6]/70 mt-1">
                Recibe una notificación emergente cuando Axtro responda en un chat que no estás viendo.
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleNotificationToggle('newMessageAlerts')}
              className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${notificationSettings?.newMessageAlerts ? 'bg-[#7C3AED]' : 'bg-gray-300 dark:bg-[#3B2A4F]'}`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${notificationSettings?.newMessageAlerts ? 'translate-x-5' : 'translate-x-1'}`}
              />
            </button>
          </div>
          {notificationSettings?.newMessageAlerts && (
            <div className="mt-4 rounded-xl bg-[#F3E8FF] dark:bg-[#2B1B3D] border border-[#E2D4FF]/60 dark:border-[#3B2A4F] p-4 text-sm text-[#4C1D95] dark:text-[#E6CCFF]">
              Te mostraremos un aviso en la esquina inferior derecha y podrás volver al chat con un clic.
            </div>
          )}
        </div>

        <div className="border border-gray-200 dark:border-[#3B2A4F] rounded-2xl p-4 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-[#1C1426] dark:text-[#E6CCFF]">Correos de actualizaciones</h3>
              <p className="text-sm text-gray-600 dark:text-[#CFC0E6]/70 mt-1">
                Mantente al día con nuevas funciones, lanzamientos y mejoras importantes en la plataforma.
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleNotificationToggle('emailUpdates')}
              className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${notificationSettings?.emailUpdates ? 'bg-[#7C3AED]' : 'bg-gray-300 dark:bg-[#3B2A4F]'}`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${notificationSettings?.emailUpdates ? 'translate-x-5' : 'translate-x-1'}`}
              />
            </button>
          </div>
          <ul className="mt-4 space-y-2 text-sm text-gray-600 dark:text-[#CFC0E6]/80">
            <li>• Lanzamientos de productos y nuevas herramientas.</li>
            <li>• Consejos para aprovechar mejor Axtro.</li>
            <li>• Invitaciones anticipadas a betas cerradas.</li>
          </ul>
        </div>
      </div>
    )
  }

  const renderPersonalizationSettings = () => {
    return (
      <div className="space-y-6 sm:space-y-8">
        {/* Temas rápidos */}
        <div className="border border-gray-200 dark:border-[#3B2A4F] rounded-2xl p-4 sm:p-6 space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-[#1C1426] dark:text-[#E6CCFF]">Temas inteligentes</h3>
              <p className="text-sm text-gray-600 dark:text-[#CFC0E6]/70">Combos modernos con colores, fondos y tipografías preseleccionadas.</p>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {themePresets.map(preset => {
              const isActive = personalizationSettings?.themePreset === preset.id
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleThemePresetApply(preset)}
                  className={`text-left p-4 rounded-2xl border transition-colors ${isActive ? 'border-[#7C3AED] bg-[#F5EDFF]' : 'border-gray-200 dark:border-[#3B2A4F] hover:border-[#CBB5FF]'}`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-base font-semibold text-[#1C1426] dark:text-white">{preset.name}</p>
                      <p className="text-sm text-gray-600 dark:text-[#CFC0E6]/70 mt-1">{preset.description}</p>
                    </div>
                    <span className="text-xs px-3 py-1 rounded-full bg-[#7C3AED]/10 text-[#7C3AED] dark:text-[#E6CCFF]">
                      {isActive ? 'Activo' : 'Aplicar'}
                    </span>
                  </div>
                  <div className="flex gap-2 mt-4">
                    {preset.preview.map(color => (
                      <span key={color} className="w-8 h-8 rounded-xl border border-white/40 shadow-sm" style={{ background: color }} />
                    ))}
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Tema y colores */}
        <div className="border border-gray-200 dark:border-[#3B2A4F] rounded-2xl p-4 sm:p-6 space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-[#1C1426] dark:text-[#E6CCFF]">Colores destacados</h3>
              <p className="text-sm text-gray-600 dark:text-[#CFC0E6]/70">Elige la personalidad visual del chat y cómo se resaltan los elementos.</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {accentOptions.map(option => {
              const isActive = personalizationSettings?.accentPreset === option.id
              return (
                <button
                  key={option.id}
                  onClick={() => updatePersonalization({ accentPreset: option.id })}
                  className={`p-4 rounded-2xl border transition-colors text-left ${isActive ? 'border-[#7C3AED] bg-[#F5EDFF]' : 'border-gray-200 dark:border-[#3B2A4F] hover:border-[#CBB5FF]'}`}
                >
                  <p className="font-semibold text-[#1C1426] dark:text-white">{option.name}</p>
                  <p className="text-xs text-gray-600 dark:text-[#CFC0E6]/80 mt-1">{option.description}</p>
                  <div className="flex gap-2 mt-3">
                    {option.colors.map(color => (
                      <span key={color} className="w-4 h-4 rounded-full border border-white shadow" style={{ background: color }}></span>
                    ))}
                  </div>
                </button>
              )
            })}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {backgroundOptions.map(option => {
              const isActive = personalizationSettings?.backgroundStyle === option.id
              return (
                <button
                  key={option.id}
                  onClick={() => updatePersonalization({ backgroundStyle: option.id })}
                  className={`text-left p-4 rounded-2xl border transition-colors ${isActive ? 'border-[#7C3AED] bg-[#F5EDFF]' : 'border-gray-200 dark:border-[#3B2A4F] hover:border-[#CBB5FF]'}`}
                >
                  <div
                    className="h-16 rounded-xl border border-white/40 shadow-inner"
                    style={{ background: option.preview, backgroundSize: 'cover' }}
                  />
                  <p className="font-semibold text-[#1C1426] dark:text-white mt-3">{option.label}</p>
                  <p className="text-xs text-gray-600 dark:text-[#CFC0E6]/80 mt-1">{option.description}</p>
                </button>
              )
            })}
          </div>
        </div>

        {/* Tipografía */}
        <div className="border border-gray-200 dark:border-[#3B2A4F] rounded-2xl p-4 sm:p-6 space-y-4">
          <h3 className="text-lg font-semibold text-[#1C1426] dark:text-[#E6CCFF]">Tipografía y tamaño</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-[#1C1426] dark:text-[#E6CCFF] mb-2 block">Fuente</label>
              <select
                value={personalizationSettings?.fontFamily}
                onChange={(e) => updatePersonalization({ fontFamily: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-[#3B2A4F] bg-white dark:bg-[#2B1B3D] text-sm text-[#1C1426] dark:text-white"
              >
                {fontOptions.map(option => (
                  <option key={option.id} value={option.id}>{option.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-[#1C1426] dark:text-[#E6CCFF] mb-2 block">Escala</label>
              <div className="flex gap-2 flex-wrap">
                {fontScaleOptions.map(option => {
                  const isActive = personalizationSettings?.fontScale === option.id
                  return (
                    <button
                      key={option.id}
                      onClick={() => updatePersonalization({ fontScale: option.id })}
                      className={`flex-1 min-w-[110px] px-3 py-2 rounded-xl border text-sm font-medium transition ${isActive ? 'bg-[#7C3AED] text-white border-[#7C3AED]' : 'border-gray-300 dark:border-[#3B2A4F] text-[#4C1D95] dark:text-white'}`}
                    >
                      {option.label}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Diseño y densidad */}
        <div className="border border-gray-200 dark:border-[#3B2A4F] rounded-2xl p-4 sm:p-6 space-y-4">
          <h3 className="text-lg font-semibold text-[#1C1426] dark:text-[#E6CCFF]">Diseño del chat</h3>
          <div>
            <p className="text-sm text-gray-600 dark:text-[#CFC0E6]/70 mb-2">Densidad de mensajes</p>
            <div className="flex flex-wrap gap-2">
              {densityOptions.map(option => {
                const isActive = personalizationSettings?.messageDensity === option.id
                return (
                  <button
                    key={option.id}
                    onClick={() => updatePersonalization({ messageDensity: option.id })}
                    className={`px-4 py-2 rounded-full border text-sm font-medium transition ${isActive ? 'bg-[#7C3AED] text-white border-[#7C3AED]' : 'border-gray-300 dark:border-[#3B2A4F] text-[#4C1D95] dark:text-white'}`}
                  >
                    {option.label}
                  </button>
                )
              })}
            </div>
          </div>
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-3 text-sm text-[#1C1426] dark:text-[#E6CCFF]">
              <input
                type="checkbox"
                checked={personalizationSettings?.showTimestamps !== false}
                onChange={() => updatePersonalization({ showTimestamps: personalizationSettings?.showTimestamps === false })}
                className="rounded border-gray-300 text-[#7C3AED] focus:ring-[#7C3AED]"
              />
              Mostrar horas en cada mensaje
            </label>
            <label className="flex items-center gap-3 text-sm text-[#1C1426] dark:text-[#E6CCFF]">
              <input
                type="checkbox"
                checked={personalizationSettings?.sidebarPosition === 'right'}
                onChange={() => updatePersonalization({ sidebarPosition: personalizationSettings?.sidebarPosition === 'right' ? 'left' : 'right' })}
                className="rounded border-gray-300 text-[#7C3AED] focus:ring-[#7C3AED]"
              />
              Fijar menú a la derecha
            </label>
          </div>
        </div>

        {/* Alias y burbujas */}
        <div className="border border-gray-200 dark:border-[#3B2A4F] rounded-2xl p-4 sm:p-6 space-y-4">
          <h3 className="text-lg font-semibold text-[#1C1426] dark:text-[#E6CCFF]">Alias y burbujas</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-[#1C1426] dark:text-[#E6CCFF] mb-2 block">Nombre de la IA</label>
              <input
                type="text"
                value={personalizationSettings?.assistantName || ''}
                onChange={(e) => updatePersonalization({ assistantName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-[#3B2A4F] bg-white dark:bg-[#2B1B3D] text-sm text-[#1C1426] dark:text-white"
                placeholder="Escribe un alias"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-[#1C1426] dark:text-[#E6CCFF]">Mostrar etiqueta</label>
              <label className="flex items-center gap-3 text-sm text-[#1C1426] dark:text-[#E6CCFF]">
                <input
                  type="checkbox"
                  checked={personalizationSettings?.showAssistantLabel}
                  onChange={() => updatePersonalization({ showAssistantLabel: !personalizationSettings?.showAssistantLabel })}
                  className="rounded border-gray-300 text-[#7C3AED] focus:ring-[#7C3AED]"
                />
                Mostrar el nombre sobre cada respuesta
              </label>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            {avatarOptions.map(option => {
              const isActive = personalizationSettings?.userAvatarStyle === option.id
              return (
                <button
                  key={option.id}
                  onClick={() => updatePersonalization({ userAvatarStyle: option.id })}
                  className={`px-4 py-2 rounded-full border text-sm font-medium transition ${isActive ? 'bg-[#7C3AED] text-white border-[#7C3AED]' : 'border-gray-300 dark:border-[#3B2A4F] text-[#4C1D95] dark:text-white'}`}
                >
                  Avatar {option.label}
                </button>
              )
            })}
            {bubbleOptions.map(option => {
              const isActive = personalizationSettings?.bubbleShape === option.id
              return (
                <button
                  key={option.id}
                  onClick={() => updatePersonalization({ bubbleShape: option.id })}
                  className={`px-4 py-2 rounded-full border text-sm font-medium transition ${isActive ? 'bg-[#7C3AED] text-white border-[#7C3AED]' : 'border-gray-300 dark:border-[#3B2A4F] text-[#4C1D95] dark:text-white'}`}
                >
                  Burbujas {option.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Animaciones, sonido y atajos */}
        <div className="border border-gray-200 dark:border-[#3B2A4F] rounded-2xl p-4 sm:p-6 space-y-4">
          <h3 className="text-lg font-semibold text-[#1C1426] dark:text-[#E6CCFF]">Animaciones y sonido</h3>
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-[#1C1426] dark:text-[#E6CCFF] mb-2 block">Animación</label>
              <select
                value={personalizationSettings?.messageAnimations}
                onChange={(e) => updatePersonalization({ messageAnimations: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-[#3B2A4F] bg-white dark:bg-[#2B1B3D] text-sm text-[#1C1426] dark:text-white"
              >
                {animationOptions.map(option => (
                  <option key={option.id} value={option.id}>{option.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-[#1C1426] dark:text-[#E6CCFF] mb-2 block">Sonido al responder</label>
              <select
                value={personalizationSettings?.notificationSound}
                onChange={(e) => updatePersonalization({ notificationSound: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-[#3B2A4F] bg-white dark:bg-[#2B1B3D] text-sm text-[#1C1426] dark:text-white"
              >
                {soundOptions.map(option => (
                  <option key={option.id} value={option.id}>{option.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-[#1C1426] dark:text-[#E6CCFF] mb-2 block">Atajo para enviar</label>
              <select
                value={personalizationSettings?.sendBehavior}
                onChange={(e) => updatePersonalization({ sendBehavior: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-[#3B2A4F] bg-white dark:bg-[#2B1B3D] text-sm text-[#1C1426] dark:text-white"
              >
                {sendOptions.map(option => (
                  <option key={option.id} value={option.id}>{option.label}</option>
                ))}
              </select>
              <p className="text-xs text-gray-500 dark:text-[#CFC0E6]/60 mt-1">
                Perfecto si prefieres escribir varias líneas antes de enviar.
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderGeneralSettings = () => {
    return (
      <div className="space-y-6 sm:space-y-8">
        <div className="border border-gray-200 dark:border-[#3B2A4F] rounded-2xl p-4 sm:p-6 space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-[#1C1426] dark:text-[#E6CCFF]">Idioma de respuestas</h3>
              <p className="text-sm text-gray-600 dark:text-[#CFC0E6]/70">Elige en qué idioma prefieres que Axtro responda, sin cambiar la interfaz.</p>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-[#1C1426] dark:text-[#E6CCFF] mb-2 block">Idioma principal</label>
              <select
                value={assistantSettings?.responseLanguage}
                onChange={(e) => updateAssistantSettings({ responseLanguage: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-[#3B2A4F] bg-white dark:bg-[#2B1B3D] text-sm text-[#1C1426] dark:text-white"
              >
                {assistantLanguageOptions.map(option => (
                  <option key={option.id} value={option.id}>{option.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-[#1C1426] dark:text-[#E6CCFF] mb-2 block">Temperatura creativa</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={assistantSettings?.temperature ?? 0.65}
                onChange={(e) => updateAssistantSettings({ temperature: parseFloat(e.target.value) })}
                className="w-full accent-[#7C3AED]"
              />
              <p className="text-xs text-gray-500 dark:text-[#CFC0E6]/70 mt-1">
                {(assistantSettings?.temperature ?? 0.65).toFixed(2)} — valores bajos priorizan precisión, altos fomentan ideas creativas.
              </p>
            </div>
          </div>
        </div>

        <div className="border border-gray-200 dark:border-[#3B2A4F] rounded-2xl p-4 sm:p-6 space-y-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-[#1C1426] dark:text-[#E6CCFF]">Configuraciones de la IA</h3>
              <p className="text-sm text-gray-600 dark:text-[#CFC0E6]/70">Define cómo quieres que se exprese Axtro en cada proyecto.</p>
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-600 dark:text-[#CFC0E6]/70 mb-2">Tono y actitud</p>
            <div className="flex flex-wrap gap-2">
              {toneOptions.map(option => {
                const isActive = assistantSettings?.tone === option.id
                return (
                  <button
                    key={option.id}
                    onClick={() => updateAssistantSettings({ tone: option.id })}
                    className={`px-4 py-2 rounded-full border text-sm font-medium transition ${isActive ? 'bg-[#7C3AED] text-white border-[#7C3AED]' : 'border-gray-300 dark:border-[#3B2A4F] text-[#4C1D95] dark:text-white'}`}
                  >
                    {option.label}
                  </button>
                )
              })}
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-600 dark:text-[#CFC0E6]/70 mb-2">Modo de colaboración</p>
            <div className="grid sm:grid-cols-2 gap-2">
              {speakingStyleOptions.map(option => {
                const isActive = assistantSettings?.speakingStyle === option.id
                return (
                  <button
                    key={option.id}
                    onClick={() => updateAssistantSettings({ speakingStyle: option.id })}
                    className={`p-3 rounded-2xl border text-left transition ${isActive ? 'border-[#7C3AED] bg-[#F5EDFF]' : 'border-gray-200 dark:border-[#3B2A4F] hover:border-[#CBB5FF]'}`}
                  >
                    <p className="font-medium text-[#1C1426] dark:text-white">{option.label}</p>
                    <p className="text-xs text-gray-500 dark:text-[#CFC0E6]/70 mt-1">
                      {option.id === 'equilibrado' && 'Balance entre análisis y ejecución.'}
                      {option.id === 'resolutivo' && 'Prioriza decisiones y siguientes pasos.'}
                      {option.id === 'creativo' && 'Explora rutas alternativas e ideas nuevas.'}
                      {option.id === 'mentor' && 'Explica con calma y ofrece referencias.'}
                    </p>
                  </button>
                )
              })}
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-600 dark:text-[#CFC0E6]/70 mb-2">Nivel de detalle</p>
            <div className="flex flex-wrap gap-2">
              {verbosityOptions.map(option => {
                const isActive = assistantSettings?.verbosity === option.id
                return (
                  <button
                    key={option.id}
                    onClick={() => updateAssistantSettings({ verbosity: option.id })}
                    className={`px-4 py-2 rounded-full border text-sm font-medium transition ${isActive ? 'bg-[#7C3AED] text-white border-[#7C3AED]' : 'border-gray-300 dark:border-[#3B2A4F] text-[#4C1D95] dark:text-white'}`}
                  >
                    {option.label}
                  </button>
                )
              })}
            </div>
            <p className="text-xs text-gray-500 dark:text-[#CFC0E6]/70 mt-2">
              Define si prefieres respuestas ultra sintetizadas o explicaciones completas con contexto.
            </p>
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
        return renderNotificationSettings()
      case 'personalizacion':
        return renderPersonalizationSettings()
      case 'seguridad':
        return renderSecuritySettings()
      default:
        return renderGeneralSettings()
    }
  }

  return (
    <div 
      className="configuration-panel fixed inset-0 z-50 flex items-center justify-center bg-black/30 dark:bg-black/60 backdrop-blur-sm p-2 sm:p-4"
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
