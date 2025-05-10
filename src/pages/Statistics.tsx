
import React, { useState } from "react";
import { useHabits } from "@/contexts/HabitContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatisticsHeader } from "@/components/statistics/StatisticsHeader";
import { IndividualHabitChart } from "@/components/statistics/IndividualHabitChart";
import { WeeklyHabitsChart } from "@/components/statistics/WeeklyHabitsChart";
import { MonthlyHabitsChart } from "@/components/statistics/MonthlyHabitsChart";

const Statistics = () => {
  const { habits } = useHabits();
  const [selectedHabit, setSelectedHabit] = useState<string | null>(
    habits.length > 0 ? habits[0].id : null
  );

  return (
    <div className="container mx-auto py-8">
      <StatisticsHeader title="Statistics" />

      <div className="mb-8">
        <IndividualHabitChart
          habits={habits}
          selectedHabit={selectedHabit}
          onHabitChange={setSelectedHabit}
        />
      </div>

      <Tabs defaultValue="weekly" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="weekly">7-Day Report</TabsTrigger>
          <TabsTrigger value="monthly">30-Day Report</TabsTrigger>
        </TabsList>

        <TabsContent value="weekly">
          <WeeklyHabitsChart habits={habits} />
        </TabsContent>

        <TabsContent value="monthly">
          <MonthlyHabitsChart habits={habits} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Statistics;
