
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ChartLine, Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const Navbar: React.FC = () => {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="mr-2">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col gap-4 mt-8">
              <Link 
                to="/"
                className="flex items-center gap-2 px-2 py-1 text-lg font-medium rounded-md hover:bg-accent"
              >
                Home
              </Link>
              <Link 
                to="/statistics"
                className="flex items-center gap-2 px-2 py-1 text-lg font-medium rounded-md hover:bg-accent"
              >
                <ChartLine className="h-5 w-5" />
                Statistics
              </Link>
            </nav>
          </SheetContent>
        </Sheet>
        
        <Link to="/" className="flex items-center space-x-2">
          <span className="font-bold text-lg">Habit Tracker</span>
        </Link>

        <div className="flex-1" />

        <div className="flex items-center gap-2">
          <Link to="/statistics">
            <Button variant="ghost" size="icon">
              <ChartLine className="h-5 w-5" />
              <span className="sr-only">Statistics</span>
            </Button>
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
