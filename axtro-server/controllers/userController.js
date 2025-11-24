import User from "../models/User.js";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import imagekit from '../configs/imageKits.js';

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