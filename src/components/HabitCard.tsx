import * as React from "react";
import { Book, Droplet, Activity, Check, CirclePercent, Flame, Sprout, Moon, Utensils, GraduationCap, Brush, Footprints } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useHabits, Habit } from "@/contexts/HabitContext";

// Memoize icon map to prevent unnecessary re-renders
const iconMap = React.useMemo(() => ({
  droplet: <Droplet className="h-6 w-6" />,
  activity: <Activity className="h-6 w-6" />,
  book: <Book className="h-6 w-6" />,
  flame: <Flame className="h-6 w-6" />,
  sprout: <Sprout className="h-6 w-6" />,
  moon: <Moon className="h-6 w-6" />,
  utensils: <Utensils className="h-6 w-6" />,
  "graduation-cap": <GraduationCap className="h-6 w-6" />,
  brush: <Brush className="h-6 w-6" />,
  footprints: <Footprints className="h-6 w-6" />,
  circle: <CirclePercent className="h-6 w-6" /> // fallback
}), []);

// Memoize the progress bar component
const ProgressBar = React.memo(({ progress }: { progress: number }) => (
  <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
    <div
      className="h-full rounded-full progress-bar-animation"
      style={{ width: `${progress}%`, backgroundColor: 'hsl(var(--progress-bar))' }}
    />
  </div>
));

// Memoize the achievement component
const AchievementDisplay = React.memo(({ achievement, currentCount }: { achievement: any; currentCount: number }) => (
  <div className="mb-2 mt-3 rounded-md border p-2 text-sm"
    style={{
      background: 'linear-gradient(90deg, #F59E42 0%, #0EA5E9 100%)',
      borderColor: '#F59E42',
      color: '#fff',
      boxShadow: '0 2px 8px 0 rgba(14,165,233,0.10)'
    }}
  >
    <p className="font-medium">Next achievement:</p>
    <div className="flex items-center justify-between mt-1">
      <span>{achievement.title}</span>
      <span>{currentCount}/{achievement.threshold}</span>
    </div>
  </div>
));

export const HabitCard = React.memo(({ habit, triggerCongrats }: { habit: Habit; triggerCongrats?: (msg?: string) => void }) => {
  const { incrementHabit } = useHabits();
  const progress = React.useMemo(() => Math.min(100, (habit.count / habit.goal) * 100), [habit.count, habit.goal]);
  
  const nextAchievement = React.useMemo(() => 
    habit.achievements.find(a => !a.achieved) || null,
    [habit.achievements]
  );

  const handleTrackProgress = React.useCallback(() => {
    const willComplete = habit.count + 1 === habit.goal;
    incrementHabit(habit.id);
    if (willComplete && triggerCongrats) {
      triggerCongrats();
    }
  }, [habit.count, habit.goal, habit.id, incrementHabit, triggerCongrats]);

  return (
    <Card className="overflow-hidden border-2 transition-all duration-300 hover:shadow-md bg-white/70 backdrop-blur dark:bg-card">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="rounded-full bg-accent/20 p-2 dark:bg-accent/10">
              {iconMap[habit.icon] || iconMap.circle}
            </div>
            <CardTitle className="text-lg">{habit.name}</CardTitle>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <CirclePercent className="h-4 w-4" />
            <span className="text-sm font-medium">
              {Math.floor(progress)}%
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="mb-2">
          <div className="mb-1 flex justify-between text-sm">
            <span>{habit.count} / {habit.goal}</span>
            <span className="flex items-center gap-1">
              <div className="h-3 w-3 rounded-full bg-primary"></div>
              <span>Streak: {habit.streak}</span>
            </span>
          </div>
          <ProgressBar progress={progress} />
        </div>

        {nextAchievement && (
          <AchievementDisplay 
            achievement={nextAchievement} 
            currentCount={habit.count} 
          />
        )}
      </CardContent>

      <CardFooter className="pt-2 flex justify-start">
        <Button 
          onClick={handleTrackProgress} 
          className="relative overflow-hidden text-white font-semibold px-6 py-2 rounded-lg shadow-md transition-transform duration-200
            bg-gradient-to-r from-primary via-[#0EA5E9] to-[#10B981]
            hover:from-[#10B981] hover:via-[#F59E42] hover:to-[#0EA5E9]
            hover:scale-105
            dark:bg-[hsl(var(--track-button-dark))] dark:hover:bg-[hsl(var(--track-button-dark))/90]"
          style={{
            backgroundSize: '200% 200%',
            backgroundPosition: 'left center',
          }}
        >
          <span className="relative z-10">Track Progress</span>
          <span className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </Button>
      </CardFooter>
    </Card>
  );
});
