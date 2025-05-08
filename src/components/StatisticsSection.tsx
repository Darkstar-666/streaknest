
import { useHabits } from "@/contexts/HabitContext";

export function StatisticsSection() {
  const { habits } = useHabits();
  
  const totalCount = habits.reduce((acc, habit) => acc + habit.count, 0);
  const totalStreak = habits.reduce((acc, habit) => acc + habit.streak, 0);
  const highestStreak = Math.max(...habits.map(habit => habit.streak));
  
  const stats = [
    { name: "Total Activities", value: totalCount },
    { name: "Total Streaks", value: totalStreak },
    { name: "Highest Streak", value: highestStreak },
    { name: "Active Habits", value: habits.length },
  ];
  
  return (
    <div className="mt-8 mb-6">
      <h2 className="mb-4 text-xl font-bold">Statistics</h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="rounded-lg border bg-card p-4 shadow-sm transition-all hover:shadow-md"
          >
            <div className="text-2xl font-bold text-primary dark:text-primary">
              {stat.value}
            </div>
            <div className="text-sm text-muted-foreground">{stat.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
