import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from '../services/authService'
import { chatService } from '../services/chatService'

const accentPalettes = {
    violet: {
        accent: '#7C3AED',
        accentStrong: '#5B21B6',
        soft: '#F1E6FF',
        userBubble: '#E9DAFF',
        assistantBubble: '#F1E6FF',
        text: '#4C1D95'
    },
    emerald: {
        accent: '#0CA678',
        accentStrong: '#0E8260',
        soft: '#E6FCF5',
        userBubble: '#D8F7EC',
        assistantBubble: '#E6FCF5',
        text: '#0F5132'
    },
    sunset: {
        accent: '#F97316',
        accentStrong: '#EA580C',
        soft: '#FFF4E6',
        userBubble: '#FFE8D6',
        assistantBubble: '#FFF4E6',
        text: '#7C2D12'
    },
    ocean: {
        accent: '#2563EB',
        accentStrong: '#1E3A8A',
        soft: '#E0EDFF',
        userBubble: '#DCE8FF',
        assistantBubble: '#E0EDFF',
        text: '#1E3A8A'
    },
    neon: {
        accent: '#00FFD1',
        accentStrong: '#00BFA5',
        soft: '#152032',
        userBubble: '#102734',
        assistantBubble: '#1B2A41',
        text: '#67E8F9'
    },
    sand: {
        accent: '#F4A261',
        accentStrong: '#C76B28',
        soft: '#FFF4E6',
        userBubble: '#FFE8CC',
        assistantBubble: '#FFF7EB',
        text: '#7B341E'
    },
    rose: {
        accent: '#EC4899',
        accentStrong: '#C02678',
        soft: '#FFE4F3',
        userBubble: '#FFD6EB',
        assistantBubble: '#FFEAF6',
        text: '#861657'
    },
    slate: {
        accent: '#0F172A',
        accentStrong: '#020617',
        soft: '#CBD5F5',
        userBubble: '#1E293B',
        assistantBubble: '#111827',
        text: '#FFFFFF'
    }
}

const fontFamilies = {
    outfit: '"Outfit", sans-serif',
    inter: '"Inter", sans-serif',
    poppins: '"Poppins", sans-serif',
    serif: '"Merriweather", serif',
    mono: '"JetBrains Mono", monospace'
}

const densityMap = {
    compact: { gap: '0.4rem', padding: '0.55rem 0.95rem' },
    comfortable: { gap: '0.9rem', padding: '0.85rem 1.25rem' },
    relaxed: { gap: '1.35rem', padding: '1.1rem 1.5rem' }
}

const fontScaleMap = {
    small: 0.95,
    medium: 1,
    large: 1.12
}

const bubbleRadiusMap = {
    rounded: '1.5rem',
    standard: '1rem',
    minimal: '0.55rem'
}

const backgroundMap = {
    soft: {
        background: '#F7F4FF',
        texture: 'none'
    },
    gradient: {
        background: 'linear-gradient(135deg, rgba(124,58,237,0.12), rgba(14,165,233,0.08))',
        texture: 'none'
    },
    grid: {
        background: '#F9F7FF',
        texture: 'radial-gradient(circle at 1px 1px, rgba(124,58,237,0.12) 1px, transparent 0)',
        textureSize: '36px 36px'
    },
    darkfabric: {
        background: '#120C1C',
        texture: 'radial-gradient(circle, rgba(255,255,255,0.06) 10%, transparent 11%)',
        textureSize: '80px 80px'
    },
    glass: {
        background: 'rgba(255,255,255,0.05)',
        texture: 'linear-gradient(125deg, rgba(255,255,255,0.18), rgba(255,255,255,0.02))'
    },
    mesh: {
        background: 'radial-gradient(circle at 20% 20%, rgba(0,255,209,0.25), transparent 40%), radial-gradient(circle at 80% 0%, rgba(37,99,235,0.35), transparent 35%), radial-gradient(circle at 50% 80%, rgba(255,71,150,0.3), transparent 40%)',
        texture: 'none'
    },
    stars: {
        background: '#050816',
        texture: 'radial-gradient(1px 1px at 20px 30px, rgba(255,255,255,0.45), transparent 50%)',
        textureSize: '120px 120px'
    },
    paper: {
        background: '#FFFDF4',
        texture: 'linear-gradient(90deg, rgba(0,0,0,0.02) 1px, transparent 1px), linear-gradient(rgba(0,0,0,0.015) 1px, transparent 1px)',
        textureSize: '14px 14px'
    }
}

const defaultPersonalization = {
    accentPreset: 'violet',
    backgroundStyle: 'soft',
    fontFamily: 'outfit',
    fontScale: 'medium',
    messageDensity: 'comfortable',
    showTimestamps: true,
    sidebarPosition: 'left',
    bubbleShape: 'rounded',
    assistantName: 'Axtro',
    userAvatarStyle: 'circle',
    messageAnimations: 'gentle',
    notificationSound: 'soft',
    sendBehavior: 'enter',
    showAssistantLabel: true
}

const defaultAssistantSettings = {
    responseLanguage: 'auto',
    speakingStyle: 'equilibrado',
    tone: 'cercano',
    temperature: 0.65,
    verbosity: 'balanceado'
}

const AppContext = createContext()
export const AppContextProvider = ({ children }) => {

    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [chats, setChats] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    const [theme, setTheme] = useState('light');
    const [loading, setLoading] = useState(true);
    const [chatsLoading, setChatsLoading] = useState(false);
    const [isInformationOpen, setIsInformationOpen] = useState(false);
    const [notificationSettings, setNotificationSettings] = useState({
        newMessageAlerts: true,
        emailUpdates: false
    })
    const [personalizationSettings, setPersonalizationSettings] = useState(defaultPersonalization)
    const [assistantSettings, setAssistantSettings] = useState(defaultAssistantSettings)
    const [toast, setToast] = useState(null)

    const fetchUser = async () => {
        const token = authService.getToken();
        if (token) {
            try {
                const response = await authService.getUserData();
                if (response.success && response.user) {
                    setUser(response.user);
                } else {
                    // Token inválido, limpiar
                    authService.removeToken();
                    setUser(null);
                }
            } catch (error) {
                console.error('Error al obtener datos del usuario:', error);
                authService.removeToken();
                setUser(null);
            }
        } else {
            setUser(null);
        }
        setLoading(false);
    }

    const logout = () => {
        authService.removeToken();
        setUser(null);
        setChats([]);
        setSelectedChat(null);
        navigate('/');
    }

    const fetchUserChats = useCallback(async () =>{
        if(!user) return;
        setChatsLoading(true)
        try {
            const response = await chatService.getChats()
            if(response.success){
                setChats(response.chats)
                if(response.chats.length === 0){
                    setSelectedChat(null)
                }else{
                    setSelectedChat((prev) => {
                        if(!prev) return response.chats[0]
                        const stillExists = response.chats.find(chat => chat._id === prev._id)
                        return stillExists || response.chats[0]
                    })
                }
            }else{
                console.error(response.message || 'Error al obtener chats')
            }
        } catch (error) {
            console.error('Error al obtener chats:', error)
        } finally {
            setChatsLoading(false)
        }
    }, [user])

    useEffect(()=>{
        if (user){
            fetchUserChats()
            // Cargar configuraciones específicas del usuario
            try{
                const userId = user._id || user.id
                if(userId){
                    const storedNotifications = localStorage.getItem(`notificationSettings_${userId}`)
                    if(storedNotifications){
                        setNotificationSettings(JSON.parse(storedNotifications))
                    }
                    
                    const storedPersonalization = localStorage.getItem(`personalizationSettings_${userId}`)
                    if(storedPersonalization){
                        setPersonalizationSettings({ ...defaultPersonalization, ...JSON.parse(storedPersonalization) })
                    }

                    const storedAssistant = localStorage.getItem(`assistantSettings_${userId}`)
                    if(storedAssistant){
                        setAssistantSettings({ ...defaultAssistantSettings, ...JSON.parse(storedAssistant) })
                    }

                    const storedTheme = localStorage.getItem(`theme_${userId}`)
                    if(storedTheme){
                        setTheme(storedTheme)
                    } else {
                        setTheme('light')
                    }
                }
            }catch(error){
                console.error('Error al cargar configuraciones del usuario:', error)
            }
        }else{
            setChats([])
            setSelectedChat(null)
            // Resetear a valores por defecto cuando no hay usuario
            setNotificationSettings({
                newMessageAlerts: true,
                emailUpdates: false
            })
            setPersonalizationSettings(defaultPersonalization)
            setAssistantSettings(defaultAssistantSettings)
            setTheme('light')
        }
    }, [user, fetchUserChats])

    useEffect(()=>{
        if (theme === 'dark'){
            document.documentElement.classList.add('dark');
        }else{
            document.documentElement.classList.remove('dark');
        }
    }, [theme])

    useEffect(()=>{
        if(!user?._id && !user?.id) return
        try{
            const userId = user._id || user.id
            localStorage.setItem(`theme_${userId}`, theme)
        }catch(error){
            console.error('Error al guardar theme:', error)
        }
    }, [theme, user])

    useEffect(()=>{
        if(!user?._id && !user?.id) return
        try{
            const userId = user._id || user.id
            localStorage.setItem(`notificationSettings_${userId}`, JSON.stringify(notificationSettings))
        }catch(error){
            console.error('Error al guardar notificationSettings:', error)
        }
    }, [notificationSettings, user])

    useEffect(()=>{
        if(!user?._id && !user?.id) return
        try{
            const userId = user._id || user.id
            localStorage.setItem(`personalizationSettings_${userId}`, JSON.stringify(personalizationSettings))
        }catch(error){
            console.error('Error al guardar personalizationSettings:', error)
        }
    }, [personalizationSettings, user])

    useEffect(()=>{
        if(!user?._id && !user?.id) return
        try{
            const userId = user._id || user.id
            localStorage.setItem(`assistantSettings_${userId}`, JSON.stringify(assistantSettings))
        }catch(error){
            console.error('Error al guardar assistantSettings:', error)
        }
    }, [assistantSettings, user])

    useEffect(()=>{
        const palette = accentPalettes[personalizationSettings.accentPreset] || accentPalettes.violet
        document.documentElement.style.setProperty('--accent-color', palette.accent)
        document.documentElement.style.setProperty('--accent-color-strong', palette.accentStrong)
        document.documentElement.style.setProperty('--accent-soft-bg', palette.soft)
        document.documentElement.style.setProperty('--chat-user-bg', palette.userBubble)
        document.documentElement.style.setProperty('--chat-assistant-bg', palette.assistantBubble)
        document.documentElement.style.setProperty('--chat-text-strong', palette.text)

        const fontFamilyValue = fontFamilies[personalizationSettings.fontFamily] || fontFamilies.outfit
        document.documentElement.style.setProperty('--app-font-family', fontFamilyValue)

        const fontScale = fontScaleMap[personalizationSettings.fontScale] || 1
        document.documentElement.style.setProperty('--app-font-scale', fontScale)

        const density = densityMap[personalizationSettings.messageDensity] || densityMap.comfortable
        document.documentElement.style.setProperty('--message-gap', density.gap)
        document.documentElement.style.setProperty('--message-padding', density.padding)

        const bubbleRadius = bubbleRadiusMap[personalizationSettings.bubbleShape] || '1.5rem'
        document.documentElement.style.setProperty('--bubble-radius', bubbleRadius)

        const backgroundPreset = backgroundMap[personalizationSettings.backgroundStyle] || backgroundMap.soft
        document.documentElement.style.setProperty('--app-background', backgroundPreset.background)
        if(backgroundPreset.texture === 'none'){
            document.documentElement.style.removeProperty('--app-texture')
            document.documentElement.style.removeProperty('--app-texture-size')
        }else{
            document.documentElement.style.setProperty('--app-texture', backgroundPreset.texture)
            document.documentElement.style.setProperty('--app-texture-size', backgroundPreset.textureSize || '50px 50px')
        }
    }, [personalizationSettings])

    useEffect(()=>{
        if(!toast) return
        const timer = setTimeout(() => setToast(null), toast.duration || 5000)
        return () => clearTimeout(timer)
    }, [toast])

    useEffect(()=>{
        fetchUser()
    }, [])

    const pushNotification = (payload) => {
        setToast({
            id: Date.now(),
            duration: payload.duration || 5000,
            ...payload,
        })
    }

    const clearToast = () => setToast(null)

    const updatePersonalization = (changes) => {
        setPersonalizationSettings(prev => ({
            ...prev,
            ...changes
        }))
    }

    const updateAssistantSettings = (changes) => {
        setAssistantSettings(prev => ({
            ...prev,
            ...changes
        }))
    }

    const value = {
        navigate,
        user,
        setUser,
        fetchUser,
        logout,
        chats,
        setChats,
        fetchUserChats,
        selectedChat,
        setSelectedChat,
        theme,
        setTheme,
        loading,
        chatsLoading,
        isInformationOpen,
        setIsInformationOpen,
        notificationSettings,
        setNotificationSettings,
        assistantSettings,
        updateAssistantSettings,
        toast,
        pushNotification,
        clearToast,
        personalizationSettings,
        updatePersonalization
    }

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
}

export const useAppContext = () => useContext(AppContext)