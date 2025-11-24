import Chat from "../models/Chat.js"
import User from "../models/User.js"
import axios from "axios"
import imagekit from "../configs/imageKits.js"

const GEMINI_API_BASE = process.env.GEMINI_API_BASE || 'https://generativelanguage.googleapis.com/v1beta';
const defaultModel = 'models/gemini-2.5-pro';
const GEMINI_MODEL = process.env.GEMINI_MODEL || defaultModel;
const GEMINI_IMAGE_MODEL = process.env.GEMINI_IMAGE_MODEL || 'models/imagen-4.0-generate-001';

const callGemini = async (model, prompt) => {
    const apiKey = process.env.GEMINI_API_KEY;
    if(!apiKey){
        throw new Error("GEMINI_API_KEY no configurada");
    }

    const normalizedModel = model.startsWith('models/') ? model : `models/${model}`;
    const endpoint = `${GEMINI_API_BASE}/${normalizedModel}:generateContent?key=${apiKey}`;
    const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            contents: [
                {
                    role: "user",
                    parts: [{ text: prompt }]
                }
            ]
        })
    })

    if(!response.ok){
        const errorText = await response.text();
        throw new Error(`Gemini error ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts
        ?.map(part => part.text)
        .filter(Boolean)
        .join('\n')
        ?.trim();

    return text || "Lo siento, no pude generar una respuesta.";
}

// Text base AI Chat Message Controller
export const textMessageController = async(req, res) => {
    try {
        const userId = req.user._id
        const {chatId, prompt} = req.body

        if(!prompt){
            return res.json({ success: false, message: "El prompt es requerido" })
        }

        const chat = await Chat.findOne({userId, _id: chatId})

        if(!chat){
            return res.json({ success: false, message: "Chat no encontrado" })
        }

        const userMessage = {role: "user", content: prompt, timestamp: Date.now(), isImage: false}
        chat.messages.push(userMessage)

        const stylePrompt = `
            Eres Axtro, un asistente directo, amable y conversacional.
            Responde siempre en párrafos cortos (máximo 3), usando un tono claro, cálido y colaborativo.
            Sé específico, evita rodeos y cierra las respuestas invitando al usuario a continuar la conversación si lo desea.
            Pregunta o confirma lo necesario, pero no hagas discursos largos.
            Pregunta del usuario:
            ${prompt}
        `

        const aiContent = await callGemini(GEMINI_MODEL, stylePrompt.trim())
        const reply = {role: "assistant", content: aiContent, timestamp: Date.now(), isImage: false}

        chat.messages.push(reply)
        await chat.save()
        await User.updateOne({_id: userId}, {$inc: {credits: -1}})

        res.json({
            success: true,
            reply
        })

    } catch (error) {
        res.json({
            success: false,
            message: error.message
        })
    }
}

// Image Generation Message Controller
export const imageMessageController = async (req, res) => {
    try {
        const userId = req.user._id
        const { prompt, chatId, isPublished } = req.body;

        if(!prompt){
            return res.json({ success: false, message: "El prompt es requerido" })
        }

        // if(req.user.credits < 2){
        //     return res.json({
        //         success: false,
        //         message: "No tienes créditos para utilizar esta funcionalidad."
        //     })
        // }

        const chat = await Chat.findOne({userId, _id: chatId})

        if(!chat){
            return res.json({ success: false, message: "Chat no encontrado" })
        }

        const userMessage = {role: "user", content: prompt, timestamp: Date.now(), isImage: false}
        chat.messages.push(userMessage)

        // Enconde the promopt
        const encodedPrompt = encodeURIComponent(prompt)
        
        // Construct the image URL
        const generatedImageUrl = `${process.env.IMAGEKIT_URL_ENDPOINT}/ik-genimg-prompt-${encodedPrompt}/Axtro/${Date.now()}.png`

        // Trigger generation by fetching from ImageKit
        const aiImageResponse = await axios.get(generatedImageUrl, {responseType: 'arraybuffer'})

        // Convert to Base64
        const base64Image = `data:image/png;base64,${Buffer.from(aiImageResponse.data, "binary").toString("base64")}`

        // Upload to ImageKit Media Library
        const uploadResponse = await imagekit.upload({
            file: base64Image,
            fileName: `axtro-${Date.now()}.png`,
            folder: 'axtro',
        })

        const reply = {
            role: "assistant",
            content: uploadResponse.url,
            timestamp: Date.now(),
            isImage: true,
            isPublished
        }

        res.json({
            success: true,
            reply
        })

        chat.messages.push(reply)
        await chat.save()
        await User.updateOne({_id: userId}, {$inc: {credits: -2}})

    } catch (error) {
        res.json({
            success: false,
            message: error.message
        })
    }
}