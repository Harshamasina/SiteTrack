import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from "@/components/ui/chart";
import { WebsiteInfoType } from "@/configs/type";
import { Globe } from "lucide-react";
import Link from "next/link";

type Props = {
    websiteInfo: WebsiteInfoType
}

const chartConfig = {
    visitors: {
        label: "Visitors",
        color: "var(--color-primary)",
    },
} satisfies ChartConfig;

const WebsiteCard = ({websiteInfo}:Props) => {
    const hourlyData = websiteInfo?.analytics?.hourlyVisitors ?? [];

    const formatHourLabel = (hour: number) => {
        const hour12 = hour % 12 || 12;
        const suffix = hour < 12 ? "AM" : "PM";
        return `${hour12} ${suffix}`;
    };

    const chartData = (() => {
        const buckets = Array.from({ length: 24 }, (_, hour) => ({
            hour,
            visitors: 0,
            hourLabel: formatHourLabel(hour),
        }));

        hourlyData.forEach((item: any) => {
            const hour = Number(item.hour);
            if (!Number.isFinite(hour) || hour < 0 || hour > 23) return;
            const visitors = item.visitors ?? item.count ?? 0;
            buckets[hour].visitors += visitors;
        });

        // If all zeros, keep as-is to show empty chart with consistent labels
        return buckets;
    })();

    return (
        <Link href={`/dashboard/website/${websiteInfo?.website?.websiteId}`}>
            <Card className="p-5">
                <CardTitle>
                    <div className="flex gap-2 items-center">
                        <Globe className="h-8 w-8 p-2 rounded-md bg-primary text-white" />
                        <h2 className="font-bold text-lg">{websiteInfo?.website?.domain.replace(/^(https?:\/\/)?(www\.)?/, '')}</h2>
                    </div>
                    <CardContent>
                            <ChartContainer config={chartConfig} className="h-full w-full">
                                <AreaChart
                                    accessibilityLayer
                                    data={chartData}
                                    margin={{
                                        left: 12,
                                        right: 12,
                                    }}
                                >
                                    <CartesianGrid vertical={false} />
                                    {/* <XAxis
                                        dataKey="hour"
                                        tickLine={false}
                                        axisLine={false}
                                        tickMargin={8}
                                        interval={0}
                                        minTickGap={12}
                                        tickFormatter={(value: number) => chartData[value]?.hourLabel ?? value}
                                    /> */}
                                    <YAxis hide domain={[0, "dataMax + 2"]} />
                                    <ChartTooltip
                                        cursor={false}
                                        content={<ChartTooltipContent indicator="line" />}
                                    />
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
