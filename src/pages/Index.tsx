
import { useState } from "react";
import { HabitCard } from "@/components/HabitCard";
import { ThemeToggle } from "@/components/ThemeToggle";
import { HabitProvider, useHabits } from "@/contexts/HabitContext";
import { ThemeProvider } from "@/components/ThemeProvider";
import { StatisticsSection } from "@/components/StatisticsSection";
import { AchievementsSection } from "@/components/AchievementsSection";
import { Button } from "@/components/ui/button";

function HabitTracker() {
  const { habits, resetCounts } = useHabits();
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  return (
    <div className="container max-w-4xl px-4 py-8">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Nordic Habit Tracker</h1>
          <p className="text-muted-foreground">Track your daily habits and build better routines</p>
        </div>
        <ThemeToggle />
      </header>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {habits.map((habit) => (
          <HabitCard key={habit.id} habit={habit} />
        ))}
      </div>

      <StatisticsSection />
      <AchievementsSection />

      <div className="mt-12 flex justify-center">
        {!showResetConfirm ? (
          <Button 
            variant="outline" 
            onClick={() => setShowResetConfirm(true)}
            className="text-muted-foreground"
          >
            Reset All Counts
          </Button>
        ) : (
          <div className="flex gap-4">
            <Button 
              variant="destructive" 
              onClick={() => {
                resetCounts();
                setShowResetConfirm(false);
              }}
            >
              Confirm Reset
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setShowResetConfirm(false)}
            >
              Cancel
            </Button>
          </div>
        )}
      </div>
      
      <footer className="mt-12 border-t border-border pt-4 text-center text-sm text-muted-foreground">
        Nordic Habit Tracker &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
}

const Index = () => {
  return (
    <ThemeProvider defaultTheme="light">
      <HabitProvider>
        <HabitTracker />
      </HabitProvider>
    </ThemeProvider>
  );
};

export default Index;
