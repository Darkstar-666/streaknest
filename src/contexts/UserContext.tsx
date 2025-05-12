import * as React from "react";

interface User {
  username: string;
  pin: string;
}

interface UserContextType {
  user: User | null;
  login: (username: string, pin: string) => boolean;
  signup: (username: string, pin: string) => boolean;
  logout: () => void;
}

const UserContext = React.createContext<UserContextType | undefined>(undefined);

function validateUser(u: any): User | null {
  if (!u || typeof u !== 'object') return null;
  if (!u.username || !u.pin) return null;
  return { username: String(u.username), pin: String(u.pin) };
}

const getStoredUser = (): User | null => {
  try {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) return null;
    const parsed = JSON.parse(storedUser);
    return validateUser(parsed);
  } catch {
    localStorage.removeItem('user');
    return null;
  }
};

const getStoredPin = (): string => {
  try {
    // Prefer 'pin', fallback to user.pin if present
    const pin = localStorage.getItem('pin');
    if (pin) return pin;
    const user = getStoredUser();
    return user?.pin || '';
  } catch {
    return '';
  }
};

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = React.useState<User | null>(() => getStoredUser());

  // Always sync user state with localStorage on mount
  React.useEffect(() => {
    setUser(getStoredUser());
  }, []);

  const login = React.useCallback((username: string, pin: string): boolean => {
    const storedUser = getStoredUser();
    const storedPin = getStoredPin();
    if (!storedUser || !storedPin) return false;
    if (storedUser.username === username && storedPin === pin) {
      setUser(storedUser);
      // Always ensure pin is stored
      try { localStorage.setItem('pin', pin); } catch {}
      return true;
    }
    return false;
  }, []);

  const signup = React.useCallback((username: string, pin: string): boolean => {
    const trimmedUsername = username.trim();
    if (!trimmedUsername || !pin.match(/^\d{4}$/)) return false;
    const newUser = { username: trimmedUsername, pin };
    try {
      localStorage.setItem('user', JSON.stringify(newUser));
      localStorage.setItem('pin', pin);
    } catch {}
    setUser(newUser);
    return true;
  }, []);

  const logout = React.useCallback(() => {
    try {
      localStorage.removeItem('user');
      localStorage.removeItem('pin');
      localStorage.removeItem('habits');
      localStorage.removeItem('theme');
    } catch {}
    setUser(null);
  }, []);

  const value = React.useMemo(() => ({
    user,
    login,
    signup,
    logout
  }), [user, login, signup, logout]);

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = React.useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}; 