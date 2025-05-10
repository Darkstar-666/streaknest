
import { createContext, useState, useContext } from "react";
import { Habit, HabitContextType, Achievement } from "@/types/Habit.types";
import { defaultHabits } from "@/data/defaultHabits";
import { generateAchievements, showAchievementToast } from "@/utils/achievementUtils";
import { useLocalStorage } from "@/hooks/useLocalStorage";

const HabitContext = createContext<HabitContextType | undefined>(undefined);

export const HabitProvider = ({ children }: { children: React.ReactNode }) => {
  const [habits, setHabits] = useLocalStorage<Habit[]>("habits", defaultHabits);

  const addHabit = (name: string) => { 
    const newHabit: Habit = {
      id: Date.now().toString(),
      name: name,
      icon: "circle", // Default icon
      count: 0,
      goal: 1, // Default goal
      unit: "times", // Default unit
      streak: 0,
      lastTracked: null,
      trackingData: [],
      achievements: generateAchievements(name),
    };
    setHabits((prevHabits) => [...prevHabits, newHabit]);
  };

  const incrementHabit = (id: string) => {
    setHabits((prevHabits) =>
      prevHabits.map((habit) => {
        if (habit.id === id) {
          const today = new Date().toISOString().split("T")[0];
          const lastTracked = habit.lastTracked;
          const dayOfWeek = new Date().getDay(); // 0 for Sunday, 1 for Monday, etc.
          const weekday = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][dayOfWeek];
          
          // Check streak
          let newStreak = habit.streak;
          if (lastTracked === null || lastTracked !== today) {
            newStreak += 1;
          }
          
          // Update achievements
          const newCount = habit.count + 1;
          const updatedAchievements = habit.achievements.map((achievement) => {
            // Check day-specific achievements
            if (achievement.id.includes(weekday) && !achievement.achieved) {
              return { ...achievement, achieved: true };
            }
            // Check consecutive days achievement (month)
            if (achievement.id.includes('month') && !achievement.achieved && newStreak >= achievement.threshold) {
              return { ...achievement, achieved: true };
            }
            return achievement;
          });

          // Add tracking data entry for today
          const newTrackingData = Array.isArray(habit.trackingData) ? [...habit.trackingData] : [];
          if (!lastTracked || lastTracked !== today) {
            newTrackingData.push({ date: today });
          }

          // Show achievement notification if any were unlocked
          const newlyAchieved = updatedAchievements.filter(
            (a, i) => a.achieved && !habit.achievements[i].achieved
          );
          
          if (newlyAchieved.length > 0) {
            newlyAchieved.forEach(achievement => {
              showAchievementToast(achievement);
            });
          }

          return {
            ...habit,
            count: newCount,
            streak: newStreak,
            lastTracked: today,
            trackingData: newTrackingData,
            achievements: updatedAchievements,
          };
        }
        return habit;
      })
    );
  };

  const resetCounts = () => {
    setHabits((prevHabits) =>
      prevHabits.map((habit) => ({
        ...habit,
        count: 0,
        lastTracked: null,
      }))
    );
  };

  const deleteHabit = (id: string) => {
    setHabits((prevHabits) => prevHabits.filter((habit) => habit.id !== id));
  };

  const updateHabit = (id: string, name: string, goal: number, unit: string) => {
    setHabits((prevHabits) =>
      prevHabits.map((habit) =>
        habit.id === id
          ? { ...habit, name: name, goal: goal, unit: unit }
          : habit
      )
    );
  };

  return (
    <HabitContext.Provider value={{ habits, addHabit, incrementHabit, resetCounts, deleteHabit, updateHabit }}>
      {children}
    </HabitContext.Provider>
  );
};

export const useHabits = () => {
  const context = useContext(HabitContext);
  if (!context) {
    throw new Error("useHabits must be used within a HabitProvider");
  }
  return context;
};

export type { Habit, Achievement };
