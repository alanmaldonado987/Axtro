import express from "express";
import passport from '../configs/passport.js';
import jwt from 'jsonwebtoken';

const authRouter = express.Router();

// Generate token
const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: '1d'
    })
}

// Google OAuth Routes
authRouter.get('/google', 
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

authRouter.get('/google/callback',
    passport.authenticate('google', { session: false, failureRedirect: `${process.env.CLIENT_URL}/login?error=google_failed` }),
    (req, res) => {
        try {
            const token = generateToken(req.user._id);

            res.redirect(`${process.env.CLIENT_URL}/auth/callback?token=${token}&success=true`);
        } catch (error) {
            res.redirect(`${process.env.CLIENT_URL}/login?error=token_generation_failed`);
        }
    }
);

// Facebook OAuth Routes
authRouter.get('/facebook',
    passport.authenticate('facebook', { scope: ['email'] })
);

authRouter.get('/facebook/callback',
    passport.authenticate('facebook', { session: false, failureRedirect: `${process.env.CLIENT_URL}/login?error=facebook_failed` }),
    (req, res) => {
        try {
            const token = generateToken(req.user._id);

            res.redirect(`${process.env.CLIENT_URL}/auth/callback?token=${token}&success=true`);
        } catch (error) {
            res.redirect(`${process.env.CLIENT_URL}/login?error=token_generation_failed`);
        }
    }
);

export default authRouter;

