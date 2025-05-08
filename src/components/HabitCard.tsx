
import { Book, Droplet, Activity, Check, CirclePercent } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useHabits, Habit } from "@/contexts/HabitContext";

const iconMap = {
  droplet: <Droplet className="h-6 w-6" />,
  activity: <Activity className="h-6 w-6" />,
  book: <Book className="h-6 w-6" />,
};

export function HabitCard({ habit }: { habit: Habit }) {
  const { incrementHabit } = useHabits();
  const progress = (habit.count / habit.goal) * 100;
  const clampedProgress = Math.min(100, progress);
  
  const getNextAchievement = () => {
    const unachieved = habit.achievements.find(a => !a.achieved);
    return unachieved || null;
  };

  const nextAchievement = getNextAchievement();

  return (
    <Card className="overflow-hidden border-2 transition-all duration-300 hover:shadow-md dark:bg-card bg-white">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="rounded-full bg-accent/20 p-2 dark:bg-accent/10">
              {/* @ts-ignore */}
              {iconMap[habit.icon]}
            </div>
            <CardTitle className="text-lg">{habit.name}</CardTitle>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <CirclePercent className="h-4 w-4" />
            <span className="text-sm font-medium">
              {Math.min(100, Math.floor(progress))}%
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
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary progress-bar-animation"
              style={{ width: `${clampedProgress}%` }}
            ></div>
          </div>
        </div>

        {nextAchievement && (
          <div className="mb-2 mt-3 rounded-md border border-accent/30 bg-accent/10 p-2 text-sm dark:border-accent/20 dark:bg-accent/5">
            <p className="font-medium">Next achievement:</p>
            <div className="flex items-center justify-between mt-1">
              <span>{nextAchievement.title}</span>
              <span>{habit.count}/{nextAchievement.threshold}</span>
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-2">
        <Button 
          onClick={() => incrementHabit(habit.id)} 
          className="w-full bg-secondary hover:bg-secondary/90 text-white"
        >
          Track Progress
        </Button>
      </CardFooter>
    </Card>
  );
}
