import api from './api.js';

/**
 * Servicio de autenticación
 */
export const authService = {
  /**
   * Registra un nuevo usuario
   * @param {string} name - Nombre del usuario
   * @param {string} email - Email del usuario
   * @param {string} password - Contraseña del usuario
   * @returns {Promise<{success: boolean, token?: string, message?: string}>}
   */
  async register(name, email, password) {
    try {
      const response = await api.post('/user/register', {
        name,
        email,
        password,
      });
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Error al registrar usuario',
      };
    }
  },

  /**
   * Inicia sesión con un usuario existente
   * @param {string} email - Email del usuario
   * @param {string} password - Contraseña del usuario
   * @returns {Promise<{success: boolean, token?: string, message?: string}>}
   */
  async login(email, password) {
    try {
      const response = await api.post('/user/login', {
        email,
        password,
      });
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Error al iniciar sesión',
      };
    }
  },

  /**
   * Obtiene los datos del usuario autenticado
   * @returns {Promise<{success: boolean, user?: object, message?: string}>}
   */
  async getUserData() {
    try {
      const response = await api.get('/user/data');
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Error al obtener datos del usuario',
      };
    }
  },

  /**
   * Guarda el token en localStorage
   * @param {string} token - Token JWT
   */
  saveToken(token) {
    localStorage.setItem('token', token);
  },

  /**
   * Obtiene el token del localStorage
   * @returns {string|null}
   */
  getToken() {
    return localStorage.getItem('token');
  },

  /**
   * Elimina el token del localStorage (logout)
   */
  removeToken() {
    localStorage.removeItem('token');
  },
};

