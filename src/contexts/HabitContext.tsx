import * as React from "react";

// Safe UUID generator
function safeUUID() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback: not cryptographically secure
  return 'xxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export type Habit = {
  id: string;
  name: string;
  goal: number;
  unit: string;
  icon: string;
  count: number;
  streak: number;
  lastTracked: string | null;
  trackingData: Array<{
    date: string;
    count: number;
  }>;
  achievements: Array<{
    id: string;
    name: string;
    description: string;
    achieved: boolean;
    threshold?: number;
  }>;
  reminderEnabled?: boolean;
  reminderStart?: string;
  reminderEnd?: string;
  reminderInterval?: number;
};

type HabitContextType = {
  habits: Habit[];
  isLoading: boolean;
  error: Error | null;
  addHabit: (name: string, icon: string) => void;
  deleteHabit: (id: string) => void;
  updateHabit: (id: string, name: string, goal: number, unit: string) => void;
  resetHabitCount: (id: string) => void;
  resetAllStreaks: () => void;
  updateHabitReminder: (id: string, reminder: Partial<Habit>) => void;
  incrementHabit: (id: string) => void;
};

const HabitContext = React.createContext<HabitContextType | undefined>(undefined);

function generateDefaultAchievements(habitName: string) {
  return [
    {
      id: `${habitName}-streak-7`,
      name: '7 Day Streak',
      description: `Complete ${habitName} for 7 days in a row`,
      achieved: false,
      threshold: 7,
    },
    {
      id: `${habitName}-streak-30`,
      name: '30 Day Streak',
      description: `Complete ${habitName} for 30 days in a row`,
      achieved: false,
      threshold: 30,
    },
  ];
}

// Validate and sanitize a habit object
function validateHabit(h: any): Habit | null {
  if (!h || typeof h !== 'object') return null;
  if (!h.id || !h.name || typeof h.goal !== 'number' || !h.unit || !h.icon) return null;
  return {
    id: String(h.id),
    name: String(h.name),
    goal: Number(h.goal),
    unit: String(h.unit),
    icon: String(h.icon),
    count: typeof h.count === 'number' ? h.count : 0,
    streak: typeof h.streak === 'number' ? h.streak : 0,
    lastTracked: h.lastTracked ?? null,
    trackingData: Array.isArray(h.trackingData) ? h.trackingData.map(td => ({
      date: String(td.date),
      count: typeof td.count === 'number' ? td.count : 0
    })) : [],
    achievements: Array.isArray(h.achievements) ? h.achievements.map(a => ({
      id: String(a.id),
      name: String(a.name),
      description: String(a.description),
      achieved: !!a.achieved,
      threshold: typeof a.threshold === 'number' ? a.threshold : undefined
    })) : generateDefaultAchievements(h.name),
    reminderEnabled: !!h.reminderEnabled,
    reminderStart: h.reminderStart ?? undefined,
    reminderEnd: h.reminderEnd ?? undefined,
    reminderInterval: typeof h.reminderInterval === 'number' ? h.reminderInterval : undefined,
  };
}

const DEFAULT_HABITS: Habit[] = [
  {
    id: 'drink-water',
    name: 'Drink Water',
    goal: 8,
    unit: 'glasses',
    icon: 'droplet',
    count: 0,
    streak: 0,
    lastTracked: null,
    trackingData: [],
    achievements: generateDefaultAchievements('Drink Water'),
  },
  {
    id: 'exercise',
    name: 'Exercise',
    goal: 1,
    unit: 'sessions',
    icon: 'activity',
    count: 0,
    streak: 0,
    lastTracked: null,
    trackingData: [],
    achievements: generateDefaultAchievements('Exercise'),
  },
  {
    id: 'read',
    name: 'Read',
    goal: 30,
    unit: 'minutes',
    icon: 'book',
    count: 0,
    streak: 0,
    lastTracked: null,
    trackingData: [],
    achievements: generateDefaultAchievements('Read'),
  },
];

function getStoredHabits(): Habit[] {
  try {
    const data = localStorage.getItem("habits");
    if (!data) return [];
    const parsed = JSON.parse(data);
    if (!Array.isArray(parsed)) return [];
    return parsed.map(validateHabit).filter(Boolean) as Habit[];
  } catch {
    localStorage.removeItem("habits");
    return [];
  }
}

export const HabitProvider = ({ children }: { children: React.ReactNode }) => {
  const [habits, setHabits] = React.useState<Habit[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    const storedHabits = getStoredHabits();
    if (storedHabits.length === 0) {
      setHabits(DEFAULT_HABITS);
    } else {
      setHabits(storedHabits);
    }
    setIsLoading(false);
  }, []);

  React.useEffect(() => {
    try {
      localStorage.setItem("habits", JSON.stringify(habits));
    } catch {}
  }, [habits]);

  const addHabit = React.useCallback((name: string, icon: string) => {
    setHabits(prev => [
      ...prev,
      {
        id: safeUUID(),
        name,
        goal: 1,
        unit: "times",
        icon,
        count: 0,
        streak: 0,
        lastTracked: null,
        trackingData: [],
        achievements: generateDefaultAchievements(name),
      },
    ]);
  }, []);

  const deleteHabit = React.useCallback((id: string) => {
    setHabits(prev => prev.filter(habit => habit.id !== id));
  }, []);

  const updateHabit = React.useCallback((id: string, name: string, goal: number, unit: string) => {
    setHabits(prev =>
      prev.map(habit =>
        habit.id === id
          ? { ...habit, name, goal, unit }
          : habit
      )
    );
  }, []);

  const resetHabitCount = React.useCallback((id: string) => {
    setHabits(prev =>
      prev.map(habit =>
        habit.id === id
          ? { ...habit, trackingData: [], count: 0, streak: 0, lastTracked: null }
          : habit
      )
    );
  }, []);

  const resetAllStreaks = React.useCallback(() => {
    setHabits(prev =>
      prev.map(habit => ({
        ...habit,
        trackingData: [],
        count: 0,
        streak: 0,
        lastTracked: null,
      }))
    );
  }, []);

  const updateHabitReminder = React.useCallback((id: string, reminder: Partial<Habit>) => {
    setHabits(prev =>
      prev.map(habit =>
        habit.id === id
          ? { ...habit, ...reminder }
          : habit
      )
    );
  }, []);

  const incrementHabit = React.useCallback((id: string) => {
    setHabits(prev => prev.map(habit => {
      if (habit.id !== id) return habit;
      const today = new Date().toISOString().slice(0, 10);
      let updatedTracking = Array.isArray(habit.trackingData) ? [...habit.trackingData] : [];
      // If already tracked today, increment today's count
      const todayEntry = updatedTracking.find(td => td.date === today);
      if (todayEntry) {
        todayEntry.count += 1;
      } else {
        updatedTracking.push({ date: today, count: 1 });
      }
      return {
        ...habit,
        count: habit.count + 1,
        lastTracked: today,
        trackingData: updatedTracking,
      };
    }));
  }, []);

  const value = React.useMemo(() => ({
    habits,
    isLoading,
    error,
    addHabit,
    deleteHabit,
    updateHabit,
    resetHabitCount,
    resetAllStreaks,
    updateHabitReminder,
    incrementHabit,
  }), [habits, isLoading, error, addHabit, deleteHabit, updateHabit, resetHabitCount, resetAllStreaks, updateHabitReminder, incrementHabit]);

  return (
    <HabitContext.Provider value={value}>
      {children}
    </HabitContext.Provider>
  );
};

export const useHabits = () => {
  const ctx = React.useContext(HabitContext);
  if (!ctx) {
    throw new Error("useHabits must be used within a HabitProvider");
  }
  return ctx;
};
