
import { useEffect, useState, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LogIn, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

interface AuthGuardProps {
  children?: ReactNode;
}

export const AuthGuard = ({ children }: AuthGuardProps) => {
  const { t } = useTranslation();
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(8);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            navigate('/login');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="max-w-md mx-auto text-center p-8">
          <div className="w-16 h-16 bg-gradient-primary rounded-full mx-auto mb-6 flex items-center justify-center">
            <LogIn className="w-8 h-8 text-white" />
          </div>
          
          <h1 className="text-2xl font-bold mb-4 gradient-text">
            {t('auth.login.title')}
          </h1>
          
          <p className="text-muted-foreground mb-8">
            {t('auth.redirect.message')}
          </p>
          
          <div className="node-card mb-6">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Clock className="w-5 h-5 text-primary" />
              <span className="text-lg font-medium">
                {t('auth.redirect.countdown', { seconds: countdown })}
              </span>
            </div>
            
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="bg-gradient-primary h-2 rounded-full transition-all duration-1000"
                style={{ width: `${((8 - countdown) / 8) * 100}%` }}
              ></div>
            </div>
          </div>
          
          <Button 
            onClick={() => navigate('/login')}
            className="btn-primary"
          >
            {t('auth.redirect.manual')}
          </Button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
