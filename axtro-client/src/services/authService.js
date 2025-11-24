import axiosClient from '../interceptors/axiosClient.js';

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
      const response = await axiosClient.post('/user/register', {
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
      const response = await axiosClient.post('/user/login', {
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
      const response = await axiosClient.get('/user/data');
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

  /**
   * Actualiza el perfil del usuario
   * @param {object} profileData - Datos del perfil a actualizar
   * @param {string} profileData.name - Nombre para mostrar
   * @param {string} profileData.username - Nombre de usuario
   * @param {string} profileData.profilePicture - Foto de perfil (base64 o URL)
   * @returns {Promise<{success: boolean, user?: object, message?: string}>}
   */
  async updateProfile(profileData) {
    try {
      const response = await axiosClient.put('/user/update', profileData);
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Error al actualizar el perfil',
      };
    }
  },

  /**
   * Solicita un código OTP para restablecer la contraseña
   * @param {string} email - Email del usuario
   * @returns {Promise<{success: boolean, message?: string}>}
   */
  async requestPasswordReset(email) {
    try {
      const response = await axiosClient.post('/user/forgot-password/request', { email });
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Error al solicitar restablecimiento',
      };
    }
  },

  /**
   * Verifica el código OTP
   * @param {string} email - Email del usuario
   * @param {string} code - Código OTP
   * @returns {Promise<{success: boolean, message?: string}>}
   */
  async verifyOTP(email, code) {
    try {
      const response = await axiosClient.post('/user/forgot-password/verify', { email, code });
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Error al verificar el código',
      };
    }
  },

  /**
   * Restablece la contraseña del usuario
   * @param {string} email - Email del usuario
   * @param {string} code - Código OTP verificado
   * @param {string} newPassword - Nueva contraseña
   * @returns {Promise<{success: boolean, message?: string}>}
   */
  async resetPassword(email, code, newPassword) {
    try {
      const response = await axiosClient.post('/user/forgot-password/reset', {
        email,
        code,
        newPassword,
      });
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Error al restablecer la contraseña',
      };
    }
  },
};

