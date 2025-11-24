import express from "express"
import 'dotenv/config'
import cors from 'cors'
import connectBD from "./configs/db.js"
import userRouter from "./routes/userRoutes.js"
import chatRouter from "./routes/chatRoutes.js"
import messageRouter from "./routes/messageRoutes.js"
import authRouter from "./routes/authRoutes.js"
import passport from './configs/passport.js'

const app = express()

await connectBD()

// Middleware
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true
}))
app.use(express.json())
app.use(passport.initialize())

// Routes
app.get('/', (req, res) => res.send('Server On!')) 
app.use('/api/user', userRouter)
app.use('/api/chat', chatRouter)
app.use('/api/message', messageRouter)
app.use('/api/auth', authRouter)

const PORT =process.env.PORT || 3000

app.listen(PORT, ()=>{
    console.log("Server corriendo en puerto: ", PORT)
})
