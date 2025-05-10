
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
  addHabit: (name: string) => void;
  incrementHabit: (id: string) => void;
  resetCounts: () => void;
  deleteHabit: (id: string) => void;
  updateHabit: (id: string, name: string, goal: number, unit: string) => void;
};
