import { useState } from 'react';
import { AuthProvider } from './auth/AuthProvider';
import { useAuth } from './auth/useAuth';
import { AuthPage } from './pages/AuthPage';
import { Navbar } from './components/Navbar';
import { HomePage } from './pages/HomePage';

const AppContent = () => {
  const { user, isLoading, signOut } = useAuth();
  const [composerOpen, setComposerOpen] = useState(false);

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f4f5fb] text-sm font-medium text-slate-500" aria-live="polite">
        Checking your session…
      </main>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  return (
    <>
      <Navbar
        user={user}
        onLogout={signOut}
        onCreatePost={() => setComposerOpen(true)}
      />
      <HomePage
        user={user}
        composerOpen={composerOpen}
        onOpenComposer={() => setComposerOpen(true)}
        onCloseComposer={() => setComposerOpen(false)}
      />
    </>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
