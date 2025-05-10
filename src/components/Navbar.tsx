import * as React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { Home, BarChart2, Settings } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';

const Navbar: React.FC = () => {
  const location = useLocation();
  const { user } = useUser();
  if (!user) return null;
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container flex h-14 items-center px-4" aria-label="Main Navigation">
        <Link to="/" className="flex items-center space-x-2">
          <span className="font-bold text-lg">Streaknest</span>
        </Link>
        <div className="flex-1" />
        <div className="flex items-center gap-2">
          <Link to="/">
            <button
              aria-label="Home"
              className={`rounded-full p-2 transition-colors ${location.pathname === '/' ? 'bg-primary/10 text-primary' : 'hover:bg-muted text-muted-foreground'}`}
            >
              <Home className="h-5 w-5" />
            </button>
          </Link>
          <Link to="/statistics">
            <button
              aria-label="Statistics"
              className={`rounded-full p-2 transition-colors ${location.pathname === '/statistics' ? 'bg-primary/10 text-primary' : 'hover:bg-muted text-muted-foreground'}`}
            >
              <BarChart2 className="h-5 w-5" />
            </button>
          </Link>
          <Link to="/manage-habits">
            <button
              aria-label="Manage Habits"
              className={`rounded-full p-2 transition-colors ${location.pathname === '/manage-habits' ? 'bg-primary/10 text-primary' : 'hover:bg-muted text-muted-foreground'}`}
            >
              <Settings className="h-5 w-5" />
            </button>
          </Link>
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
