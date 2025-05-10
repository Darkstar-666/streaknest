import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { HabitProvider } from "@/contexts/HabitContext";
import ReminderNotifications from "@/components/ReminderNotifications";
import Index from "./pages/Index";
import Statistics from "./pages/Statistics";
import ManageHabits from "./pages/ManageHabits";
import NotFound from "./pages/NotFound";
import Navbar from "./components/Navbar";
import CongratsAnimation from "@/components/CongratsAnimation";
import * as React from "react";
import { UserProvider, useUser } from "@/contexts/UserContext";

function AuthenticatedApp({ triggerCongrats }: { triggerCongrats?: (msg?: string) => void }) {
  const { user } = useUser();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!user) {
      navigate('/login', { replace: true });
    }
  }, [user, navigate]);

  if (!user) return null;

  return (
    <>
      <Navbar />
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<Index triggerCongrats={triggerCongrats} />} />
          <Route path="/statistics" element={<Statistics />} />
          <Route path="/manage-habits" element={<ManageHabits />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </>
  );
}

function LoginSignupScreen() {
  const { login, signup } = useUser();
  const [username, setUsername] = React.useState("");
  const [pin, setPin] = React.useState("");
  const [mode, setMode] = React.useState<"login" | "signup">("login");
  const [error, setError] = React.useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "login") {
      if (!login(username, pin)) setError("Invalid username or PIN");
      else navigate("/", { replace: true });
    } else {
      if (!signup(username, pin)) setError("PIN must be 4-6 digits");
      else navigate("/", { replace: true });
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <form onSubmit={handleSubmit} className="bg-white/80 dark:bg-background rounded-xl p-6 shadow-lg flex flex-col gap-4 w-80 max-w-full">
        <h2 className="text-2xl font-bold text-center mb-2">{mode === "login" ? "Login" : "Create Account"}</h2>
        <input
          className="border rounded px-3 py-2 text-lg"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          autoFocus
        />
        <input
          className="border rounded px-3 py-2 text-lg"
          placeholder="4-6 digit PIN"
          value={pin}
          onChange={e => setPin(e.target.value.replace(/\D/g, ""))}
          type="password"
          maxLength={6}
          minLength={4}
        />
        {error && <div className="text-red-500 text-center text-sm">{error}</div>}
        <button type="submit" className="bg-gradient-to-r from-blue-500 to-green-400 text-white rounded py-2 font-semibold text-lg mt-2">{mode === "login" ? "Login" : "Sign Up"}</button>
        <button type="button" className="text-blue-600 underline text-sm mt-1" onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(""); }}>
          {mode === "login" ? "Create an account" : "Already have an account? Login"}
        </button>
      </form>
    </div>
  );
}

const App = () => {
  const [showCongrats, setShowCongrats] = React.useState(false);
  const [congratsMsg, setCongratsMsg] = React.useState<string | undefined>(undefined);

  const triggerCongrats = (msg?: string) => {
    setCongratsMsg(msg);
    setShowCongrats(true);
  };

  const handleCongratsClose = () => {
    setShowCongrats(false);
  };

  return (
    <BrowserRouter>
      <UserProvider>
        <ThemeProvider defaultTheme="light">
          <HabitProvider>
            <CongratsAnimation show={showCongrats} onClose={handleCongratsClose} />
            <ReminderNotifications />
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <div className="min-h-screen flex flex-col">
                <Routes>
                  <Route path="/login" element={<LoginSignupScreen />} />
                  <Route path="/*" element={<AuthenticatedApp triggerCongrats={triggerCongrats} />} />
                </Routes>
              </div>
            </TooltipProvider>
          </HabitProvider>
        </ThemeProvider>
      </UserProvider>
    </BrowserRouter>
  );
};

export default App;
