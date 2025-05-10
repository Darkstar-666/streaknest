import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/ThemeProvider";
import { useRef } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Add a wavy animation class on click
  const handleClick = () => {
    const btn = buttonRef.current;
    if (btn) {
      btn.classList.remove("animate-wavy");
      // Force reflow to restart animation
      void btn.offsetWidth;
      btn.classList.add("animate-wavy");
    }
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <Button
      ref={buttonRef}
      variant="outline"
      size="icon"
      className={
        `rounded-full border-2 transition-colors duration-200 relative overflow-hidden ` +
        (theme === "dark"
          ? "bg-white text-black border-black hover:bg-gray-200"
          : "bg-black text-white border-white hover:bg-gray-800")
      }
      onClick={handleClick}
    >
      <span className="absolute inset-0 pointer-events-none z-0 animate-none" />
      {theme === "dark" ? (
        <Sun className="h-[1.2rem] w-[1.2rem] text-black relative z-10" />
      ) : (
        <Moon className="h-[1.2rem] w-[1.2rem] text-white relative z-10" />
      )}
      <span className="sr-only">Toggle theme</span>
      <style>{`
        @keyframes wavy {
          0% {
            box-shadow: 0 0 0 0 rgba(59,130,246,0.3), 0 0 0 0 rgba(250,204,21,0.3), 0 0 0 0 rgba(34,197,94,0.3);
          }
          30% {
            box-shadow: 0 0 0 8px rgba(59,130,246,0.15), 0 0 0 16px rgba(250,204,21,0.12), 0 0 0 24px rgba(34,197,94,0.10);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(59,130,246,0), 0 0 0 0 rgba(250,204,21,0), 0 0 0 0 rgba(34,197,94,0);
          }
        }
        .animate-wavy {
          animation: wavy 0.7s cubic-bezier(.4,0,.2,1);
        }
      `}</style>
    </Button>
  );
}
