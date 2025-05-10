import { createContext, useState, useContext, useEffect } from "react";

export type Habit = {
  id: string;
  name: string;
  icon: string;
  count: number;
  goal: number;
  streak: number;
  lastTracked: string | null;
  achievements: Achievement[];
  trackingData: { date: string }[]; // Array to store dates when habit was tracked
};

export type Achievement = {
  id: string;
  title: string;
  description: string;
  threshold: number;
  achieved: boolean;
};

type HabitContextType = {
  habits: Habit[];
  addHabit: (name: string) => void;
  incrementHabit: (id: string) => void;
  resetCounts: () => void;
  deleteHabit: (id: string) => void;
  updateHabit: (id: string, name: string, goal: number) => void;
};

const defaultHabits: Habit[] = [
  {
    id: "drink-water",
    name: "Drink water",
    icon: "droplet",
    count: 0,
    goal: 8,
    streak: 0,
    lastTracked: null,
    trackingData: [], // Initialize empty tracking data
    achievements: [
      {
        id: "water-beginner",
        title: "Hydration Starter",
        description: "Drink water 10 times",
        threshold: 10,
        achieved: false,
      },
      {
        id: "water-intermediate",
        title: "Hydration Pro",
        description: "Drink water 50 times",
        threshold: 50,
        achieved: false,
      },
      {
        id: "water-expert",
        title: "Hydration Master",
        description: "Drink water 100 times",
        threshold: 100,
        achieved: false,
      },
    ],
  },
  {
    id: "exercise",
    name: "Exercise",
    icon: "activity",
    count: 0,
    goal: 1,
    streak: 0,
    lastTracked: null,
    trackingData: [], // Initialize empty tracking data
    achievements: [
      {
        id: "exercise-week",
        title: "Weekly Warrior",
        description: "Exercise 7 times",
        threshold: 7,
        achieved: false,
      },
      {
        id: "exercise-month",
        title: "Monthly Champion",
        description: "Exercise 30 times",
        threshold: 30,
        achieved: false,
      },
    ],
  },
  {
    id: "read",
    name: "Read",
    icon: "book",
    count: 0,
    goal: 30,
    streak: 0,
    lastTracked: null,
    trackingData: [], // Initialize empty tracking data
    achievements: [
      {
        id: "read-beginner",
        title: "Bookworm Initiate",
        description: "Read for 5 days",
        threshold: 5,
        achieved: false,
      },
      {
        id: "read-intermediate",
        title: "Literature Enthusiast",
        description: "Read for 15 days",
        threshold: 15,
        achieved: false,
      },
    ],
  },
];

const HabitContext = createContext<HabitContextType | undefined>(undefined);

export const HabitProvider = ({ children }: { children: React.ReactNode }) => {
  const [habits, setHabits] = useState<Habit[]>(() => {
    const savedHabits = localStorage.getItem("habits");
    return savedHabits ? JSON.parse(savedHabits) : defaultHabits;
  });

  useEffect(() => {
    localStorage.setItem("habits", JSON.stringify(habits));
  }, [habits]);

  const addHabit = (name: string) => { 
    const newHabit: Habit = {
      id: Date.now().toString(),
      name: name,
      icon: "circle", // Default icon
      count: 0,
      goal: 1, // Default goal
      streak: 0,
      lastTracked: null,
      trackingData: [], // Initialize empty tracking data
      achievements: [
        {
          id: `${name.toLowerCase()}-starter`,
          title: `${name} Starter`,
          description: `Complete ${name.toLowerCase()} 5 times`,
          threshold: 5,
          achieved: false,
        },
        {
          id: `${name.toLowerCase()}-master`,
          title: `${name} Master`,
          description: `Complete ${name.toLowerCase()} 20 times`,
          threshold: 20,
          achieved: false,
        },
      ],
    };
    setHabits((prevHabits) => [...prevHabits, newHabit]);
  };

  const incrementHabit = (id: string) => {
    setHabits((prevHabits) =>
      prevHabits.map((habit) => {
        if (habit.id === id) {
          const today = new Date().toISOString().split("T")[0];
          const lastTracked = habit.lastTracked;
          
          // Check streak
          let newStreak = habit.streak;
          if (lastTracked === null || lastTracked !== today) {
            newStreak += 1;
          }
          
          // Update achievements
          const newCount = habit.count + 1;
          const updatedAchievements = habit.achievements.map((achievement) => {
            if (!achievement.achieved && newCount >= achievement.threshold) {
              return { ...achievement, achieved: true };
            }
            return achievement;
          });

          // Add tracking data entry for today
          const newTrackingData = [...habit.trackingData];
          if (!lastTracked || lastTracked !== today) {
            newTrackingData.push({ date: today });
          }

          // Show achievement notification if any were unlocked
          const newlyAchieved = updatedAchievements.filter(
            (a, i) => a.achieved && !habit.achievements[i].achieved
          );
          
          if (newlyAchieved.length > 0) {
            newlyAchieved.forEach(achievement => {
              setTimeout(() => {
                const toast = document.createElement("div");
                toast.className = "fixed bottom-4 right-4 bg-nordic-teal text-white p-4 rounded-lg shadow-lg z-50 flex items-center gap-2";
                toast.innerHTML = `
                  <div class="text-2xl">🏆</div>
                  <div>
                    <p class="font-bold">${achievement.title} Unlocked!</p>
                    <p class="text-sm">${achievement.description}</p>
                  </div>
                `;
                document.body.appendChild(toast);
                setTimeout(() => {
                  toast.style.opacity = "0";
                  toast.style.transition = "opacity 0.5s ease";
                  setTimeout(() => document.body.removeChild(toast), 500);
                }, 3000);
              }, 300);
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

  const updateHabit = (id: string, name: string, goal: number) => {
    setHabits((prevHabits) =>
      prevHabits.map((habit) =>
        habit.id === id
          ? { ...habit, name: name, goal: goal }
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
