import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export default function RecoveryRedirect() {
  const { isRecoveryMode } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isRecoveryMode && location.pathname !== '/auth') {
      console.log('RecoveryRedirect: Redirecting to /auth for password reset');
      navigate('/auth', { replace: true });
    }
  }, [isRecoveryMode, location.pathname, navigate]);

  return null;
}