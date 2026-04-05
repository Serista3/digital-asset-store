"use client"
import { Pie, PieChart } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const categoryData = [
  { category: "Clothing", sales: 400, fill: "var(--color-clothing)" },
  { category: "Shoes", sales: 300, fill: "var(--color-shoes)" },
]

export default function CategoryDonutChart() {
  return (
    <ChartContainer config={{ /* ตั้งค่าสีตาม Category ตรงนี้ */ }}>
      <PieChart>
        <ChartTooltip content={<ChartTooltipContent />} />
        {/* innerRadius = ความกลวงตรงกลาง (ทำให้เป็นโดนัท) */}
        <Pie data={categoryData} dataKey="sales" nameKey="category" innerRadius={60} />
      </PieChart>
    </ChartContainer>
  )
}