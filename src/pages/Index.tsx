import * as React from 'react';
import { useHabits } from '@/contexts/HabitContext';
import { HabitCard } from '@/components/HabitCard';
import { StatisticsSection } from '@/components/StatisticsSection';
import { AchievementsSection } from '@/components/AchievementsSection';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { PlusCircle } from 'lucide-react';

interface IndexProps {
  triggerCongrats?: (msg?: string) => void;
}

const Index: React.FC<IndexProps> = ({ triggerCongrats }) => {
  const { habits, isLoading, error } = useHabits();

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-500">
          <p>Error loading habits. Please try refreshing the page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8 bg-white/70 backdrop-blur dark:bg-background rounded-xl overflow-x-hidden min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-center sm:text-left">Streaknest</h1>
        <Link to="/manage-habits">
          <Button className="w-full sm:w-auto min-h-[44px] min-w-[44px] text-base sm:text-lg bg-gradient-to-r from-blue-500 to-green-400 text-white border-0 shadow-lg hover:brightness-110 transition">
            <PlusCircle className="mr-2 h-5 w-5 sm:h-6 sm:w-6" /> Manage Habits
          </Button>
        </Link>
      </div>
      <React.Suspense fallback={
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      }>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
          {isLoading ? (
            <div className="col-span-full text-center p-6 sm:p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading habits...</p>
            </div>
          ) : habits.length === 0 ? (
            <div className="col-span-full text-center p-6 sm:p-8">
              <p className="text-muted-foreground mb-4 text-base sm:text-lg">You don't have any habits yet.</p>
              <Link to="/manage-habits">
                <Button className="w-full sm:w-auto min-h-[44px] min-w-[44px] text-base sm:text-lg bg-gradient-to-r from-blue-500 to-green-400 text-white border-0 shadow-lg hover:brightness-110 transition">
                  <PlusCircle className="mr-2 h-5 w-5 sm:h-6 sm:w-6" /> Add Your First Habit
                </Button>
              </Link>
            </div>
          ) : (
            habits.map((habit) => (
              <HabitCard key={habit.id} habit={habit} triggerCongrats={triggerCongrats} />
            ))
          )}
        </div>
        {habits.length > 0 && (
          <>
            <StatisticsSection />
            <AchievementsSection />
          </>
        )}
      </React.Suspense>
    </div>
  );
};

export default Index;
