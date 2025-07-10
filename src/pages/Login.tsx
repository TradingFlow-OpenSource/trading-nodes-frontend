
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LogIn, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import LoginModal from '@/components/auth/LoginModal';
import { useAuthStore } from '@/store/useAuthStore';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

export const Login = () => {
  const { t } = useTranslation();
  const { wholeUser } = useAuthStore();
  const { isAuthenticated } = useAuth(); // 使用isAuthenticated而不是fetchUser
  const navigate = useNavigate();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // 如果用户已登录，直接跳转到dashboard
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
    // 移除fetchUser依赖，避免循环请求
  }, [isAuthenticated, navigate]);

  const handleLoginSuccess = () => {
    toast({
      title: "Welcome!",
      description: "You have successfully logged in.",
    });
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* Back Button */}
        <Link to="/" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-8">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>

        <div className="node-card">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-primary rounded-full mx-auto mb-4 flex items-center justify-center">
              <LogIn className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold gradient-text">
              {t('auth.login.title')}
            </h1>
            <p className="text-muted-foreground mt-2">
              {t('auth.login.subtitle')}
            </p>
          </div>

          <div className="space-y-6">
            <Button
              onClick={() => setIsLoginModalOpen(true)}
              className="w-full btn-primary"
            >
              <LogIn className="w-4 h-4 mr-2" />
              Sign In with TradingFlow
            </Button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Login with Google or Web3 Wallet
            </p>
          </div>
        </div>

        {/* 登录模态框 */}
        <LoginModal
          isOpen={isLoginModalOpen}
          onClose={() => setIsLoginModalOpen(false)}
          onLoginCallback={handleLoginSuccess}
        />
      </div>
    </div>
  );
};
