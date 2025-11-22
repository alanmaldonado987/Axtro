import jwt from 'jsonwebtoken'
import User from '../models/User.js';

export const protect = async (req, res, next) => {
    let token = req.headers.authorization;

    try {
        if (token && token.startsWith('Bearer ')) {
            token = token.substring(7);
        }

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "No cuenta con autorización, token no proporcionado"
            })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const userId = decoded.id;

        const user = await User.findById(userId)

        if(!user){
            return res.json({
                success: false,
                message: "No cuenta con autorización, usuario no encontrado"
            })
        }

        req.user = user;
        next()
    } catch (error) {
        res.status(401).json({
            success: false,
            message: "No cuenta con autorización, token fallido"
        })
    }
}