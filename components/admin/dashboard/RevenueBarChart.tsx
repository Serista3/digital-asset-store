'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, LabelList } from 'recharts';
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import Heading from '@/components/typography/Heading';
import Paragraph from '@/components/typography/Paragraph';

const chartConfig = {
  revenue: {
    label: 'Revenue',
    color: 'oklch(76.5% 0.177 163.223)',
  },
} satisfies ChartConfig;

interface RevenueBarChartProps {
  data: {
    label: string;
    revenue: number;
  }[];
  labelType: string;
  title?: string; 
  description?: string;
}

export default function RevenueBarChart({ data, labelType, title, description }: RevenueBarChartProps) {
  return (
    <div className='w-full flex flex-col gap-4'>
      {/* Chart Heading */}
      {title && (
        <div className="flex flex-col gap-1">
          <Heading level='3'>{title}</Heading>
          {description && <Paragraph>{description}</Paragraph>}
        </div>
      )}

      {/* Chart */}
      <ChartContainer config={chartConfig} className="h-100 w-full">
        <BarChart accessibilityLayer data={data} margin={{ top: 30, right: 10, left: 20, bottom: 50 }}>
          <CartesianGrid vertical={false} />
          
          {/* Month | Date XAxis */}
          <XAxis
            dataKey="label"
            tickLine={true}
            tickMargin={10}
            axisLine={true}
            tickFormatter={(value) => value.toString().slice(0, 3)}
            label={{ 
              value: labelType,
              position: 'insideBottom',
              offset: -30,
              fill: '#bbb',
              fontSize: 14
            }}
          />
          
          {/* Revenue YAxis */}
          <YAxis
            dataKey="revenue"
            tickLine={true}
            tickMargin={10}
            axisLine={true}
            label={{ 
              value: 'Revenue (THB)', 
              angle: -90,
              position: 'insideLeft', 
              offset: -10,
              fill: 'oklch(76.5% 0.177 163.223)', 
              fontSize: 14
            }}
          />
          
          {/* Tooltip */}
          <ChartTooltip content={<ChartTooltipContent />} />

          {/* Legend */}
          <ChartLegend content={<ChartLegendContent />} verticalAlign='top' align='left' />
          
          {/* Revenue Bar */}
          <Bar dataKey="revenue" fill="var(--color-revenue)" radius={4}>
            <LabelList 
              dataKey="revenue" 
              position="top"
              offset={10}
              fill="#fff" 
              fontSize={12}
            />
          </Bar>
        </BarChart>
      </ChartContainer>
    </div>
  );
}
