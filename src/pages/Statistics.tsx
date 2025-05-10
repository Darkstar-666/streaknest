
import React, { useState } from "react";
import { useHabits } from "@/contexts/HabitContext";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartContainer } from "@/components/ui/chart";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Statistics = () => {
  const { habits } = useHabits();
  const [selectedHabit, setSelectedHabit] = useState<string | null>(habits.length > 0 ? habits[0].id : null);

  // Calculate data for the last 7 days
  const generateLast7DaysData = () => {
    const today = new Date();
    const data = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dayName = new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(date);
      const formattedDate = date.toISOString().split('T')[0];
      
      const dayData = {
        name: dayName,
        date: formattedDate,
      };
      
      habits.forEach(habit => {
        if (Array.isArray(habit.trackingData)) {
          const count = habit.trackingData.filter(item => 
            new Date(item.date).toISOString().split('T')[0] === formattedDate
          ).length;
          
          dayData[`${habit.name}`] = count;
          dayData[`${habit.name}Unit`] = habit.unit || "times";
        }
      });
      
      data.push(dayData);
    }
    
    return data;
  };

  // Calculate monthly data (last 30 days)
  const generateLast30DaysData = () => {
    const today = new Date();
    const data = [];
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dayName = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(date);
      const formattedDate = date.toISOString().split('T')[0];
      
      const dayData = {
        name: dayName,
        date: formattedDate,
      };
      
      habits.forEach(habit => {
        if (Array.isArray(habit.trackingData)) {
          const count = habit.trackingData.filter(item => 
            new Date(item.date).toISOString().split('T')[0] === formattedDate
          ).length;
          
          dayData[`${habit.name}`] = count;
          dayData[`${habit.name}Unit`] = habit.unit || "times";
        }
      });
      
      data.push(dayData);
    }
    
    return data;
  };

  // Generate individual habit data for the selected habit (7 days)
  const generateIndividualHabitData = (habitId: string | null) => {
    if (!habitId) return [];
    
    const habit = habits.find(h => h.id === habitId);
    if (!habit) return [];
    
    const today = new Date();
    const data = [];
    
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

  const last7DaysData = generateLast7DaysData();
  const last30DaysData = generateLast30DaysData();
  const individualHabitData = generateIndividualHabitData(selectedHabit);
  const selectedHabitDetails = habits.find(h => h.id === selectedHabit);

  // Generate colors for each habit
  const getHabitColor = (index: number) => {
    const colors = [
      "#8B5CF6", // Purple
      "#D946EF", // Magenta
      "#F97316", // Orange
      "#0EA5E9", // Blue
      "#10B981", // Green
      "#EC4899", // Pink
      "#EAB308", // Yellow
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Statistics</h1>

      <div className="mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Individual Habit Progress</CardTitle>
            <CardDescription>
              View progress for a specific habit over the last 7 days
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <Select value={selectedHabit || ""} onValueChange={(value) => setSelectedHabit(value)}>
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
      </div>

      <Tabs defaultValue="weekly" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="weekly">7-Day Report</TabsTrigger>
          <TabsTrigger value="monthly">30-Day Report</TabsTrigger>
        </TabsList>

        <TabsContent value="weekly">
          <Card>
            <CardHeader>
              <CardTitle>7-Day Habit Tracking</CardTitle>
              <CardDescription>
                View your habit progress over the past week
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer className="h-80" config={{}}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={last7DaysData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="name" />
                    <YAxis allowDecimals={false} />
                    <Tooltip formatter={(value: number, name: string, props: any) => {
                      const habitName = name;
                      const unit = props.payload[`${habitName}Unit`] || "times";
                      return [`${value} ${unit}`, habitName];
                    }} />
                    <Legend />
                    {habits.map((habit, index) => (
                      <Area
                        key={habit.id}
                        type="monotone"
                        dataKey={habit.name}
                        name={`${habit.name} (${habit.unit || "times"})`}
                        fill={getHabitColor(index)}
                        stroke={getHabitColor(index)}
                        fillOpacity={0.3}
                        strokeWidth={2}
                      />
                    ))}
                  </AreaChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monthly">
          <Card>
            <CardHeader>
              <CardTitle>30-Day Habit Tracking</CardTitle>
              <CardDescription>
                View your habit progress over the past month
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer className="h-80" config={{}}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={last30DaysData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis 
                      dataKey="name" 
                      interval="preserveStartEnd"
                      tick={{ fontSize: 10 }}
                    />
                    <YAxis allowDecimals={false} />
                    <Tooltip formatter={(value: number, name: string, props: any) => {
                      const habitName = name;
                      const unit = props.payload[`${habitName}Unit`] || "times";
                      return [`${value} ${unit}`, habitName];
                    }} />
                    <Legend />
                    {habits.map((habit, index) => (
                      <Area
                        key={habit.id}
                        type="monotone"
                        dataKey={habit.name}
                        name={`${habit.name} (${habit.unit || "times"})`}
                        fill={getHabitColor(index)}
                        stroke={getHabitColor(index)}
                        fillOpacity={0.3}
                        strokeWidth={2}
                      />
                    ))}
                  </AreaChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Statistics;
