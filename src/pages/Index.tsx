
import React from 'react';
import { useHabits } from '@/contexts/HabitContext';
import { HabitCard } from '@/components/HabitCard';
import { StatisticsSection } from '@/components/StatisticsSection';
import { AchievementsSection } from '@/components/AchievementsSection';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PlusCircle } from 'lucide-react';

const Index = () => {
  const { habits, addHabit } = useHabits();
  const [newHabitName, setNewHabitName] = React.useState('');

  const handleAddHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newHabitName.trim()) {
      addHabit(newHabitName.trim());
      setNewHabitName('');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Habit Tracker</h1>

      <form onSubmit={handleAddHabit} className="flex gap-4 mb-8">
        <Input
          type="text"
          placeholder="Add a new habit..."
          value={newHabitName}
          onChange={(e) => setNewHabitName(e.target.value)}
          className="flex-grow"
        />
        <Button type="submit" disabled={!newHabitName.trim()}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Habit
        </Button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {habits.map((habit) => (
          <HabitCard key={habit.id} habit={habit} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <StatisticsSection />
        <AchievementsSection />
      </div>
    </div>
  );
};

export default Index;
