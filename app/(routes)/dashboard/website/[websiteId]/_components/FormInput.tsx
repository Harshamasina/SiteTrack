import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { WebsiteType } from "@/configs/type";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { useEffect, useMemo } from "react";
import { CalendarIcon, MoveLeftIcon, RefreshCcw, Settings2Icon } from "lucide-react";
import { format, isSameDay, subDays, differenceInCalendarDays } from "date-fns";
import { DateRange } from "react-day-picker";
import { Skeleton } from "@/components/ui/skeleton";
import { Select as RangeSelect, SelectContent as RangeSelectContent, SelectItem as RangeSelectItem, SelectTrigger as RangeSelectTrigger, SelectValue as RangeSelectValue } from "@/components/ui/select";
import Link from "next/link";

type Props = {
    websiteList: WebsiteType[];
    selectedWebsiteId?: string;
    dateRange?: DateRange;
    onDateRangeChange: (range?: DateRange) => void;
    onWebsiteChange: (id: string) => void;
    onRefresh: () => void;
    viewMode: "hourly" | "daily";
    onViewModeChange: (mode: "hourly" | "daily") => void;
    loading?: boolean;
};

const FormInput = ({
    websiteList,
    selectedWebsiteId,
    dateRange,
    onDateRangeChange,
    onWebsiteChange,
    onRefresh,
    viewMode,
    onViewModeChange,
    loading,
}: Props) => {
    const isTodayOnly = useMemo(() => {
        if (!dateRange?.from) return false;
        if (!dateRange?.to) return true;
        return isSameDay(dateRange.from, dateRange.to);
    }, [dateRange?.from, dateRange?.to]);

    const quickRangeValue = useMemo(() => {
        if (!dateRange?.from && !dateRange?.to) return "all";
        if (isTodayOnly) return "today";
        if (dateRange?.from && dateRange?.to) {
            const days = differenceInCalendarDays(dateRange.to, dateRange.from);
            if (days === 6) return "week";
            if (days === 29) return "month";
            if (days === 364) return "year";
        }
        return "custom";
    }, [dateRange?.from, dateRange?.to, isTodayOnly]);

    const handleDateChange = (range?: DateRange) => {
        if (!range?.from) return;
        if (range?.from && !range?.to) {
            onDateRangeChange({ from: range.from });
            return;
        }
        onDateRangeChange({ from: range.from, to: range.to });
    };

    const handleToday = () => {
        if (!dateRange?.from) return onDateRangeChange({ from: new Date() });
        onDateRangeChange({ from: new Date(), to: new Date() });
    };

    const handleReset = () => {
        onDateRangeChange({ from: new Date(), to: new Date() });
    };

    return (
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap items-center gap-3">
                <Select
                    value={selectedWebsiteId || ""}
                    onValueChange={(value) => onWebsiteChange(value)}
                >
                    <SelectTrigger className="w-[240px]">
                        <SelectValue placeholder="Select a Website" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Websites</SelectLabel>
                            {websiteList.map((website) => (
                                <SelectItem key={website.id} value={website.websiteId}>
                                    {website.domain.replace("https://", "")}
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>

                <RangeSelect
                    value={quickRangeValue}
                    onValueChange={(value) => {
                        const now = new Date();
                        if (value === "today") {
                            onDateRangeChange({ from: now, to: now });
                        } else if (value === "week") {
                            onDateRangeChange({ from: subDays(now, 6), to: now });
                        } else if (value === "month") {
                            onDateRangeChange({ from: subDays(now, 29), to: now });
                        } else if (value === "year") {
                            onDateRangeChange({ from: subDays(now, 364), to: now });
                        } else if (value === "all") {
                            onDateRangeChange(undefined);
                        } else {
                            onDateRangeChange(dateRange);
                        }
                    }}
                >
                    <RangeSelectTrigger className="w-[160px]">
                        <RangeSelectValue placeholder="Quick range" />
                    </RangeSelectTrigger>
                    <RangeSelectContent>
                        <RangeSelectItem value="all">All time</RangeSelectItem>
                        <RangeSelectItem value="today">Today</RangeSelectItem>
                        <RangeSelectItem value="week">Last week</RangeSelectItem>
                        <RangeSelectItem value="month">Last month</RangeSelectItem>
                        <RangeSelectItem value="year">Last year</RangeSelectItem>
                        <RangeSelectItem value="custom">Custom</RangeSelectItem>
                    </RangeSelectContent>
                </RangeSelect>

                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            id="date"
                            className={`data-[empty=true]:text-muted-foreground 
                                justify-between text-left font-normal
                                    ${dateRange?.to ? "w-[350px]" : "w-[240px]"}`}
                        >
                            <CalendarIcon />
                            {dateRange?.from ? (
                                dateRange?.to ? (
                                    <>
                                        {format(dateRange.from, "PPP")} - {format(dateRange.to, "PPP")}
                                    </>
                                ) : (
                                    <>{format(dateRange.from, "PPP")}</>
                                )
                            ) : (
                                <span>Pick a Date</span>
                            )}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                        <div className="flex justify-between items-center my-3 px-2 gap-2">
                            <Button variant={'outline'} onClick={handleToday}>Today</Button>
                            <Button variant={'outline'} onClick={handleReset}>Reset</Button>
                        </div>
                        <Calendar
                            mode="range"
                            selected={dateRange}
                            className="w-[300px]"
                            onSelect={handleDateChange}
                        />
                    </PopoverContent>
                </Popover>

                <Select
                    value={viewMode}
                    onValueChange={(value) => onViewModeChange(value as "hourly" | "daily")}
                >
                    <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Granularity" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="hourly">Hourly</SelectItem>
                        <SelectItem value="daily">Daily</SelectItem>
                    </SelectContent>
                </Select>

                <Button variant={'outline'} onClick={onRefresh} disabled={loading} className="gap-2">
                    <RefreshCcw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                    Refresh
                </Button>
            </div>
            <div className="flex items-center gap-3">
                <Link href="/dashboard">
                    <Button>
                        <MoveLeftIcon /> Dashboard
                    </Button>
                </Link>
                <Link href={`/dashboard/website/${selectedWebsiteId}/settings`}>
                    <Button variant={'outline'}><Settings2Icon /></Button>
                </Link>
            </div>
        </div>
    )
};

export default FormInput;
