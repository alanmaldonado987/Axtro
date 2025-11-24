import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
    email: {type: String, required: true},
    code: {type: String, required: true},
    expiresAt: {type: Date, required: true},
    used: {type: Boolean, default: false}
}, {
    timestamps: true
})

// Crear índice TTL para eliminar documentos expirados automáticamente
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })

const OTP = mongoose.model('OTP', otpSchema)

export default OTP

