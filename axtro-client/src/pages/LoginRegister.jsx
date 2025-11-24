import { useState, useEffect, useRef } from "react";
import { FaGooglePlusG, FaFacebookF } from "react-icons/fa";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { authService } from "../services/authService";
import { useAppContext } from "../context/AppContext";
import ForgotPassword from "./ForgotPassword";

const LoginRegister = () => {

  const [active, setActive] = useState(false);
  const { setUser } = useAppContext();

  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [loginTransitioning, setLoginTransitioning] = useState(false);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const transitionTimeoutRef = useRef(null);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (!registerData.name || !registerData.email || !registerData.password) {
      setError('Por favor completa todos los campos');
      setLoading(false);
      return;
    }

    try {
      const response = await authService.register(
        registerData.name,
        registerData.email,
        registerData.password
      );

      if (response.success) {
        const registeredEmail = registerData.email;
        
        setSuccess('Usuario creado exitosamente. Por favor inicia sesión.');
        setRegisterData({
          name: '',
          email: '',
          password: ''
        });
        setTimeout(() => {
          setActive(false);
          setSuccess('');
          setLoginData({
            ...loginData,
            email: registeredEmail
          });
        }, 2000);
      } else {
        setError(response.message || 'Error al registrar usuario');
      }
    } catch (err) {
      setError('Error al conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!loginData.email || !loginData.password) {
      setError('Por favor completa todos los campos');
      setLoading(false);
      return;
    }

    try {
      const response = await authService.login(
        loginData.email,
        loginData.password
      );

      if (response.success && response.token) {
        authService.saveToken(response.token);

        if (transitionTimeoutRef.current) {
          clearTimeout(transitionTimeoutRef.current);
        }

        setLoginTransitioning(true);

        transitionTimeoutRef.current = setTimeout(async () => {
          try {
            const userResponse = await authService.getUserData();
            if (userResponse.success) {
              setUser(userResponse.user);
            } else {
              setError(userResponse.message || 'No se pudo obtener la información del usuario');
            }
          } catch (fetchError) {
            setError('No pudimos sincronizar tus datos, intenta nuevamente.');
          } finally {
            setLoginTransitioning(false);
          }
        }, 4000);
      } else {
        setError(response.message || 'Error al iniciar sesión');
      }
    } catch (err) {
      setError('Error al conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setError('');
    setSuccess('');
  }, [active]);

  useEffect(() => {
    return () => {
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }
    }
  }, [])

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-100 via-purple-50 to-blue-50 p-4">
      {loginTransitioning && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-6 bg-[#0F0618]/85 backdrop-blur-xl text-white transition-opacity">
          <div className="uppercase tracking-[0.4em] text-xs text-[#D8C8FF]">cargando</div>
          <div className="relative w-36 h-36">
            <div className="absolute inset-0 border-2 border-transparent rounded-full border-t-[#8A5BFF] animate-spin-slow"></div>
            <div className="absolute inset-3 border-2 border-transparent rounded-full border-b-[#E5D6FF] animate-spin-slower"></div>
            <div className="absolute inset-6 bg-gradient-to-br from-[#7C3AED] to-[#C084FC] rounded-full blur-2xl opacity-80 animate-pulse-fast"></div>
          </div>
          <p className="text-2xl font-semibold">Preparando tu espacio creativo...</p>
          <p className="text-sm text-[#D8C8FF]/80">Sincronizando tus chats, preferencias y atajos favoritos.</p>
        </div>
      )}
      
      {/* Mobile Layout */}
      <div className="md:hidden w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Mobile Header Toggle */}
          <div className="bg-gradient-to-br from-purple-500 via-purple-600 to-purple-700 text-white p-6">
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setActive(false)}
                className={`flex-1 py-2.5 px-4 rounded-lg font-semibold text-sm transition-all ${
                  !active 
                    ? "bg-white text-purple-600 shadow-lg" 
                    : "bg-transparent text-white border-2 border-white/50"
                }`}
              >
                Iniciar Sesión
              </button>
              <button
                onClick={() => setActive(true)}
                className={`flex-1 py-2.5 px-4 rounded-lg font-semibold text-sm transition-all ${
                  active 
                    ? "bg-white text-purple-600 shadow-lg" 
                    : "bg-transparent text-white border-2 border-white/50"
                }`}
              >
                Registrarse
              </button>
            </div>
          </div>

          {/* Mobile Content */}
          <div className="p-6">
            {!active ? (
              /* SIGN IN MOBILE */
              <div className="w-full">
                <h1 className="text-2xl font-bold text-gray-800 mb-2 text-center">Bienvenido otra vez</h1>
                <p className="text-xs text-gray-500 text-center mb-6">
                  Ingresa tus datos para retomar tus conversaciones cuando quieras.
                </p>

                <div className="flex gap-3 mb-4 justify-center">
                  <Icon><FaGooglePlusG /></Icon>
                  <Icon><FaFacebookF /></Icon>
                </div>

                <span className="text-xs text-gray-600 mb-4 block text-center">Prefiere tu correo y contraseña si así te sientes más cómodo.</span>

                {error && !active && (
                  <div className="w-full bg-red-100 text-red-700 px-4 py-2 rounded-lg mb-4 text-xs">
                    {error}
                  </div>
                )}

                <form onSubmit={handleLogin} className="w-full">
                  <input 
                    type="email" 
                    placeholder="Correo Electrónico" 
                    value={loginData.email}
                    onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                    className="w-full bg-gray-100 border-none rounded-lg px-4 py-3 mb-3 text-sm outline-none focus:bg-gray-200 transition" 
                  />
                  <div className="relative mb-3">
                    <input 
                      type={showLoginPassword ? "text" : "password"} 
                      placeholder="Contraseña" 
                      value={loginData.password}
                      onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                      className="w-full bg-gray-100 border-none rounded-lg px-4 py-3 pr-10 text-sm outline-none focus:bg-gray-200 transition" 
                    />
                    <button
                      type="button"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800 transition-colors cursor-pointer"
                    >
                      {showLoginPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsForgotPasswordOpen(true)}
                    className="text-xs text-gray-600 hover:text-gray-800 mb-4 text-left cursor-pointer w-full"
                  >
                    ¿Olvidaste tu contraseña?
                  </button>

                  <button 
                    type="submit"
                    disabled={loading}
                    className="bg-purple-600 text-white font-semibold px-10 py-3 rounded-lg text-sm uppercase tracking-wider hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed w-full cursor-pointer"
                  >
                    {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                  </button>
                </form>
              </div>
            ) : (
              /* SIGN UP MOBILE */
              <div className="w-full">
                <h1 className="text-2xl font-bold text-gray-800 mb-2 text-center">Crea tu espacio en Axtro</h1>
                <p className="text-xs text-gray-500 text-center mb-6">
                  Toma dos minutos para registrarte y empieza a conversar con tu asistente personal.
                </p>

                <div className="flex gap-3 mb-4 justify-center">
                  <Icon><FaGooglePlusG /></Icon>
                  <Icon><FaFacebookF /></Icon>
                </div>

                <span className="text-xs text-gray-600 mb-4 block text-center">También puedes usar tu correo para registrarte.</span>

                {error && active && (
                  <div className="w-full bg-red-100 text-red-700 px-4 py-2 rounded-lg mb-4 text-xs">
                    {error}
                  </div>
                )}

                {success && active && (
                  <div className="w-full bg-green-100 text-green-700 px-4 py-2 rounded-lg mb-4 text-xs">
                    {success}
                  </div>
                )}

                <form onSubmit={handleRegister} className="w-full">
                  <input 
                    type="text" 
                    placeholder="Nombre" 
                    value={registerData.name}
                    onChange={(e) => setRegisterData({...registerData, name: e.target.value})}
                    className="w-full bg-gray-100 border-none rounded-lg px-4 py-3 mb-3 text-sm outline-none focus:bg-gray-200 transition" 
                  />
                  <input 
                    type="email" 
                    placeholder="Correo Electrónico" 
                    value={registerData.email}
                    onChange={(e) => setRegisterData({...registerData, email: e.target.value})}
                    className="w-full bg-gray-100 border-none rounded-lg px-4 py-3 mb-3 text-sm outline-none focus:bg-gray-200 transition" 
                  />
                  <div className="relative mb-4">
                    <input 
                      type={showRegisterPassword ? "text" : "password"} 
                      placeholder="Contraseña" 
                      value={registerData.password}
                      onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
                      className="w-full bg-gray-100 border-none rounded-lg px-4 py-3 pr-10 text-sm outline-none focus:bg-gray-200 transition" 
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800 transition-colors cursor-pointer"
                    >
                      {showRegisterPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                    </button>
                  </div>

                  <button 
                    type="submit"
                    disabled={loading}
                    className="bg-purple-600 text-white font-semibold px-10 py-3 rounded-lg text-sm uppercase tracking-wider hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed w-full cursor-pointer"
                  >
                    {loading ? 'Registrando...' : 'Registrarse'}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div
        className={`hidden md:block relative bg-white rounded-3xl shadow-2xl overflow-hidden w-[850px] max-w-[95vw] h-[550px] transition-all duration-700 ${
          active ? "active" : ""
        }`}
      >
        {/* SIGN UP */}
        <div
          className={`absolute top-0 h-full w-1/2 flex flex-col items-center justify-center px-12 transition-all duration-700 ${
            active ? "translate-x-full opacity-100 z-20 animate-fade" : "opacity-0 z-10 pointer-events-none"
          }`}
        >
          <h1 className="text-3xl font-bold text-gray-800 mb-3">Crea tu espacio en Axtro</h1>
          <p className="text-sm text-gray-500 text-center mb-4">
            Toma dos minutos para registrarte y empieza a conversar con tu asistente personal.
          </p>

          <div className="flex gap-3 mb-6">
            <Icon><FaGooglePlusG /></Icon>
            <Icon><FaFacebookF /></Icon>
          </div>

          <span className="text-xs text-gray-600 mb-4">También puedes usar tu correo para registrarte.</span>

          {error && active && (
            <div className="w-full bg-red-100 text-red-700 px-4 py-2 rounded-lg mb-3 text-xs">
              {error}
            </div>
          )}

          {success && active && (
            <div className="w-full bg-green-100 text-green-700 px-4 py-2 rounded-lg mb-3 text-xs">
              {success}
            </div>
          )}

          <form onSubmit={handleRegister} className="w-full">
            <input 
              type="text" 
              placeholder="Nombre" 
              value={registerData.name}
              onChange={(e) => setRegisterData({...registerData, name: e.target.value})}
              className="w-full bg-gray-100 border-none rounded-lg px-4 py-3 mb-3 text-sm outline-none focus:bg-gray-200 transition" 
            />
            <input 
              type="email" 
              placeholder="Correo Electrónico" 
              value={registerData.email}
              onChange={(e) => setRegisterData({...registerData, email: e.target.value})}
              className="w-full bg-gray-100 border-none rounded-lg px-4 py-3 mb-3 text-sm outline-none focus:bg-gray-200 transition" 
            />
            <div className="relative mb-4">
              <input 
                type={showRegisterPassword ? "text" : "password"} 
                placeholder="Contraseña" 
                value={registerData.password}
                onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
                className="w-full bg-gray-100 border-none rounded-lg px-4 py-3 pr-10 text-sm outline-none focus:bg-gray-200 transition" 
              />
              <button
                type="button"
                onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800 transition-colors cursor-pointer"
              >
                {showRegisterPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
              </button>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="bg-purple-600 text-white font-semibold px-10 py-3 rounded-lg text-sm uppercase tracking-wider hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed w-full cursor-pointer"
            >
              {loading ? 'Registrando...' : 'Registrarse'}
            </button>
          </form>
        </div>

        {/* SIGN IN */}
        <div
          className={`absolute top-0 h-full w-1/2 flex flex-col items-center justify-center px-12 transition-all duration-700 ${
            active ? "-translate-x-full opacity-0 pointer-events-none" : "opacity-100 z-20"
          }`}
        >
          <h1 className="text-3xl font-bold text-gray-800 mb-3">Bienvenido otra vez</h1>
          <p className="text-sm text-gray-500 text-center mb-4">
            Ingresa tus datos para retomar tus conversaciones cuando quieras.
          </p>

          <div className="flex gap-3 mb-6">
            <Icon><FaGooglePlusG /></Icon>
            <Icon><FaFacebookF /></Icon>
          </div>

          <span className="text-xs text-gray-600 mb-4">Prefiere tu correo y contraseña si así te sientes más cómodo.</span>

          {error && !active && (
            <div className="w-full bg-red-100 text-red-700 px-4 py-2 rounded-lg mb-3 text-xs">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="w-full">
            <input 
              type="email" 
              placeholder="Correo Electrónico" 
              value={loginData.email}
              onChange={(e) => setLoginData({...loginData, email: e.target.value})}
              className="w-full bg-gray-100 border-none rounded-lg px-4 py-3 mb-3 text-sm outline-none focus:bg-gray-200 transition" 
            />
            <div className="relative mb-2">
              <input 
                type={showLoginPassword ? "text" : "password"} 
                placeholder="Contraseña" 
                value={loginData.password}
                onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                className="w-full bg-gray-100 border-none rounded-lg px-4 py-3 pr-10 text-sm outline-none focus:bg-gray-200 transition" 
              />
              <button
                type="button"
                onClick={() => setShowLoginPassword(!showLoginPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800 transition-colors cursor-pointer"
              >
                {showLoginPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
              </button>
            </div>

            <button
              type="button"
              onClick={() => setIsForgotPasswordOpen(true)}
              className="text-xs text-gray-600 hover:text-gray-800 mb-4 text-left cursor-pointer"
            >
              ¿Olvidaste tu contraseña?
            </button>

            <button 
              type="submit"
              disabled={loading}
              className="bg-purple-600 text-white font-semibold px-10 py-3 rounded-lg text-sm uppercase tracking-wider hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed w-full cursor-pointer"
            >
              {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </button>
          </form>
        </div>

        {/* RIGHT PANEL */}
        <div
          className={`absolute top-0 left-1/2 w-1/2 h-full overflow-hidden transition-all duration-700 z-30 ${
            active ? "-translate-x-full rounded-r-[200px]" : "rounded-l-[200px]"
          }`}
        >
          <div
            className={`bg-gradient-to-br from-purple-500 via-purple-600 to-purple-700 text-white absolute left-[-100%] w-[200%] h-full flex transition-all duration-700 ${
              active ? "translate-x-1/2" : "translate-x-0"
            }`}
          >
            {/* PANEL LEFT - Welcome Back */}
            <div
              className={`w-1/2 flex flex-col items-center justify-center text-center px-10 transition-all duration-700 ${
                active ? "translate-x-0" : "-translate-x-full"
              }`}
            >
              <h1 className="text-4xl font-bold mb-3">¡Nos alegra verte!</h1>
              <p className="text-sm leading-relaxed mb-6 px-8 opacity-90">
                Si ya tienes cuenta, inicia sesión y continúa justo donde lo dejaste. Tus chats te están esperando.
              </p>
              <button
                onClick={() => setActive(false)}
                className="border-2 border-white text-white font-semibold px-10 py-2.5 rounded-lg text-sm uppercase tracking-wider hover:bg-white hover:text-purple-600 transition cursor-pointer"
              >
                Iniciar Sesión
              </button>
            </div>

            {/* PANEL RIGHT - Hello Friend */}
            <div
              className={`w-1/2 flex flex-col items-center justify-center text-center px-10 transition-all duration-700 ${
                active ? "translate-x-full" : "translate-x-0"
              }`}
            >
              <h1 className="text-4xl font-bold mb-3">¡Hola! Qué bueno tenerte aquí</h1>
              <p className="text-sm leading-relaxed mb-6 px-8 opacity-90">
                Crea tu cuenta para guardar tus conversaciones, sincronizar tus ideas y seguir aprendiendo cada día.
              </p>
              <button
                onClick={() => setActive(true)}
                className="border-2 border-white text-white font-semibold px-10 py-2.5 rounded-lg text-sm uppercase tracking-wider hover:bg-white hover:text-purple-600 transition cursor-pointer"
              >
                Registrarse
              </button>
            </div>
          </div>
        </div>
      </div>
      <ForgotPassword isOpen={isForgotPasswordOpen} onClose={() => setIsForgotPasswordOpen(false)} />
    </div>
  );
}

/* EXTRA COMPONENTS */
function Icon({ children }) {
  return (
    <a className="border border-gray-300 rounded-lg flex items-center justify-center w-10 h-10 text-base text-gray-700 hover:border-purple-500 hover:text-purple-600 transition cursor-pointer">
      {children}
    </a>
  );
}

export default LoginRegister;
