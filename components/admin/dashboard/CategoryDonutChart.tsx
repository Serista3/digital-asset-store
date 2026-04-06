'use client';

import { Pie, PieChart } from 'recharts';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart';
import Heading from '@/components/typography/Heading';
import Paragraph from '@/components/typography/Paragraph';

interface CategoryDonutChartProps {
  data: {
    title: string;
    value: number;
  }[];
  title?: string; 
  description?: string;
}

export default function CategoryDonutChart({ data, title, description }: CategoryDonutChartProps) {
  // Config Donut Chart
  const chartConfig = {} as ChartConfig;

  // Formmatted Donut Chart Data
  const formattedData = data.map((item, index) => {

    // Generated Random Color
    const hue = (index * (360 / data.length)) % 360;
    const color = `oklch(70% 0.15 ${hue})`;

    // Map category title to chart config
    chartConfig[item.title] = {
      label: item.title,
      color: color,
    };

    return {
      ...item,
      fill: color,
    };
  });

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Chart Heading */}
      {title && (
        <div className="flex flex-col gap-1">
          <Heading level="3">{title}</Heading>
          {description && <Paragraph>{description}</Paragraph>}
        </div>
      )}

      {/* Chart */}
      {data.length > 0 && (
        <ChartContainer config={chartConfig} className="h-70 w-full">
          <PieChart>
            {/* Tooltip */}
            <ChartTooltip
              cursor={false}
              offset={25}
              content={<ChartTooltipContent className="w-40" hideLabel />}
            />
            
            {/* Legend */}
            <ChartLegend content={<ChartLegendContent />} verticalAlign='bottom' align='center' />
            
            {/* Pie */}
            <Pie
              data={formattedData}
              dataKey="value"
              nameKey="title"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={2}
            />
          </PieChart>
        </ChartContainer>
      )}

      {/* No Donut Chart Data */}
      {data.length === 0 && <Paragraph className='text-gray-400'>No categories data.</Paragraph>}
    </div>
  );
}
