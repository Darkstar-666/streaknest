import React from "react";
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
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

const Statistics = () => {
  const { habits } = useHabits();

  // Calculate weekly data (last 7 days)
  const generateWeeklyData = () => {
    const today = new Date();
    const weeklyData = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dayName = new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(date);
      
      const dayData = {
        name: dayName,
        date: date.toISOString().split('T')[0],
      };
      
      habits.forEach(habit => {
        const count = habit.trackingData.filter(item => 
          new Date(item.date).toISOString().split('T')[0] === dayData.date
        ).length;
        
        dayData[habit.name] = count;
      });
      
      weeklyData.push(dayData);
    }
    
    return weeklyData;
  };

  // Calculate monthly data (last 30 days grouped by week)
  const generateMonthlyData = () => {
    const today = new Date();
    const monthlyData = [];
    
    for (let i = 3; i >= 0; i--) {
      const weekEnd = new Date(today);
      weekEnd.setDate(today.getDate() - (i * 7));
      const weekStart = new Date(weekEnd);
      weekStart.setDate(weekEnd.getDate() - 6);
      
      const weekData = {
        name: `Week ${4-i}`,
        start: weekStart.toISOString().split('T')[0],
        end: weekEnd.toISOString().split('T')[0],
      };
      
      habits.forEach(habit => {
        const count = habit.trackingData.filter(item => {
          const date = new Date(item.date);
          return date >= weekStart && date <= weekEnd;
        }).length;
        
        weekData[habit.name] = count;
      });
      
      monthlyData.push(weekData);
    }
    
    return monthlyData;
  };

  const weeklyData = generateWeeklyData();
  const monthlyData = generateMonthlyData();

  // Generate random colors for each habit
  const getHabitColor = (index: number) => {
    const colors = [
      "#8B5CF6", // Vivid Purple
      "#D946EF", // Magenta Pink
      "#F97316", // Bright Orange
      "#0EA5E9", // Ocean Blue
      "#33C3F0", // Bright Blue
      "#10B981", // Emerald
      "#EC4899", // Pink
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Statistics</h1>

      <Tabs defaultValue="weekly" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="weekly">Weekly Report</TabsTrigger>
          <TabsTrigger value="monthly">Monthly Report</TabsTrigger>
        </TabsList>

        <TabsContent value="weekly">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Habit Tracking</CardTitle>
              <CardDescription>
                View your habit progress over the past 7 days
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer className="h-80" config={{}}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="name" />
                    <YAxis allowDecimals={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    {habits.map((habit, index) => (
                      <Line
                        key={habit.id}
                        type="monotone"
                        dataKey={habit.name}
                        stroke={getHabitColor(index)}
                        activeDot={{ r: 8 }}
                        strokeWidth={2}
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monthly">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Habit Tracking</CardTitle>
              <CardDescription>
                View your habit progress over the past 4 weeks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer className="h-80" config={{}}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="name" />
                    <YAxis allowDecimals={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    {habits.map((habit, index) => (
                      <Line
                        key={habit.id}
                        type="monotone"
                        dataKey={habit.name}
                        stroke={getHabitColor(index)}
                        activeDot={{ r: 8 }}
                        strokeWidth={2}
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background p-3 border border-border rounded-md shadow-md">
        <p className="text-sm font-medium mb-1">{label}</p>
        {payload.map((item: any, index: number) => (
          <div key={index} className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: item.color }}
            />
            <span className="text-sm">{item.name}: {item.value}</span>
          </div>
        ))}
      </div>
    );
  }

  return null;
};

export default Statistics;
