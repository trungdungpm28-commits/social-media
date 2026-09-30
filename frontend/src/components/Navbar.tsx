// frontend/src/components/Navbar.tsx

import type { UserProfile } from '../types/auth.types';

interface NavbarProps {
  user: UserProfile | null;
  onLogout: () => void;
}

export const Navbar = ({ user, onLogout }: NavbarProps) => {
  return (
    <nav className="navbar">
      <div className="navbar-content">
        <a className="brand" href="/" aria-label="Social App home">
          <span className="brand-mark" aria-hidden="true">S</span>
          <span>Social App</span>
        </a>
        <div className="navbar-user">
          {user ? (
            <>
              <span className="navbar-greeting">Hello, <strong>{user.email}</strong></span>
              <button className="signout-button" type="button" onClick={onLogout}>
                Sign Out
              </button>
            </>
          ) : (
            <span className="navbar-greeting">Not signed in</span>
          )}
        </div>
      </div>
    </nav>
  );
};