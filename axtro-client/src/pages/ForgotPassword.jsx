import React, { useState } from 'react'
import { FiX, FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi'
import { authService } from '../services/authService'

const ForgotPassword = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1) // 1: email, 2: OTP, 3: new password
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState(['', '', '', ''])
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleClose = () => {
    // Resetear todo
    setStep(1)
    setEmail('')
    setOtp(['', '', '', ''])
    setNewPassword('')
    setConfirmPassword('')
    setError('')
    setSuccess('')
    onClose()
  }

  const handleOTPChange = (index, value) => {
    if (value.length > 1) return
    
    const newOtp = [...otp]
    newOtp[index] = value.replace(/\D/g, '') // Solo números
    setOtp(newOtp)

    if (value && index < 3) {
      const nextInput = document.getElementById(`otp-${index + 1}`)
      if (nextInput) nextInput.focus()
    }
  }

  const handleOTPKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`)
      if (prevInput) prevInput.focus()
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 4)
    const newOtp = [...otp]
    for (let i = 0; i < 4; i++) {
      newOtp[i] = pastedData[i] || ''
    }
    setOtp(newOtp)
  }

  const handleRequestOTP = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    if (!email) {
      setError('Por favor ingresa tu correo electrónico')
      setLoading(false)
      return
    }

    try {
      const response = await authService.requestPasswordReset(email)
      if (response.success) {
        setSuccess(response.message || 'Código enviado a tu correo')
        setStep(2)
      } else {
        setError(response.message || 'Error al enviar el código')
      }
    } catch (error) {
      setError('Error al conectar con el servidor')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOTP = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    const otpCode = otp.join('')
    if (otpCode.length !== 4) {
      setError('Por favor ingresa el código completo')
      setLoading(false)
      return
    }

    try {
      const response = await authService.verifyOTP(email, otpCode)
      if (response.success) {
        setSuccess(response.message || 'Código verificado correctamente')
        setStep(3)
      } else {
        setError(response.message || 'Código inválido')
      }
    } catch (error) {
      setError('Error al verificar el código')
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    if (!newPassword || !confirmPassword) {
      setError('Por favor completa todos los campos')
      setLoading(false)
      return
    }

    if (newPassword.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      setLoading(false)
      return
    }

    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden')
      setLoading(false)
      return
    }

    const otpCode = otp.join('')
    try {
      const response = await authService.resetPassword(email, otpCode, newPassword)
      if (response.success) {
        setSuccess(response.message || 'Contraseña restablecida correctamente')
        setTimeout(() => {
          handleClose()
        }, 2000)
      } else {
        setError(response.message || 'Error al restablecer la contraseña')
      }
    } catch (error) {
      setError('Error al conectar con el servidor')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 dark:bg-black/70 backdrop-blur-sm p-4"
      onClick={handleClose}
    >
      {/* Paso 1: Solicitar Email */}
      {step === 1 && (
        <div 
          className="bg-white dark:bg-[#1C1426] rounded-2xl shadow-2xl w-full max-w-md p-8 relative animate-fade-in"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-[#4C1D95] dark:text-[#E6CCFF] hover:text-[#7C3AED] dark:hover:text-[#9B5CFF] transition-colors cursor-pointer"
          >
            <FiX className="w-5 h-5" />
          </button>

          <h2 className="text-2xl font-bold text-[#4C1D95] dark:text-[#E6CCFF] mb-2">
            Restablecer contraseña
          </h2>
          <p className="text-sm text-[#6B4AA6] dark:text-[#CFC0E6] mb-6">
            Por favor ingresa tu correo electrónico registrado
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleRequestOTP} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#4C1D95] dark:text-[#E6CCFF] mb-2">
                Correo electrónico
              </label>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6B4AA6] dark:text-[#CFC0E6] w-5 h-5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-[#2B1B3D] border border-gray-200 dark:border-[#3B2A4F] rounded-lg text-[#1C1426] dark:text-[#E6CCFF] placeholder:text-gray-400 dark:placeholder:text-[#CFC0E6] focus:outline-none focus:ring-2 focus:ring-[#7C3AED] focus:border-transparent transition"
                  placeholder="tu@correo.com"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 bg-gradient-to-r from-[#7C3AED] to-[#9B5CFF] text-white rounded-lg font-semibold hover:from-[#6931C9] hover:to-[#8748EB] transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? 'Enviando...' : 'Siguiente'}
            </button>
          </form>
        </div>
      )}

      {/* Paso 2: Verificar OTP */}
      {step === 2 && (
        <div 
          className="bg-gradient-to-br from-[#7C3AED] to-[#9B5CFF] rounded-2xl shadow-2xl w-full max-w-md p-8 relative animate-fade-in"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors cursor-pointer bg-black/20 rounded-full p-1"
          >
            <FiX className="w-5 h-5" />
          </button>

          <h2 className="text-2xl font-bold text-white mb-2">
            Verificación de código
          </h2>
          <p className="text-sm text-white/90 mb-6">
            Hemos enviado un código OTP a tu correo electrónico, por favor ingresa el código en los campos a continuación
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-500/20 text-white rounded-lg text-sm border border-red-300/30">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-500/20 text-white rounded-lg text-sm border border-green-300/30">
              {success}
            </div>
          )}

          <form onSubmit={handleVerifyOTP} className="space-y-6">
            <div className="flex justify-center gap-3">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOTPChange(index, e.target.value)}
                  onKeyDown={(e) => handleOTPKeyDown(index, e)}
                  onPaste={index === 0 ? handlePaste : undefined}
                  className="w-14 h-14 text-center text-2xl font-bold bg-white/20 backdrop-blur-sm border-2 border-white/30 rounded-lg text-white focus:outline-none focus:border-white focus:bg-white/30 transition"
                />
              ))}
            </div>

            <button
              type="submit"
              disabled={loading || otp.join('').length !== 4}
              className="w-full px-6 py-3 bg-white text-[#7C3AED] rounded-lg font-semibold hover:bg-gray-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? 'Verificando...' : 'Verificar'}
            </button>

            <button
              type="button"
              onClick={() => {
                setStep(1)
                setOtp(['', '', '', ''])
                setError('')
              }}
              className="w-full text-white/80 hover:text-white text-sm transition-colors cursor-pointer"
            >
              Volver
            </button>
          </form>
        </div>
      )}

      {/* Paso 3: Nueva Contraseña */}
      {step === 3 && (
        <div 
          className="bg-white dark:bg-[#1C1426] rounded-2xl shadow-2xl w-full max-w-md p-8 relative animate-fade-in"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-[#4C1D95] dark:text-[#E6CCFF] hover:text-[#7C3AED] dark:hover:text-[#9B5CFF] transition-colors cursor-pointer"
          >
            <FiX className="w-5 h-5" />
          </button>

          <h2 className="text-2xl font-bold text-[#4C1D95] dark:text-[#E6CCFF] mb-6">
            Nueva contraseña
          </h2>

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

          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#4C1D95] dark:text-[#E6CCFF] mb-2">
                Nueva contraseña
              </label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6B4AA6] dark:text-[#CFC0E6] w-5 h-5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 bg-gray-50 dark:bg-[#2B1B3D] border border-gray-200 dark:border-[#3B2A4F] rounded-lg text-[#1C1426] dark:text-[#E6CCFF] placeholder:text-gray-400 dark:placeholder:text-[#CFC0E6] focus:outline-none focus:ring-2 focus:ring-[#7C3AED] focus:border-transparent transition"
                  placeholder="Ingresa tu nueva contraseña"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#6B4AA6] dark:text-[#CFC0E6] hover:text-[#7C3AED] dark:hover:text-[#9B5CFF] transition-colors cursor-pointer"
                >
                  {showPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#4C1D95] dark:text-[#E6CCFF] mb-2">
                Confirmar nueva contraseña
              </label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6B4AA6] dark:text-[#CFC0E6] w-5 h-5" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 bg-gray-50 dark:bg-[#2B1B3D] border border-gray-200 dark:border-[#3B2A4F] rounded-lg text-[#1C1426] dark:text-[#E6CCFF] placeholder:text-gray-400 dark:placeholder:text-[#CFC0E6] focus:outline-none focus:ring-2 focus:ring-[#7C3AED] focus:border-transparent transition"
                  placeholder="Confirma tu nueva contraseña"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#6B4AA6] dark:text-[#CFC0E6] hover:text-[#7C3AED] dark:hover:text-[#9B5CFF] transition-colors cursor-pointer"
                >
                  {showConfirmPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 bg-gradient-to-r from-[#10B981] to-[#059669] text-white rounded-lg font-semibold hover:from-[#059669] hover:to-[#047857] transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? 'Guardando...' : 'Guardar'}
            </button>

            <button
              type="button"
              onClick={() => {
                setStep(2)
                setNewPassword('')
                setConfirmPassword('')
                setError('')
              }}
              className="w-full text-[#6B4AA6] dark:text-[#CFC0E6] hover:text-[#7C3AED] dark:hover:text-[#9B5CFF] text-sm transition-colors cursor-pointer"
            >
              Volver
            </button>
          </form>
        </div>
      )}
    </div>
  )
}

export default ForgotPassword

