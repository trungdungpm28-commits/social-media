import type { UserProfile } from '../types/auth.types';

interface NavbarProps {
  user: UserProfile | null;
  onLogout: () => void;
  onCreatePost: () => void;
}

export const Navbar = ({ user, onLogout, onCreatePost }: NavbarProps) => {
  const displayName = [user?.firstName, user?.lastName].filter(Boolean).join(' ')
    || user?.email.split('@')[0]
    || 'Your name';

  return (
    <nav className="sticky top-0 z-10 border-b border-slate-200 bg-white shadow-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <a href="/" className="flex items-center gap-2 text-xl font-extrabold tracking-tight text-blue-600" aria-label="Social App home">
          <span className="grid size-10 place-items-center rounded-full bg-blue-600 text-2xl text-white">S</span>
          <span className="hidden sm:inline">Social App</span>
        </a>

        <button
          type="button"
          onClick={onCreatePost}
          className="rounded-full bg-slate-100 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          Create post
        </button>

        <div className="flex items-center gap-2 sm:gap-4">
          <span className="hidden max-w-40 truncate text-sm font-semibold text-slate-700 sm:block">{displayName}</span>
          <button
            type="button"
            aria-label="Sign out"
            title="Sign out"
            onClick={onLogout}
            className="rounded-full px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            Sign out
          </button>
        </div>
      </div>
    </nav>
  );
};