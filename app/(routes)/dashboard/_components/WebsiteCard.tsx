import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import {
  ChartContainer,
  type ChartConfig,
} from "@/components/ui/chart"
import { WebsiteInfoType } from "@/configs/type";
import { Globe } from "lucide-react";
import Link from "next/link";

type Props = {
    websiteInfo: WebsiteInfoType
}

const chartConfig = {
    desktop: {
        label: "Desktop",
        color: "var(--chart-1)",
    },
} satisfies ChartConfig

const WebsiteCard = ({websiteInfo}:Props) => {
    const hourlyData = websiteInfo?.analytics?.hourlyVisitors;
    const chartData = hourlyData?.length == 1 ? [
        {
            ...hourlyData[0], 
            hour:Number(hourlyData[0].hour) - 1 >= 0 ? Number(hourlyData[0].hour) - 1 : 0,
            visitors: 0,
            hourLabel: `${Number(hourlyData[0].hour - 1)} AM/PM`
        },
        hourlyData[0]
    ] : hourlyData;

    return (
        <Link href={`/dashboard/website/${websiteInfo?.website?.websiteId}`}>
            <Card className="p-5">
                <CardTitle>
                    <div className="flex gap-2 items-center">
                        <Globe className="h-8 w-8 p-2 rounded-md bg-primary text-white" />
                        <h2 className="font-bold text-lg">{websiteInfo?.website?.domain.replace(/^(https?:\/\/)?(www\.)?/, '')}</h2>
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
                                        dataKey="visitors"
                                        type="natural"
                                        fill="var(--color-primary)"
                                        fillOpacity={0.2}
                                        stroke="var(--color-primary)"
                                        strokeWidth={2}
                                    />
                                </AreaChart>
                            </ChartContainer>
                            <h2 className="text-sm pt-2"><strong>{websiteInfo?.analytics?.totalVisitors}</strong> Visitors</h2>
                    </CardContent>
                </CardTitle>
            </Card>
        </Link>
    )
};

export default WebsiteCard;
