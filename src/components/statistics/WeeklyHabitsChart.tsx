
import React from "react";
import { Habit } from "@/contexts/HabitContext";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import { getHabitColor } from "./HabitColorUtils";

type WeeklyHabitsChartProps = {
  habits: Habit[];
};

export const WeeklyHabitsChart: React.FC<WeeklyHabitsChartProps> = ({ habits }) => {
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

  const last7DaysData = generateLast7DaysData();

  return (
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
  );
};
