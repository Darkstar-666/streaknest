
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

type MonthlyHabitsChartProps = {
  habits: Habit[];
};

export const MonthlyHabitsChart: React.FC<MonthlyHabitsChartProps> = ({ habits }) => {
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

  const last30DaysData = generateLast30DaysData();

  return (
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
  );
};
