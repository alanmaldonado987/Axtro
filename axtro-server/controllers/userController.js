import User from "../models/User.js";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

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
        userExist = await User.findOne({email})

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
            sucess: false,
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
                    sucess: true,
                    token
                })
            }
            return res.json({
                sucess: false,
                message: "Correo o contraseña inválida"
            })
        }
    } catch (error) {
        return res.json({
            sucess: false,
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
            sucess: false,
            message: error.message
        })
    }
}