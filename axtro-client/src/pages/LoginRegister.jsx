import { useState } from "react";
import { FaGooglePlusG, FaFacebookF, FaGithub, FaLinkedinIn } from "react-icons/fa";

const LoginRegister = () => {

  const [active, setActive] = useState(false);

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
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Crear Cuenta</h1>

          <div className="flex gap-3 mb-6">
            <Icon><FaGooglePlusG /></Icon>
            <Icon><FaFacebookF /></Icon>
            <Icon><FaGithub /></Icon>
            <Icon><FaLinkedinIn /></Icon>
          </div>

          <span className="text-xs text-gray-600 mb-4">o usa tu correo para registrarte</span>

          <input type="text" placeholder="Nombre" className="w-full bg-gray-100 border-none rounded-lg px-4 py-3 mb-3 text-sm outline-none focus:bg-gray-200 transition" />
          <input type="email" placeholder="Correo Electrónico" className="w-full bg-gray-100 border-none rounded-lg px-4 py-3 mb-3 text-sm outline-none focus:bg-gray-200 transition" />
          <input type="password" placeholder="Contraseña" className="w-full bg-gray-100 border-none rounded-lg px-4 py-3 mb-4 text-sm outline-none focus:bg-gray-200 transition" />

          <button className="bg-purple-600 text-white font-semibold px-10 py-3 rounded-lg text-sm uppercase tracking-wider hover:bg-purple-700 transition">Registrarse</button>
        </div>

        {/* SIGN IN */}
        <div
          className={`absolute top-0 h-full w-1/2 flex flex-col items-center justify-center px-12 transition-all duration-700 ${
            active ? "-translate-x-full opacity-0 pointer-events-none" : "opacity-100 z-20"
          }`}
        >
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Iniciar Sesión</h1>

          <div className="flex gap-3 mb-6">
            <Icon><FaGooglePlusG /></Icon>
            <Icon><FaFacebookF /></Icon>
            <Icon><FaGithub /></Icon>
            <Icon><FaLinkedinIn /></Icon>
          </div>

          <span className="text-xs text-gray-600 mb-4">o usa tu correo y contraseña</span>

          <input type="email" placeholder="Correo Electrónico" className="w-full bg-gray-100 border-none rounded-lg px-4 py-3 mb-3 text-sm outline-none focus:bg-gray-200 transition" />
          <input type="password" placeholder="Contraseña" className="w-full bg-gray-100 border-none rounded-lg px-4 py-3 mb-2 text-sm outline-none focus:bg-gray-200 transition" />

          <a href="#" className="text-xs text-gray-600 hover:text-gray-800 mb-4">¿Olvidaste tu contraseña?</a>

          <button className="bg-purple-600 text-white font-semibold px-10 py-3 rounded-lg text-sm uppercase tracking-wider hover:bg-purple-700 transition">Iniciar Sesión</button>
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
              <h1 className="text-4xl font-bold mb-3">¡Bienvenido de Nuevo!</h1>
              <p className="text-sm leading-relaxed mb-6 px-8">
                Ingresa tus datos personales para usar todas las funciones del sitio
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
              <h1 className="text-4xl font-bold mb-3">¡Hola, Amigo!</h1>
              <p className="text-sm leading-relaxed mb-6 px-8">
                Regístrate con tus datos personales para usar todas las funciones del sitio
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
