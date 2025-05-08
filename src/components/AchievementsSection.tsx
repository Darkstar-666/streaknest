
import { Check } from "lucide-react";
import { useHabits } from "@/contexts/HabitContext";

export function AchievementsSection() {
  const { habits } = useHabits();
  
  // Flatten all achievements across habits
  const allAchievements = habits.flatMap(habit => 
    habit.achievements.map(achievement => ({
      ...achievement,
      habitName: habit.name,
      icon: habit.icon
    }))
  );
  
  // Sort achievements: achieved first, then by habit name
  const sortedAchievements = [...allAchievements].sort((a, b) => {
    if (a.achieved !== b.achieved) {
      return a.achieved ? -1 : 1;
    }
    return a.habitName.localeCompare(b.habitName);
  });

  const achievedCount = allAchievements.filter(a => a.achieved).length;
  const totalCount = allAchievements.length;
  const progressPercentage = totalCount > 0 ? Math.round((achievedCount / totalCount) * 100) : 0;

  return (
    <div className="mt-8">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold">Achievements</h2>
        <div className="text-sm text-muted-foreground">
          {achievedCount}/{totalCount} ({progressPercentage}%)
        </div>
      </div>

      <div className="h-2 w-full overflow-hidden rounded-full bg-muted mb-4">
        <div 
          className="h-full rounded-full bg-secondary progress-bar-animation" 
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {sortedAchievements.map((achievement) => (
          <div
            key={achievement.id}
            className={`rounded-lg border p-3 transition-all ${
              achievement.achieved 
                ? "border-accent/50 bg-accent/10 dark:border-accent/30 dark:bg-accent/5"
                : "border-muted bg-muted/20 opacity-70"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="font-medium">{achievement.title}</div>
              {achievement.achieved && (
                <div className="rounded-full bg-accent p-1">
                  <Check className="h-3 w-3 text-white" />
                </div>
              )}
            </div>
            <p className="mt-1 text-sm text-muted-foreground">{achievement.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
