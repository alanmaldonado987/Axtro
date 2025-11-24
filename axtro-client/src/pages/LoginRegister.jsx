import { useState, useEffect } from "react";
import { FaGooglePlusG, FaFacebookF, FaGithub, FaLinkedinIn } from "react-icons/fa";
import { authService } from "../services/authService";
import { useAppContext } from "../context/AppContext";

const LoginRegister = () => {

  const [active, setActive] = useState(false);
  const { setUser } = useAppContext();

  // Estados para el formulario de registro
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    password: ''
  });

  // Estados para el formulario de login
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  // Estados para errores y carga
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // Manejar registro
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
        // Guardar el email antes de limpiar para pasarlo al login
        const registeredEmail = registerData.email;
        
        // Mostrar mensaje de éxito
        setSuccess('Usuario creado exitosamente. Por favor inicia sesión.');
        // Limpiar formulario de registro
        setRegisterData({
          name: '',
          email: '',
          password: ''
        });
        // Cambiar a vista de login después de 2 segundos y copiar el email
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

  // Manejar login
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
        
        // Obtener datos del usuario
        const userResponse = await authService.getUserData();
        if (userResponse.success) {
          setUser(userResponse.user);
        }
      } else {
        setError(response.message || 'Error al iniciar sesión');
      }
    } catch (err) {
      setError('Error al conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  // Limpiar error y éxito cuando se cambia entre login y register
  useEffect(() => {
    setError('');
    setSuccess('');
  }, [active]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-100 via-purple-50 to-blue-50">
      <div
        className={`relative bg-white rounded-3xl shadow-2xl overflow-hidden w-[850px] max-w-[95vw] h-[550px] transition-all duration-700 ${
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
            <Icon><FaGithub /></Icon>
            <Icon><FaLinkedinIn /></Icon>
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
            <input 
              type="password" 
              placeholder="Contraseña" 
              value={registerData.password}
              onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
              className="w-full bg-gray-100 border-none rounded-lg px-4 py-3 mb-4 text-sm outline-none focus:bg-gray-200 transition" 
            />

            <button 
              type="submit"
              disabled={loading}
              className="bg-purple-600 text-white font-semibold px-10 py-3 rounded-lg text-sm uppercase tracking-wider hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed w-full"
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
            <Icon><FaGithub /></Icon>
            <Icon><FaLinkedinIn /></Icon>
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
            <input 
              type="password" 
              placeholder="Contraseña" 
              value={loginData.password}
              onChange={(e) => setLoginData({...loginData, password: e.target.value})}
              className="w-full bg-gray-100 border-none rounded-lg px-4 py-3 mb-2 text-sm outline-none focus:bg-gray-200 transition" 
            />

            <a href="#" className="text-xs text-gray-600 hover:text-gray-800 mb-4">¿Olvidaste tu contraseña?</a>

            <button 
              type="submit"
              disabled={loading}
              className="bg-purple-600 text-white font-semibold px-10 py-3 rounded-lg text-sm uppercase tracking-wider hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed w-full"
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
                className="border-2 border-white text-white font-semibold px-10 py-2.5 rounded-lg text-sm uppercase tracking-wider hover:bg-white hover:text-purple-600 transition"
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
                className="border-2 border-white text-white font-semibold px-10 py-2.5 rounded-lg text-sm uppercase tracking-wider hover:bg-white hover:text-purple-600 transition"
              >
                Registrarse
              </button>
            </div>
          </div>
        </div>
      </div>
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
