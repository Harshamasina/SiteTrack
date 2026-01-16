import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import {
  ChartContainer,
  type ChartConfig,
} from "@/components/ui/chart"
import { WebsiteType } from "@/configs/type";
import { Globe } from "lucide-react";

type Props = {
    website: WebsiteType
}

const WebsiteCard = ({website}:Props) => {
    const chartData = [
        { month: "January", desktop: 186 },
        { month: "February", desktop: 305 },
        { month: "March", desktop: 237 },
        { month: "April", desktop: 73 },
        { month: "May", desktop: 209 },
        { month: "June", desktop: 214 },
    ]

    const chartConfig = {
        desktop: {
            label: "Desktop",
            color: "var(--chart-1)",
        },
        } satisfies ChartConfig

    return (
        <div className="">
            <Card className="p-5">
                <CardTitle>
                    <div className="flex gap-2 items-center">
                        <Globe className="h-8 w-8 p-2 rounded-md bg-primary text-white" />
                        <h2 className="font-bold text-lg">{website?.domain.replace('https://','')}</h2>
                    </div>
                    <CardContent>
                            <ChartContainer config={chartConfig} className="max-h-40 w-full">
                                <AreaChart
                                    accessibilityLayer
                                    data={chartData}
                                    margin={{
                                    left: 12,
                                    right: 12,
                                    }}
                                >
                                    {/* <CartesianGrid vertical={false} /> */}
                                    {/* <XAxis
                                        dataKey="month"
                                        tickLine={false}
                                        axisLine={false}
                                        tickMargin={8}
                                        tickFormatter={(value) => value.slice(0, 3)}
                                    /> */}
                                    {/* <ChartTooltip
                                        cursor={false}
                                        content={<ChartTooltipContent indicator="line" />}
                                    /> */}
                                    <Area
                                        dataKey="desktop"
                                        type="natural"
                                        fill="var(--color-primary)"
                                        fillOpacity={0.2}
                                        stroke="var(--color-primary)"
                                        strokeWidth={2}
                                    />
                                </AreaChart>
                            </ChartContainer>
                            <h2 className="text-sm pt-2"><strong>24</strong> Visitors</h2>
                    </CardContent>
                </CardTitle>
            </Card>
        </div>
    )
};

export default WebsiteCard;