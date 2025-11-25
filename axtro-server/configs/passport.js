import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';

// Generate token
const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: '1d'
    })
}

// Serialize user for session
passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

// Google Strategy
const getGoogleCallbackURL = () => {
    if (process.env.GOOGLE_CALLBACK_URL) {
        return process.env.GOOGLE_CALLBACK_URL;
    }
    const serverUrl = process.env.SERVER_URL;
    const baseUrl = serverUrl.endsWith('/') ? serverUrl.slice(0, -1) : serverUrl;
    return `${baseUrl}/api/auth/google/callback`;
};

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: getGoogleCallbackURL()
}, async (accessToken, refreshToken, profile, done) => {
    try {
        let user = await User.findOne({ 
            $or: [
                { email: profile.emails[0].value },
                { providerId: profile.id, provider: 'google' }
            ]
        });

        if (user) {
            if (!user.provider) {
                user.provider = 'google';
                user.providerId = profile.id;
                if (profile.photos && profile.photos[0]) {
                    user.profilePicture = profile.photos[0].value;
                }
                await user.save();
            }
            return done(null, user);
        }

        user = await User.create({
            name: profile.displayName || profile.name.givenName + ' ' + profile.name.familyName,
            email: profile.emails[0].value,
            provider: 'google',
            providerId: profile.id,
            profilePicture: profile.photos && profile.photos[0] ? profile.photos[0].value : null,
            password: null // No se requiere password para OAuth
        });

        return done(null, user);
    } catch (error) {
        return done(error, null);
    }
}));

// Facebook Strategy
const getFacebookCallbackURL = () => {
    if (process.env.FACEBOOK_CALLBACK_URL) {
        return process.env.FACEBOOK_CALLBACK_URL;
    }
    const serverUrl = process.env.SERVER_URL;
    const baseUrl = serverUrl.endsWith('/') ? serverUrl.slice(0, -1) : serverUrl;
    return `${baseUrl}/api/auth/facebook/callback`;
};

passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: getFacebookCallbackURL(),
    profileFields: ['id', 'displayName', 'email', 'picture.type(large)']
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;
        
        let user = null;
        
        if (email) {
            user = await User.findOne({ email });
        }
        
        if (!user) {
            user = await User.findOne({ providerId: profile.id, provider: 'facebook' });
        }

        if (user) {
            if (!user.provider) {
                user.provider = 'facebook';
                user.providerId = profile.id;
                if (profile.photos && profile.photos[0]) {
                    user.profilePicture = profile.photos[0].value;
                }
                await user.save();
            }
            return done(null, user);
        }

        const userEmail = email || `facebook_${profile.id}@axtro.app`;

        user = await User.create({
            name: profile.displayName || `Usuario Facebook ${profile.id}`,
            email: userEmail,
            provider: 'facebook',
            providerId: profile.id,
            profilePicture: profile.photos && profile.photos[0] ? profile.photos[0].value : null,
            password: null // No se requiere password para OAuth
        });

        return done(null, user);
    } catch (error) {
        return done(error, null);
    }
}));

export default passport;

