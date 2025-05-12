export type Habit = {
  id: string;
  name: string;
  icon: string;
  count: number;
  goal: number;
  unit: string;
  streak: number;
  lastTracked: string | null;
  achievements: Achievement[];
  trackingData: { date: string }[];
  // Reminder settings
  reminderEnabled?: boolean;
  reminderStart?: string; // e.g. '07:00'
  reminderEnd?: string;   // e.g. '20:00'
  reminderInterval?: number; // in minutes
};

export type Achievement = {
  id: string;
  title: string;
  description: string;
  threshold: number;
  achieved: boolean;
};

export type HabitContextType = {
  habits: Habit[];
  addHabit: (name: string, icon: string) => void;
  incrementHabit: (id: string) => void;
  resetCounts: () => void;
  resetHabitCount: (id: string) => void;
  deleteHabit: (id: string) => void;
  updateHabit: (id: string, name: string, goal: number, unit: string) => void;
  resetAllStreaks: () => void;
  updateHabitReminder: (id: string, settings: Partial<Habit>) => void;
};
