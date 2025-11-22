import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { dummyChats } from '../assets/assets'
import { authService } from '../services/authService'

const AppContext = createContext()
export const AppContextProvider = ({ children }) => {

    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [chats, setChats] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
    const [loading, setLoading] = useState(true);

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

    const fetchUserChats = async () =>{
        setChats(dummyChats)
        setSelectedChat(dummyChats[0])
    }

    useEffect(()=>{
        if (user){
            fetchUserChats()
        }else{
            setChats([])
            setSelectedChat(null)
        }
    }, [user])

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
        navigate, user, setUser, fetchUser, logout, chats, setChats, selectedChat, setSelectedChat, theme, setTheme, loading
    }

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
}

export const useAppContext = () => useContext(AppContext)