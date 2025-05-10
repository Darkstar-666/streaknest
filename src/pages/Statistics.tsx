import React, { useState } from "react";
import { useHabits } from "@/contexts/HabitContext";
import { StatisticsHeader } from "@/components/statistics/StatisticsHeader";
import { IndividualHabitChart } from "@/components/statistics/IndividualHabitChart";
import { DetailedAchievementsView } from "@/components/statistics/DetailedAchievementsView";

const Statistics = () => {
  const { habits } = useHabits();
  const [selectedHabit, setSelectedHabit] = useState<string | null>(habits[0]?.id || null);

  return (
    <main className="container mx-auto py-4 sm:py-8 px-2 sm:px-4 bg-white/70 backdrop-blur dark:bg-background rounded-xl overflow-x-hidden min-h-screen">
      {/* Page Title */}
      <StatisticsHeader title="Statistics" />

      {/* Habit Progress Chart */}
      <section className="mb-8">
        <IndividualHabitChart
          habits={habits}
          selectedHabit={selectedHabit}
          onHabitChange={setSelectedHabit}
        />
      </section>

      {/* Achievements Section */}
      <section>
        <DetailedAchievementsView />
      </section>
    </main>
  );
};

export default Statistics;
