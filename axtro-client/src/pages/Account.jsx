import React, { useState, useEffect, useRef } from 'react'
import { FaCamera } from 'react-icons/fa'
import { useAppContext } from '../context/AppContext'
import { authService } from '../services/authService'

const Account = () => {
  const { user, setUser, navigate, fetchUser } = useAppContext()
  const [formData, setFormData] = useState({
    displayName: '',
    username: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const fileInputRef = useRef(null)

  useEffect(() => {
    if (user) {
      setFormData({
        displayName: user.name || '',
        username: user.username || (user.email ? user.email.split('@')[0] : '')
      })
    }
  }, [user])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSave = async () => {
    setLoading(true)
    setError('')
    setSuccess('')
    
    try {
      const response = await authService.updateProfile({
        name: formData.displayName,
        username: formData.username
      })
      
      if (response.success) {
        setSuccess('Perfil actualizado correctamente')
        // Actualizar el usuario en el contexto
        await fetchUser()
        setTimeout(() => {
          navigate('/')
        }, 1500)
      } else {
        setError(response.message || 'Error al actualizar el perfil')
      }
    } catch (error) {
      console.error('Error al actualizar perfil:', error)
      setError('Error al conectar con el servidor')
    } finally {
      setLoading(false)
    }
  }

  const handleImageChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Validar que sea una imagen
    if (!file.type.startsWith('image/')) {
      setError('Por favor selecciona un archivo de imagen')
      return
    }

    // Validar tamaño (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('La imagen debe ser menor a 5MB')
      return
    }

    setLoading(true)
    setError('')
    
    try {
      // Convertir a base64
      const reader = new FileReader()
      reader.onloadend = async () => {
        try {
          const base64Image = reader.result
          const response = await authService.updateProfile({
            profilePicture: base64Image
          })
          
          if (response.success) {
            setSuccess('Foto de perfil actualizada correctamente')
            await fetchUser()
          } else {
            setError(response.message || 'Error al actualizar la foto de perfil')
          }
        } catch (error) {
          console.error('Error al actualizar foto:', error)
          setError('Error al subir la foto de perfil')
        } finally {
          setLoading(false)
        }
      }
      reader.readAsDataURL(file)
    } catch (error) {
      console.error('Error al procesar imagen:', error)
      setError('Error al procesar la imagen')
      setLoading(false)
    }
  }

  const handleClose = () => {
    // Restaurar valores originales
    if (user) {
      const usernameFromEmail = user.email
        ? user.email.split('@')[0]
        : ''
      setFormData({
        displayName: user.name || '',
        username: user.username || (user.email ? user.email.split('@')[0] : '')
      })
    }
    setError('')
    setSuccess('')
    // Redirigir a la página principal
    navigate('/')
  }


  if (!user) {
    return null
  }

  // Obtener iniciales del nombre
  const initials = user.name
    ? user.name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'U'

  // Usar foto de perfil si existe, sino mostrar iniciales
  const profileImage = user.profilePicture

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#F7F4FF] dark:bg-[#0F0618] p-4">
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 dark:bg-black/60 backdrop-blur-sm"
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            handleClose()
          }
        }}
      >
          <div 
            className="bg-white dark:bg-[#1C1426] rounded-2xl shadow-2xl w-full max-w-md p-8 relative animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Título */}
            <h2 className="text-2xl font-bold text-[#4C1D95] dark:text-[#E6CCFF] mb-6 text-center">
              Editar perfil
            </h2>

            {/* Foto de perfil */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                {profileImage ? (
                  <img 
                    src={profileImage} 
                    alt="Foto de perfil" 
                    className="w-28 h-28 rounded-full object-cover shadow-lg"
                  />
                ) : (
                  <div className="w-28 h-28 rounded-full bg-gradient-to-br from-[#7C3AED] to-[#9B5CFF] flex items-center justify-center text-white text-4xl font-bold shadow-lg">
                    {initials}
                  </div>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  className="absolute bottom-0 right-0 w-9 h-9 rounded-full bg-white dark:bg-[#2B1B3D] border-2 border-white dark:border-[#3B2A4F] flex items-center justify-center text-[#1C1426] dark:text-[#E6CCFF] hover:bg-[#F0E9FF] dark:hover:bg-[#3B2A4F] transition-colors cursor-pointer shadow-lg"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={loading}
                >
                  <FaCamera className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Mensajes de error y éxito */}
            {error && (
              <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg text-sm">
                {error}
              </div>
            )}
            {success && (
              <div className="mb-4 p-3 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg text-sm">
                {success}
              </div>
            )}

            {/* Campos de formulario */}
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-[#4C1D95] dark:text-[#E6CCFF] mb-2">
                  Nombre para mostrar
                </label>
                <input
                  type="text"
                  name="displayName"
                  value={formData.displayName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-[#2B1B3D] border border-gray-200 dark:border-[#3B2A4F] rounded-lg text-[#1C1426] dark:text-[#E6CCFF] placeholder:text-gray-400 dark:placeholder:text-[#CFC0E6] focus:outline-none focus:ring-2 focus:ring-[#7C3AED] focus:border-transparent transition"
                  placeholder="alan maldonado"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#4C1D95] dark:text-[#E6CCFF] mb-2">
                  Nombre de usuario
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-[#2B1B3D] border border-gray-200 dark:border-[#3B2A4F] rounded-lg text-[#1C1426] dark:text-[#E6CCFF] placeholder:text-gray-400 dark:placeholder:text-[#CFC0E6] focus:outline-none focus:ring-2 focus:ring-[#7C3AED] focus:border-transparent transition"
                  placeholder="alanma407"
                />
              </div>
            </div>

            {/* Texto descriptivo */}
            <p className="text-sm text-[#6B4AA6] dark:text-[#CFC0E6] mb-6 text-center">
              Tu perfil ayuda a que las personas te reconozcan.
            </p>

            {/* Botones */}
            <div className="flex justify-end gap-3">
              <button
                onClick={handleClose}
                disabled={loading}
                className="px-6 py-2.5 bg-white dark:bg-[#2B1B3D] border border-gray-300 dark:border-[#3B2A4F] text-[#1C1426] dark:text-[#E6CCFF] rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-[#3B2A4F] transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={loading}
                className="px-6 py-2.5 bg-[#1C1426] dark:bg-[#E6CCFF] text-white dark:text-[#4C1D95] rounded-lg font-semibold hover:bg-[#2B1B3D] dark:hover:bg-[#D8C8FF] transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {loading ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </div>
        </div>
    </div>
  )
}

export default Account
