import mongoose from "mongoose";
import bcrypt from 'bcryptjs' 

const userSchema = new mongoose.Schema({
    name: {type: String, required: true},
    username: {type: String, unique: true, sparse: true},
    email: {type: String, required: true, unique: true},
    password: {
        type: String, 
        required: function() { return !this.provider; },
        default: null
    },
    provider: {type: String, enum: ['google', 'facebook'], default: null},
    providerId: {type: String, default: null},
    profilePicture: {type: String, default: null},
    credits: {type: Number, default: 50}
})

// Hash password (solo si existe y no es usuario OAuth)
userSchema.pre('save', async function (next) {
    if(!this.isModified('password') || !this.password || this.provider){
        return next()
    }
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    next();
})

// Excluir password al convertir a JSON
userSchema.methods.toJSON = function() {
    const userObject = this.toObject();
    delete userObject.password;
    return userObject;
}

const User = mongoose.model('User', userSchema)

export default User;