import User from "../models/User.js";
import OTP from "../models/OTP.js";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import imagekit from '../configs/imageKits.js';
import { sendOTPEmail } from '../configs/email.js';

// Generate token
const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: '1d'
    })
}

// API to register user
export const registerUSer = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const userExist = await User.findOne({email})

        if (userExist){
            return res.json({
                success: false,
                message: "Usuario ya existe"
            })
        }

        const user = await User.create({name, email, password})

        const token = generateToken(user._id)

        res.json({
            success: true,
            token,
        })

    } catch (error) {
        return res.json({
            success: false,
            message: error.message
        })
    }
}

// API to login
export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({email})
        if(user){
            const isMatch = await bcrypt.compare(password, user.password)

            if(isMatch){
                const token = generateToken(user._id)
                return res.json({
                    success: true,
                    token
                })
            }
            return res.json({
                success: false,
                message: "Correo o contraseña inválida"
            })
        }
        return res.json({
            success: false,
            message: "Correo o contraseña inválida"
        })
    } catch (error) {
        return res.json({
            success: false,
            message: error.message
        })
    }
}

// API to get user data
export const getUser = async(req, res) => {
    try {
        const user = req.user
        return res.json({
            success: true,
            user
        })
    } catch (error) {
        return res.json({
            success: false,
            message: error.message
        })
    }
}

// API to update user profile
export const updateUserProfile = async(req, res) => {
    try {
        const userId = req.user._id
        const { name, username, profilePicture } = req.body

        const user = await User.findById(userId)

        if(!user){
            return res.json({
                success: false,
                message: "Usuario no encontrado"
            })
        }

        // Actualizar nombre si se proporciona
        if(name !== undefined){
            user.name = name
        }

        // Actualizar username si se proporciona
        if(username !== undefined){
            if(username.trim() === ''){
                // Si se envía vacío, eliminar el username
                user.username = undefined
            } else {
                // Verificar si el username ya existe (excepto para el usuario actual)
                const existingUser = await User.findOne({ 
                    username: username.trim(),
                    _id: { $ne: userId }
                })
                
                if(existingUser){
                    return res.json({
                        success: false,
                        message: "El nombre de usuario ya está en uso"
                    })
                }
                
                user.username = username.trim()
            }
        }

        // Actualizar foto de perfil si se proporciona
        if(profilePicture !== undefined && profilePicture !== null && profilePicture !== ''){
            try {
                // Si es una URL de ImageKit o base64, subir a ImageKit
                let imageUrl = profilePicture
                
                // Si es base64, subirlo a ImageKit
                if(profilePicture.startsWith('data:image')){
                    const uploadResponse = await imagekit.upload({
                        file: profilePicture,
                        fileName: `profile-${userId}-${Date.now()}.png`,
                        folder: 'axtro/profiles',
                    })
                    imageUrl = uploadResponse.url
                }
                
                user.profilePicture = imageUrl
            } catch (imageError) {
                console.error('Error al subir foto de perfil:', imageError)
                return res.json({
                    success: false,
                    message: "Error al subir la foto de perfil"
                })
            }
        }

        await user.save()

        return res.json({
            success: true,
            user,
            message: "Perfil actualizado correctamente"
        })

    } catch (error) {
        console.error('Error al actualizar perfil:', error)
        return res.json({
            success: false,
            message: error.message || "Error al actualizar el perfil"
        })
    }
}

// Generate OTP code
const generateOTP = () => {
    return Math.floor(1000 + Math.random() * 9000).toString()
}

// API to request password reset OTP
export const requestPasswordReset = async(req, res) => {
    try {
        const { email } = req.body

        if(!email){
            return res.json({
                success: false,
                message: "El correo electrónico es requerido"
            })
        }

        // Verificar si el usuario existe
        const user = await User.findOne({email})
        if(!user){
            return res.json({
                success: false,
                message: "El correo electrónico no está registrado en nuestra base de datos"
            })
        }

        // Generar código OTP
        const otpCode = generateOTP()
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutos

        // Eliminar OTPs anteriores del mismo email
        await OTP.deleteMany({ email, used: false })

        // Guardar nuevo OTP
        await OTP.create({
            email,
            code: otpCode,
            expiresAt,
            used: false
        })

        // Enviar email con el código OTP
        const emailResult = await sendOTPEmail(email, otpCode)
        
        if (!emailResult.success) {
            return res.json({
                success: false,
                message: "Error al enviar el correo electrónico. Por favor intenta nuevamente más tarde."
            })
        }

        return res.json({
            success: true,
            message: "Código de verificación enviado a tu correo electrónico"
        })

    } catch (error) {
        console.error('Error al solicitar restablecimiento:', error)
        return res.json({
            success: false,
            message: error.message || "Error al procesar la solicitud"
        })
    }
}

// API to verify OTP code
export const verifyOTP = async(req, res) => {
    try {
        const { email, code } = req.body

        if(!email || !code){
            return res.json({
                success: false,
                message: "Correo y código son requeridos"
            })
        }

        // Buscar OTP válido
        const otp = await OTP.findOne({
            email,
            code,
            used: false,
            expiresAt: { $gt: new Date() }
        })

        if(!otp){
            return res.json({
                success: false,
                message: "Código inválido o expirado"
            })
        }

        // Marcar OTP como usado
        otp.used = true
        await otp.save()

        return res.json({
            success: true,
            message: "Código verificado correctamente"
        })

    } catch (error) {
        console.error('Error al verificar OTP:', error)
        return res.json({
            success: false,
            message: error.message || "Error al verificar el código"
        })
    }
}

// API to reset password
export const resetPassword = async(req, res) => {
    try {
        const { email, code, newPassword } = req.body

        if(!email || !code || !newPassword){
            return res.json({
                success: false,
                message: "Todos los campos son requeridos"
            })
        }

        if(newPassword.length < 6){
            return res.json({
                success: false,
                message: "La contraseña debe tener al menos 6 caracteres"
            })
        }

        // Verificar OTP
        const otp = await OTP.findOne({
            email,
            code,
            used: true,
            expiresAt: { $gt: new Date(Date.now() - 30 * 60 * 1000) } // Válido por 30 min después de usar
        })

        if(!otp){
            return res.json({
                success: false,
                message: "Código inválido o expirado. Por favor solicita un nuevo código"
            })
        }

        // Buscar usuario
        const user = await User.findOne({email})
        if(!user){
            return res.json({
                success: false,
                message: "Usuario no encontrado"
            })
        }

        // Verificar que la nueva contraseña sea diferente a la actual
        const isSamePassword = await bcrypt.compare(newPassword, user.password)
        if(isSamePassword){
            return res.json({
                success: false,
                message: "La nueva contraseña debe ser diferente a la contraseña actual"
            })
        }

        // Actualizar contraseña
        user.password = newPassword
        await user.save()

        // Eliminar todos los OTPs del usuario
        await OTP.deleteMany({ email })

        return res.json({
            success: true,
            message: "Contraseña restablecida correctamente"
        })

    } catch (error) {
        console.error('Error al restablecer contraseña:', error)
        return res.json({
            success: false,
            message: error.message || "Error al restablecer la contraseña"
        })
    }
}