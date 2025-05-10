
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChartContainer } from "@/components/ui/chart";

type IndividualHabitChartProps = {
  habits: Habit[];
  selectedHabit: string | null;
  onHabitChange: (value: string) => void;
};

type DataPoint = {
  name: string;
  date: string;
  actual: number;
  goal: number;
  unit: string;
};

export const IndividualHabitChart: React.FC<IndividualHabitChartProps> = ({
  habits,
  selectedHabit,
  onHabitChange,
}) => {
  const selectedHabitDetails = habits.find(h => h.id === selectedHabit);
  
  // Generate data for the selected habit
  const generateIndividualHabitData = (habitId: string | null): DataPoint[] => {
    if (!habitId) return [];
    
    const habit = habits.find(h => h.id === habitId);
    if (!habit) return [];
    
    const today = new Date();
    const data: DataPoint[] = [];
    
    // Get last 7 days of data for the individual habit
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const formattedDate = date.toISOString().split('T')[0];
      const dayName = new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(date);
      
      // Count entries for this day
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
    
    return data;
  };

  const individualHabitData = generateIndividualHabitData(selectedHabit);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Individual Habit Progress</CardTitle>
        <CardDescription>
          View progress for a specific habit over the last 7 days
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Select value={selectedHabit || ""} onValueChange={onHabitChange}>
            <SelectTrigger>
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
        </div>
        
        {selectedHabit && selectedHabitDetails && (
          <ChartContainer className="h-80" config={{}}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={individualHabitData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="name" />
                <YAxis 
                  allowDecimals={false} 
                  label={{ 
                    value: selectedHabitDetails.unit || "times", 
                    angle: -90, 
                    position: 'insideLeft' 
                  }} 
                />
                <Tooltip 
                  formatter={(value: number, name: string) => {
                    return [`${value} ${selectedHabitDetails.unit || "times"}`, name === "actual" ? "Completed" : "Goal"];
                  }} 
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="actual" 
                  name="Completed" 
                  stroke="#8B5CF6" 
                  strokeWidth={3}
                  dot={{ r: 5, strokeWidth: 1 }}
                  activeDot={{ r: 7, strokeWidth: 0 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="goal" 
                  name={`Goal (${selectedHabitDetails.goal} ${selectedHabitDetails.unit || "times"}/day)`}
                  stroke="#D946EF" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={{ r: 4, fill: "#fff", strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
};
