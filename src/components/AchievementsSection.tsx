import { Check } from "lucide-react";
import { useHabits } from "@/contexts/HabitContext";

export function AchievementsSection() {
  const { habits } = useHabits();
  
  // Flatten all achievements across habits and only get completed ones
  const completedAchievements = habits.flatMap(habit => 
    habit.achievements
      .filter(achievement => achievement.achieved)
      .map(achievement => ({
        ...achievement,
        habitName: habit.name,
        icon: habit.icon,
        completedAt: habit.trackingData[habit.trackingData.length - 1]?.date || new Date().toISOString()
      }))
  );
  
  // Sort achievements by completion date (latest first)
  const sortedAchievements = [...completedAchievements].sort((a, b) => 
    new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
  );

  const achievedCount = completedAchievements.length;
  const totalCount = habits.reduce((acc, habit) => acc + habit.achievements.length, 0);
  const progressPercentage = totalCount > 0 ? Math.round((achievedCount / totalCount) * 100) : 0;

  return (
    <div className="mt-8 bg-white/70 backdrop-blur dark:bg-card rounded-xl p-4">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold">Achievements</h2>
        <div className="text-sm text-muted-foreground">
          {achievedCount}/{totalCount} ({progressPercentage}%)
        </div>
      </div>

      <div className="h-2 w-full overflow-hidden rounded-full bg-muted mb-4">
        <div 
          className="h-full rounded-full progress-bar-animation" 
          style={{ width: `${progressPercentage}%`, backgroundColor: 'hsl(var(--progress-bar))' }}
        ></div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {sortedAchievements.length === 0 ? (
          <div className="col-span-full text-center p-8 border rounded-lg bg-muted/20">
            <p className="text-muted-foreground">No achievements completed yet. Keep going!</p>
          </div>
        ) : (
          sortedAchievements.map((achievement, idx) => (
            <div
              key={achievement.id}
              className="rounded-lg border p-3 transition-all"
              style={{
                background: 'linear-gradient(90deg, #0EA5E9 0%, #10B981 100%)',
                borderColor: '#0EA5E9',
                color: '#fff',
                boxShadow: '0 2px 8px 0 rgba(16,185,129,0.10)'
              }}
            >
              <div className="flex items-center justify-between">
                <div className="font-medium">{achievement.title}</div>
                <div className="rounded-full bg-white/30 p-1">
                  <Check className="h-3 w-3 text-white" />
                </div>
              </div>
              <p className="mt-1 text-sm text-white/90">{achievement.description}</p>
              <p className="mt-2 text-xs text-white/80">
                Completed on {new Date(achievement.completedAt).toLocaleDateString()}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
