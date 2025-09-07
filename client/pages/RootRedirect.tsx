import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { Loader2 } from 'lucide-react';

const RootRedirect: React.FC = () => {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { replace: true });
      return;
    }

    if (user?.role === 'admin') navigate('/admin', { replace: true });
    else navigate('/home', { replace: true });
  }, [isAuthenticated, user, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader2 className="h-8 w-8 animate-spin text-forest-500" />
    </div>
  );
};

export default RootRedirect;
