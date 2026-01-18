import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from "@/components/ui/chart";
import { WebsiteInfoType } from "@/configs/type";
import LabelCountItem from "./LabelCountItem";
import { Separator } from "@/components/ui/separator";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { BarChart3 } from "lucide-react";
import { format as formatDate, parseISO } from "date-fns";

type Props = {
    websiteInfo: WebsiteInfoType | null | undefined,
    loading?: boolean,
    viewMode?: "hourly" | "daily",
    liveuserCount?: number,
}
const PageView = ({ websiteInfo, loading, viewMode = "hourly", liveuserCount }: Props) => {
    const webAnalytics = websiteInfo?.analytics;
    const totalVisitors = webAnalytics?.totalVisitors ?? 0;
    const totalSessions = webAnalytics?.totalSessions ?? 0;
    const totalActiveMinutes = webAnalytics ? (webAnalytics.totalActiveTime ?? 0) / 60000 : 0;
    const avgActiveMinutes = webAnalytics ? (webAnalytics.avgActiveTime ?? 0) / 60000 : 0;
    const hourlyData = webAnalytics?.hourlyVisitors ?? [];

    const formatHourLabel = (hour: number) => {
        const hour12 = hour % 12 || 12;
        const suffix = hour < 12 ? "AM" : "PM";
        return `${hour12} ${suffix}`;
    };

    const normalizedHourly = (() => {
        const buckets = Array.from({ length: 24 }, (_, hour) => ({
            hour,
            key: hour,
            label: formatHourLabel(hour),
            visitors: 0,
        }));

        hourlyData.forEach((item: any) => {
            const hour = Number(item.hour);
            if (!Number.isFinite(hour) || hour < 0 || hour > 23) return;
            const visitors = item.visitors ?? item.count ?? 0;
            buckets[hour].visitors += visitors;
        });

        return buckets;
    })();

    // Build daily aggregates from hourly data if API does not provide dailyVisitors
    const dailyAggregates = (() => {
        const map = new Map<string, number>();
        hourlyData.forEach((item: any) => {
            const key = item.date ?? item.dayLabel ?? "";
            if (!key) return;
            const val = item.visitors ?? item.count ?? 0;
            map.set(key, (map.get(key) ?? 0) + val);
        });
        return Array.from(map.entries()).map(([name, visitors]) => ({
            name,
            visitors,
            date: name,
            dayLabel: name,
        }));
    })();

    const sourceData =
        viewMode === "daily"
            ? webAnalytics?.dailyVisitors ?? dailyAggregates
            : normalizedHourly;

    const chartData =
        sourceData?.map((item: any, idx: number) => {
            const rawDate = item.date ?? item.dayLabel ?? item.hourLabel ?? "";
            const parsedDate =
                viewMode === "daily" && rawDate
                    ? parseISO(String(rawDate))
                    : null;
            const label =
                viewMode === "daily" && parsedDate && !isNaN(parsedDate.getTime())
                    ? formatDate(parsedDate, "MMM d")
                    : (viewMode === "daily" ? rawDate : item.label ?? item.hourLabel ?? rawDate ?? `${idx}`);
            const key = viewMode === "hourly"
                ? item.hour ?? idx
                : item.dayLabel ?? item.hourLabel ?? rawDate ?? `${idx}`;

            return {
                key,
                label: label || key || `${idx}`,
                visitors: item.visitors ?? item.count ?? 0,
            };
        }) ?? [];

    const xAxisLabel = viewMode === "daily" ? "Days" : "Hours";

    const chartConfig: ChartConfig = {
        visitors: {
            label: "Visitors",
            color: "hsl(var(--primary))",
        },
    };

    if (loading) {
        return (
            <div className="mt-7 space-y-4">
                <Card>
                    <CardContent className="p-5 grid grid-cols-1 sm:grid-cols-5 gap-4">
                        {[1,2,3,4,5].map((i) => (
                            <div key={i} className="space-y-2">
                                <Skeleton className="h-4 w-20" />
                                <Skeleton className="h-8 w-16" />
                            </div>
                        ))}
                    </CardContent>
                </Card>
                <Card className="p-4">
                    <Skeleton className="h-[260px] w-full" />
                </Card>
            </div>
        );
    }

    if (!chartData.length) {
        return (
            <div className="mt-7">
                <Card>
                    <CardContent className="p-10 flex flex-col items-center justify-center gap-3 text-center text-muted-foreground">
                        <BarChart3 className="h-12 w-12" />
                        <p className="text-sm">No chart data available for the selected range.</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="mt-7">
            <Card>
                <CardContent className="p-5 flex flex-wrap items-center gap-4 justify-between">
                    <LabelCountItem label='Visitors' value={totalVisitors} />
                    <Separator orientation="vertical" className="h-10 hidden sm:block" />
                    <LabelCountItem label='Total Page Views' value={totalSessions} />
                    <Separator orientation="vertical" className="h-10 hidden sm:block" />
                    <LabelCountItem label='Total Active Time' value={`${totalActiveMinutes.toFixed(1)} min`}  />
                    <Separator orientation="vertical" className="h-10 hidden sm:block" />
                    <LabelCountItem label='Avg Active Time' value={`${avgActiveMinutes.toFixed(1)} min`} />
                    <Separator orientation="vertical" className="h-10 hidden sm:block" />
                    <LabelCountItem label='Live Users' value={liveuserCount} />
                </CardContent>

                <CardContent className="p-5 mt-5">
                    <div className="mt-6 w-full">
                        <ChartContainer config={chartConfig} className="h-[320px] w-full">
                            <AreaChart 
                                data={chartData}
                                accessibilityLayer
                                margin={{ left: 12, right: 12, top: 0, bottom: 0 }}
                            >
                                <CartesianGrid strokeDasharray="2 4" vertical={false} />
                                <XAxis
                                    dataKey="key"
                                    tickLine={false}
                                    axisLine={false}
                                    tickMargin={12}
                                    interval={0}
                                    minTickGap={12}
                                    tickFormatter={(value) => {
                                        const match = chartData.find((d) => d.key === value);
                                        return match?.label || value;
                                    }}
                                    label={{ value: xAxisLabel, position: "insideBottom", offset: 16 }}
                                />
                                <YAxis
                                    tickLine={false}
                                    axisLine={false}
                                    width={60}
                                    domain={[0, "dataMax + 2"]}
                                    label={{ value: "Visitors", angle: -90, position: "insideLeft", offset: 10 }}
                                />
                                <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
                                <Area
                                    type="monotone"
                                    dataKey="visitors"
                                    stroke="var(--color-primary)"
                                    fill="var(--color-primary)"
                                    fillOpacity={0.2}
                                    strokeWidth={3}
                                    dot={false}
                                    activeDot={{ r: 4 }}
                                />
                            </AreaChart>
                        </ChartContainer>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
};

export default PageView;
