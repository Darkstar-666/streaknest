import React from "react";
import { Habit } from "@/contexts/HabitContext";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type TimeRange = "weekly" | "monthly" | "yearly";

type DataPoint = {
  name: string;
  date: string;
  actual: number;
  goal: number;
  unit: string;
};

type IndividualHabitChartProps = {
  habits: Habit[];
  selectedHabit: string | null;
  onHabitChange: (habitId: string) => void;
};

export const IndividualHabitChart: React.FC<IndividualHabitChartProps> = ({
  habits,
  selectedHabit,
  onHabitChange,
}) => {
  const [timeRange, setTimeRange] = React.useState<TimeRange>("weekly");
  const selectedHabitDetails = habits.find(h => h.id === selectedHabit);
  
  // Generate data for the selected habit based on time range
  const generateIndividualHabitData = (habitId: string | null): DataPoint[] => {
    if (!habitId) return [];
    
    const habit = habits.find(h => h.id === habitId);
    if (!habit) return [];
    
    const today = new Date();
    const data: DataPoint[] = [];
    
    switch (timeRange) {
      case "weekly": {
        // Get the most recent Monday
        const currentDay = today.getDay();
        const daysSinceMonday = currentDay === 0 ? 6 : currentDay - 1; // Convert Sunday (0) to 6
        const monday = new Date(today);
        monday.setDate(today.getDate() - daysSinceMonday);
        monday.setHours(0, 0, 0, 0);

        // Generate data for the week starting from Monday
        const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
        for (let i = 0; i < 7; i++) {
          const date = new Date(monday);
          date.setDate(monday.getDate() + i);
          const formattedDate = date.toISOString().split('T')[0];
          const dayName = dayNames[i];

          const count = Array.isArray(habit.trackingData) ? habit.trackingData.filter(item => 
            new Date(item.date).toISOString().split('T')[0] === formattedDate
          ).length : 0;

          data.push({
            name: dayName,
            date: formattedDate,
            actual: count,
            goal: habit.goal,
            unit: habit.unit || "times"
          });
        }
        break;
      }
      case "monthly": {
        // Get the first and last day of the current month
        const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        const totalDays = lastDayOfMonth.getDate();
        for (let day = 1; day <= totalDays; day++) {
          const date = new Date(today.getFullYear(), today.getMonth(), day);
          const formattedDate = date.toISOString().split('T')[0];
          const count = Array.isArray(habit.trackingData) ? habit.trackingData.filter(item => {
            const itemDate = new Date(item.date);
            return itemDate.toISOString().split('T')[0] === formattedDate;
          }).length : 0;
          data.push({
            name: String(day),
            date: formattedDate,
            actual: count,
            goal: habit.goal,
            unit: habit.unit || "times"
          });
        }
        break;
      }
      case "yearly": {
        // Get the first day of the current year
        const firstDayOfYear = new Date(today.getFullYear(), 0, 1);
        const monthNames = [
          "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ];
        for (let month = 0; month < 12; month++) {
          const monthStart = new Date(today.getFullYear(), month, 1);
          const monthEnd = new Date(today.getFullYear(), month + 1, 0);
          const count = Array.isArray(habit.trackingData) ? habit.trackingData.filter(item => {
            const itemDate = new Date(item.date);
            return itemDate >= monthStart && itemDate <= monthEnd;
          }).length : 0;
          const daysInMonth = monthEnd.getDate();
          data.push({
            name: monthNames[month],
            date: monthStart.toISOString().split('T')[0],
            actual: count,
            goal: habit.goal * daysInMonth,
            unit: habit.unit || "times"
          });
        }
        break;
      }
    }
    
    return data;
  };

  const individualHabitData = generateIndividualHabitData(selectedHabit);

  return (
    <Card className="w-full">
      <CardHeader className="space-y-4">
        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div>
            <CardTitle>Habit Progress</CardTitle>
            <CardDescription>
              Track your progress over time
            </CardDescription>
          </div>
          <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-x-4 sm:space-y-0">
            <Select
              value={selectedHabit || ""}
              onValueChange={onHabitChange}
            >
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Select a habit" />
              </SelectTrigger>
              <SelectContent>
                {habits.map((habit) => (
                  <SelectItem key={habit.id} value={habit.id}>
                    {habit.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={timeRange}
              onValueChange={(value: TimeRange) => setTimeRange(value)}
            >
              <SelectTrigger className="w-full sm:w-[120px]">
                <SelectValue placeholder="Time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-1 sm:px-6">
        {selectedHabit && selectedHabitDetails && (
          <ChartContainer className="w-full min-h-[220px] h-[40vw] max-h-[420px] sm:h-[350px] md:h-[400px] lg:h-[420px] xl:h-[480px]" config={{}}>
            <ResponsiveContainer width="100%" height="100%" minHeight={220} minWidth={200}>
              <LineChart 
                data={individualHabitData} 
                margin={{ 
                  top: 5, 
                  right: timeRange === "yearly" ? 30 : 20, 
                  left: timeRange === "yearly" ? 10 : 10, 
                  bottom: timeRange === "yearly" ? 20 : 5 
                }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis 
                  dataKey="name" 
                  interval={0}
                  tick={{ 
                    fontSize: timeRange === "yearly" ? 13 : 12,
                    angle: timeRange === "yearly" ? -45 : 0,
                    fill: 'currentColor',
                  } as any}
                  height={
                    timeRange === "yearly" ? 80 :
                    timeRange === "monthly" ? 60 :
                    40
                  }
                  dy={timeRange === "yearly" ? 10 : 0}
                  ticks={
                    timeRange === "yearly"
                      ? ["Jan", "Apr", "Jul", "Oct", "Dec"]
                      : timeRange === "monthly"
                        ? (() => {
                            const firstDay = 1;
                            const today = new Date();
                            const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
                            return [
                              String(firstDay),
                              "7",
                              "14",
                              "21",
                              String(lastDay)
                            ];
                          })()
                        : undefined
                  }
                  tickFormatter={(value) => {
                    if (timeRange === "yearly") {
                      const showMonths = ["Jan", "Apr", "Jul", "Oct", "Dec"];
                      if (showMonths.includes(value)) {
                        return value;
                      }
                      return "";
                    }
                    if (timeRange === "monthly") {
                      // Only show label for 1, 7, 14, 21, last day
                      const today = new Date();
                      const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
                      const showDays = ["1", "7", "14", "21", String(lastDay)];
                      if (showDays.includes(value)) {
                        return value;
                      }
                      return "";
                    }
                    return value;
                  }}
                  tickLine={timeRange === "yearly" || timeRange === "monthly" ? { stroke: "currentColor", strokeWidth: 1 } : undefined}
                  axisLine={timeRange === "yearly" || timeRange === "monthly" ? { stroke: "currentColor", strokeWidth: 1 } : undefined}
                />
                <YAxis 
                  allowDecimals={false} 
                  label={{ 
                    value: selectedHabitDetails.unit || "times", 
                    angle: -90, 
                    position: 'insideLeft',
                    style: { textAnchor: 'middle' }
                  } as any} 
                  width={timeRange === "yearly" ? 50 : 50}
                />
                <Tooltip 
                  formatter={(value: number, name: string) => {
                    const label = name === "actual" ? "Completed" : "Goal";
                    const period = timeRange === "monthly" ? "day" : 
                                 timeRange === "yearly" ? "month" : "day";
                    return [`${value} ${selectedHabitDetails.unit || "times"}`, `${label} per ${period}`];
                  }}
                  contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px',
                    padding: '8px'
                  }}
                />
                <Legend 
                  verticalAlign="top" 
                  height={36}
                  wrapperStyle={{
                    paddingBottom: '8px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="actual" 
                  name="Completed" 
                  stroke="#8B5CF6" 
                  strokeWidth={3}
                  dot={{ r: 4, strokeWidth: 1 }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="goal" 
                  name={`Goal (${selectedHabitDetails.goal} ${selectedHabitDetails.unit || "times"}/day)`}
                  stroke="#D946EF" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={{ r: 3, fill: "#fff", strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
};
