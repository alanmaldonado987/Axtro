import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from '../services/authService'
import { chatService } from '../services/chatService'

const AppContext = createContext()
export const AppContextProvider = ({ children }) => {

    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [chats, setChats] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
    const [loading, setLoading] = useState(true);
    const [chatsLoading, setChatsLoading] = useState(false);
    const [isInformationOpen, setIsInformationOpen] = useState(false);

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
        }else{
            setChats([])
            setSelectedChat(null)
        }
    }, [user, fetchUserChats])

    useEffect(()=>{
        if (theme === 'dark'){
            document.documentElement.classList.add('dark');
        }else{
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('theme', theme)
    }, [theme])

    useEffect(()=>{
        fetchUser()
    }, [])

    const value = {
        navigate, user, setUser, fetchUser, logout, chats, setChats, fetchUserChats, selectedChat, setSelectedChat, theme, setTheme, loading, chatsLoading, isInformationOpen, setIsInformationOpen
    }

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
}

export const useAppContext = () => useContext(AppContext)