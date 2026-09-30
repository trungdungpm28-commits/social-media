import { useEffect, useState } from 'react';
import { AuthPage } from './pages/AuthPage';
import { authApi } from './api/authApi';
import type { UserProfile } from './types/auth.types';
import { Navbar } from './components/Navbar';
import { HomePage } from './pages/HomePage';
import axios from 'axios';

export default function App() {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(() =>
    Boolean(localStorage.getItem('access_token')),
  );

  const fetchProfile = async () => {
    try {
      // Lấy thông tin user hiện tại
      const profile = await authApi.getMe();
      setCurrentUser(profile);
    } catch (error) {
      setCurrentUser(null);
      if (axios.isAxiosError(error) && [401, 403].includes(error.response?.status ?? 0)) {
        authApi.logout();
      }
    } finally {
      setCheckingAuth(false);
    }
  };

  const handleLogout = async () => {
    authApi.logout();
    setCurrentUser(null);
  };

  useEffect(() => {
    if (localStorage.getItem('access_token')) {
      void Promise.resolve().then(fetchProfile);
    }
  }, []);

  // Đang kiểm tra trạng thái đăng nhập
  if (checkingAuth) {
    return (
      <main className="auth-checking" aria-live="polite">
        Checking authentication...
      </main>
    );
  }

  // Chưa đăng nhập => hiển thị trang đăng nhập / đăng ký
  if (!currentUser) {
    return <AuthPage onLoginSuccess={fetchProfile} />;
  }

  // Đã đăng nhập => hiển thị trang chính
  return (
    <>
      <Navbar user={currentUser} onLogout={handleLogout} />
      <HomePage user={currentUser} />
    </>
  );
}