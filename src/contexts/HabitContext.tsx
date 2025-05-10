import { createContext, useState, useContext, useEffect } from "react";

export type Habit = {
  id: string;
  name: string;
  icon: string;
  count: number;
  goal: number;
  unit: string; // Added unit field
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
  updateHabit: (id: string, name: string, goal: number, unit: string) => void; // Updated to include unit
};

const defaultHabits: Habit[] = [
  {
    id: "drink-water",
    name: "Drink water",
    icon: "droplet",
    count: 0,
    goal: 8,
    unit: "glasses", // Add default unit
    streak: 0,
    lastTracked: null,
    trackingData: [], // Initialize empty tracking data
    achievements: [
      {
        id: "water-monday",
        title: "Monday Hydration",
        description: "Drink water on Monday",
        threshold: 1,
        achieved: false,
      },
      {
        id: "water-tuesday",
        title: "Tuesday Hydration",
        description: "Drink water on Tuesday",
        threshold: 1,
        achieved: false,
      },
      {
        id: "water-wednesday",
        title: "Wednesday Hydration",
        description: "Drink water on Wednesday",
        threshold: 1,
        achieved: false,
      },
      {
        id: "water-thursday",
        title: "Thursday Hydration",
        description: "Drink water on Thursday",
        threshold: 1,
        achieved: false,
      },
      {
        id: "water-friday",
        title: "Friday Hydration",
        description: "Drink water on Friday",
        threshold: 1,
        achieved: false,
      },
      {
        id: "water-saturday",
        title: "Saturday Hydration",
        description: "Drink water on Saturday",
        threshold: 1,
        achieved: false,
      },
      {
        id: "water-sunday",
        title: "Sunday Hydration",
        description: "Drink water on Sunday",
        threshold: 1,
        achieved: false,
      },
      {
        id: "water-month",
        title: "Hydration Master",
        description: "Drink water for 30 consecutive days",
        threshold: 30,
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
    unit: "sessions", // Add default unit
    streak: 0,
    lastTracked: null,
    trackingData: [], // Initialize empty tracking data
    achievements: [
      {
        id: "exercise-monday",
        title: "Monday Movement",
        description: "Exercise on Monday",
        threshold: 1,
        achieved: false,
      },
      {
        id: "exercise-tuesday",
        title: "Tuesday Training",
        description: "Exercise on Tuesday",
        threshold: 1,
        achieved: false,
      },
      {
        id: "exercise-wednesday",
        title: "Wednesday Workout",
        description: "Exercise on Wednesday",
        threshold: 1,
        achieved: false,
      },
      {
        id: "exercise-thursday",
        title: "Thursday Toning",
        description: "Exercise on Thursday",
        threshold: 1,
        achieved: false,
      },
      {
        id: "exercise-friday",
        title: "Friday Fitness",
        description: "Exercise on Friday",
        threshold: 1,
        achieved: false,
      },
      {
        id: "exercise-saturday",
        title: "Saturday Strength",
        description: "Exercise on Saturday",
        threshold: 1,
        achieved: false,
      },
      {
        id: "exercise-sunday",
        title: "Sunday Sweat",
        description: "Exercise on Sunday",
        threshold: 1,
        achieved: false,
      },
      {
        id: "exercise-month",
        title: "Fitness Champion",
        description: "Exercise for 30 consecutive days",
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
    unit: "minutes", // Add default unit
    streak: 0,
    lastTracked: null,
    trackingData: [], // Initialize empty tracking data
    achievements: [
      {
        id: "read-monday",
        title: "Monday Reading",
        description: "Read on Monday",
        threshold: 1,
        achieved: false,
      },
      {
        id: "read-tuesday",
        title: "Tuesday Tales",
        description: "Read on Tuesday",
        threshold: 1,
        achieved: false,
      },
      {
        id: "read-wednesday",
        title: "Wednesday Words",
        description: "Read on Wednesday",
        threshold: 1,
        achieved: false,
      },
      {
        id: "read-thursday",
        title: "Thursday Thinking",
        description: "Read on Thursday",
        threshold: 1,
        achieved: false,
      },
      {
        id: "read-friday",
        title: "Friday Fiction",
        description: "Read on Friday",
        threshold: 1,
        achieved: false,
      },
      {
        id: "read-saturday",
        title: "Saturday Stories",
        description: "Read on Saturday",
        threshold: 1,
        achieved: false,
      },
      {
        id: "read-sunday",
        title: "Sunday Study",
        description: "Read on Sunday",
        threshold: 1,
        achieved: false,
      },
      {
        id: "read-month",
        title: "Literature Master",
        description: "Read for 30 consecutive days",
        threshold: 30,
        achieved: false,
      },
    ],
  },
];

const HabitContext = createContext<HabitContextType | undefined>(undefined);

export const HabitProvider = ({ children }: { children: React.ReactNode }) => {
  const [habits, setHabits] = useState<Habit[]>(() => {
    try {
      const savedHabits = localStorage.getItem("habits");
      // Make sure to initialize trackingData as an array if it doesn't exist
      if (savedHabits) {
        const parsedHabits = JSON.parse(savedHabits);
        return parsedHabits.map((habit: any) => ({
          ...habit,
          unit: habit.unit || "times", // Provide default unit if not present
          trackingData: Array.isArray(habit.trackingData) ? habit.trackingData : []
        }));
      }
      return defaultHabits;
    } catch (error) {
      console.error("Error loading habits from localStorage:", error);
      return defaultHabits;
    }
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
      unit: "times", // Default unit
      streak: 0,
      lastTracked: null,
      trackingData: [], // Ensure trackingData is initialized as an empty array
      achievements: [
        {
          id: `${name.toLowerCase()}-monday`,
          title: `Monday ${name}`,
          description: `Complete ${name.toLowerCase()} on Monday`,
          threshold: 1,
          achieved: false,
        },
        {
          id: `${name.toLowerCase()}-tuesday`,
          title: `Tuesday ${name}`,
          description: `Complete ${name.toLowerCase()} on Tuesday`,
          threshold: 1,
          achieved: false,
        },
        {
          id: `${name.toLowerCase()}-wednesday`,
          title: `Wednesday ${name}`,
          description: `Complete ${name.toLowerCase()} on Wednesday`,
          threshold: 1,
          achieved: false,
        },
        {
          id: `${name.toLowerCase()}-thursday`,
          title: `Thursday ${name}`,
          description: `Complete ${name.toLowerCase()} on Thursday`,
          threshold: 1,
          achieved: false,
        },
        {
          id: `${name.toLowerCase()}-friday`,
          title: `Friday ${name}`,
          description: `Complete ${name.toLowerCase()} on Friday`,
          threshold: 1,
          achieved: false,
        },
        {
          id: `${name.toLowerCase()}-saturday`,
          title: `Saturday ${name}`,
          description: `Complete ${name.toLowerCase()} on Saturday`,
          threshold: 1,
          achieved: false,
        },
        {
          id: `${name.toLowerCase()}-sunday`,
          title: `Sunday ${name}`,
          description: `Complete ${name.toLowerCase()} on Sunday`,
          threshold: 1,
          achieved: false,
        },
        {
          id: `${name.toLowerCase()}-month`,
          title: `${name} Master`,
          description: `Complete ${name.toLowerCase()} for 30 consecutive days`,
          threshold: 30,
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
          // Ensure habit.trackingData is an array before adding to it
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
