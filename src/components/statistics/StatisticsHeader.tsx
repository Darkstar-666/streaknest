
import React from "react";

type StatisticsHeaderProps = {
  title: string;
};

export const StatisticsHeader: React.FC<StatisticsHeaderProps> = ({ title }) => {
  return (
    <h1 className="text-3xl font-bold mb-6">{title}</h1>
  );
};
