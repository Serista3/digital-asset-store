"use client"
import { Bar, BarChart, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

// ข้อมูลจำลอง (เดี๋ยวเราค่อยเอา API ที่คุณเขียนมาเสียบแทน)
const chartData = [
  { month: "Jan", revenue: 12000 },
  { month: "Feb", revenue: 15000 },
  { month: "Mar", revenue: 10000 },
]

export default function MonthlyRevenueChart() {
  return (
    <ChartContainer config={{ revenue: { label: "Revenue", color: "hsl(var(--primary))" } }}>
      <BarChart data={chartData}>
        <XAxis dataKey="month" />
        <YAxis dataKey='revenue' />
        <ChartTooltip content={<ChartTooltipContent />} />
        {/* กราฟแท่ง */}
        <Bar dataKey="revenue" fill="var(--color-revenue)" radius={4} />
      </BarChart>
    </ChartContainer>
  )
}