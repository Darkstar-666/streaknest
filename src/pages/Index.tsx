
import React from 'react';
import { useHabits } from '@/contexts/HabitContext';
import { HabitCard } from '@/components/HabitCard';
import { StatisticsSection } from '@/components/StatisticsSection';
import { AchievementsSection } from '@/components/AchievementsSection';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { PlusCircle } from 'lucide-react';

const Index = () => {
  const { habits } = useHabits();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Habit Tracker</h1>
        <Link to="/manage-habits">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" /> Manage Habits
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {habits.length === 0 ? (
          <div className="col-span-full text-center p-8">
            <p className="text-muted-foreground mb-4">You don't have any habits yet.</p>
            <Link to="/manage-habits">
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" /> Add Your First Habit
              </Button>
            </Link>
          </div>
        ) : (
          habits.map((habit) => (
            <HabitCard key={habit.id} habit={habit} />
          ))
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <StatisticsSection />
        <AchievementsSection />
      </div>
    </div>
  );
};

export default Index;
