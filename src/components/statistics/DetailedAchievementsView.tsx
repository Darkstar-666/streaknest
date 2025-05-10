import React from "react";
import { useHabits } from "@/contexts/HabitContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, Trophy } from "lucide-react";

export const DetailedAchievementsView = () => {
  const { habits } = useHabits();
  
  // Calculate overall achievement statistics
  const totalAchievements = habits.reduce((acc, habit) => acc + habit.achievements.length, 0);
  const completedAchievements = habits.reduce((acc, habit) => 
    acc + habit.achievements.filter(a => a.achieved).length, 0
  );
  const progressPercentage = totalAchievements > 0 
    ? Math.round((completedAchievements / totalAchievements) * 100) 
    : 0;

  // Group achievements by habit
  const achievementsByHabit = habits.map(habit => ({
    habitName: habit.name,
    icon: habit.icon,
    achievements: habit.achievements,
    completedCount: habit.achievements.filter(a => a.achieved).length,
    totalCount: habit.achievements.length
  }));

  return (
    <Card className="bg-white/70 backdrop-blur dark:bg-card">
      <CardHeader>
        <CardTitle>Detailed Achievements</CardTitle>
        <CardDescription>
          Track your progress across all habits
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-primary" />
              <span className="font-medium">Overall Progress</span>
            </div>
            <span className="text-sm text-muted-foreground">
              {completedAchievements}/{totalAchievements} ({progressPercentage}%)
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
            <div 
              className="h-full rounded-full progress-bar-animation" 
              style={{ width: `${progressPercentage}%`, backgroundColor: 'hsl(var(--progress-bar))' }}
            ></div>
          </div>
        </div>

        <Tabs defaultValue={habits[0]?.name || ""} className="w-full">
          <TabsList className="mb-4">
            {achievementsByHabit.map(({ habitName }) => (
              <TabsTrigger key={habitName} value={habitName}>
                {habitName}
              </TabsTrigger>
            ))}
          </TabsList>

          {achievementsByHabit.map(({ habitName, achievements, completedCount, totalCount }) => (
            <TabsContent key={habitName} value={habitName}>
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">
                    {completedCount}/{totalCount} achievements completed
                  </span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <div 
                    className="h-full rounded-full progress-bar-animation" 
                    style={{ 
                      width: `${(completedCount / totalCount) * 100}%`, 
                      backgroundColor: 'hsl(var(--progress-bar))' 
                    }}
                  ></div>
                </div>
              </div>

              <div className="space-y-3">
                {achievements.map((achievement, idx) => (
                  <div
                    key={achievement.id}
                    className={`rounded-lg border p-3 transition-all ${achievement.achieved ? '' : 'bg-muted/20 border-border/50'}`}
                    style={achievement.achieved ? {
                      background: 'linear-gradient(90deg, #F59E42 0%, #10B981 100%)',
                      borderColor: '#F59E42',
                      color: '#fff',
                      boxShadow: '0 2px 8px 0 rgba(245,158,66,0.10)'
                    } : {}}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{achievement.title}</div>
                        <p className={`text-sm ${achievement.achieved ? 'text-white/90' : 'text-muted-foreground'}`}>{achievement.description}</p>
                      </div>
                      {achievement.achieved && (
                        <div className="rounded-full bg-white/30 p-1">
                          <Check className="h-3 w-3 text-white" />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}; 