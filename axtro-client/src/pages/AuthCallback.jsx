import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { authService } from '../services/authService';
import { useAppContext } from '../context/AppContext';

const AuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setUser } = useAppContext();

  useEffect(() => {
    const token = searchParams.get('token');
    const success = searchParams.get('success');
    const error = searchParams.get('error');

    if (error) {
      // Si hay un error, redirigir al login con el mensaje de error
      navigate('/login?error=' + error);
      return;
    }

    if (success === 'true' && token) {
      // Guardar el token
      authService.saveToken(token);

      // Obtener los datos del usuario
      const fetchUserData = async () => {
        try {
          const response = await authService.getUserData();
          if (response.success) {
            setUser(response.user);
            navigate('/');
          } else {
            navigate('/login?error=user_data_failed');
          }
        } catch (err) {
          navigate('/login?error=user_data_failed');
        }
      };

      fetchUserData();
    } else {
      navigate('/login?error=invalid_callback');
    }
  }, [searchParams, navigate, setUser]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-100 via-purple-50 to-blue-50">
      <div className="text-center">
        <div className="relative w-36 h-36 mx-auto mb-6">
          <div className="absolute inset-0 border-2 border-transparent rounded-full border-t-[#8A5BFF] animate-spin-slow"></div>
          <div className="absolute inset-3 border-2 border-transparent rounded-full border-b-[#E5D6FF] animate-spin-slower"></div>
          <div className="absolute inset-6 bg-gradient-to-br from-[#7C3AED] to-[#C084FC] rounded-full blur-2xl opacity-80 animate-pulse-fast"></div>
        </div>
        <p className="text-xl font-semibold text-gray-800">Completando autenticación...</p>
        <p className="text-sm text-gray-500 mt-2">Por favor espera un momento</p>
      </div>
    </div>
  );
};

export default AuthCallback;

