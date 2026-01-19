import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { WebsiteInfoType } from "@/configs/type";

type BarItem = {
    name: string;
    visitors: number;
    image?: string;
    code?: string;
};

type Props = {
    websiteId?: string;
    refreshKey?: number;
};

const WidgetBar = ({ item, max }: { item: BarItem; max: number }) => {
    const width = max > 0 ? Math.max(8, (item.visitors / max) * 100) : 0;
    const flagSrc = item.code ? `https://flagsapi.com/${item.code.toUpperCase()}/flat/64.png` : undefined;
    const iconSrc =
        item.image ||
        flagSrc ||
        (item.name ? `/icons/${item.name.toLowerCase()}.png` : undefined);
    return (
        <div className="flex items-center gap-3">
            <div className="w-12 shrink-0 flex justify-center">
                {iconSrc ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={iconSrc}
                        alt={item.name}
                        className="h-6 w-6 object-contain"
                        onError={(e) => {
                            (e.target as HTMLImageElement).style.display = "none";
                        }}
                    />
                ) : null}
            </div>
            <div className="flex-1">
                <div className="text-sm font-medium mb-1">{item.name || "Unknown"}</div>
                <div className="bg-muted rounded-full h-8 overflow-hidden">
                    <div
                        className="h-full bg-primary/70 flex items-center px-3 text-sm text-primary-foreground"
                        style={{ width: `${width}%` }}
                    >
                        {item.visitors}
                    </div>
                </div>
            </div>
        </div>
    );
};

const EmptyState = () => (
    <div className="flex flex-col items-center justify-center text-muted-foreground py-10 gap-2">
        <Skeleton className="h-10 w-full" />
        <p className="text-sm">No data available for this category.</p>
    </div>
);

const Widgets = ({ websiteId, refreshKey }: Props) => {
    const [data, setData] = useState<WebsiteInfoType | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            if (!websiteId) return;
            setLoading(true);
            setError(null);
            try {
                const res = await axios.get(`/api/website?websiteId=${websiteId}`);
                setData(res.data?.[0] ?? null);
            } catch (e: any) {
                setError(e?.message || "Failed to load widgets");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [websiteId, refreshKey]);

    const analytics = data?.analytics;

    const normalize = (items: any[] | undefined): BarItem[] => {
        if (!items) return [];
        return items
            .filter((i) => i && (i.visitors ?? i.count ?? 0) >= 0)
            .map((i) => ({
                name: i.name ?? i.country ?? "Unknown",
                visitors: Number(i.visitors ?? i.count ?? 0) || 0,
                image: i.image,
                code: i.countryCode || i.code,
            }));
    };

    const geoTabs = useMemo(
        () => ({
            countries: normalize(analytics?.countries),
            cities: normalize(analytics?.cities),
            regions: normalize(analytics?.regions),
        }),
        [analytics?.countries, analytics?.cities, analytics?.regions]
    );

    const techTabs = useMemo(
        () => ({
            devices: normalize(analytics?.devices),
            os: normalize(analytics?.os),
            browsers: normalize(analytics?.browsers),
        }),
        [analytics?.devices, analytics?.os, analytics?.browsers]
    );

    const renderTab = (items: BarItem[]) => {
        if (loading) {
            return (
                <div className="space-y-3">
                    {[1, 2].map((i) => (
                        <Skeleton key={i} className="h-12 w-full" />
                    ))}
                </div>
            );
        }
        if (error) {
            return <div className="text-sm text-destructive">{error}</div>;
        }
        if (!items?.length) {
            return <EmptyState />;
        }
        const max = Math.max(...items.map((i) => i.visitors || 0));
        return (
            <div className="space-y-3">
                {items.map((item, idx) => (
                    <WidgetBar key={`${item.name}-${idx}`} item={item} max={max} />
                ))}
            </div>
        );
    };

    if (!websiteId) return null;

    return (
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card className="h-full">
                <CardContent className="p-4 h-full">
                    <Tabs defaultValue="countries" className="h-full flex flex-col">
                        <TabsList className="w-[250px] p-2">
                            <TabsTrigger value="countries">Countries</TabsTrigger>
                            <TabsTrigger value="cities">Cities</TabsTrigger>
                            <TabsTrigger value="regions">Regions</TabsTrigger>
                        </TabsList>
                        <TabsContent value="countries" className="mt-4 flex-1">
                            {renderTab(geoTabs.countries)}
                        </TabsContent>
                        <TabsContent value="cities" className="mt-4 flex-1">
                            {renderTab(geoTabs.cities)}
                        </TabsContent>
                        <TabsContent value="regions" className="mt-4 flex-1">
                            {renderTab(geoTabs.regions)}
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>

            <Card className="h-full">
                <CardContent className="p-4 h-full">
                    <Tabs defaultValue="devices" className="h-full flex flex-col">
                        <TabsList className="w-[250px] p-2">
                            <TabsTrigger value="devices">Devices</TabsTrigger>
                            <TabsTrigger value="os">OS</TabsTrigger>
                            <TabsTrigger value="browsers">Browsers</TabsTrigger>
                        </TabsList>
                        <TabsContent value="devices" className="mt-4 flex-1">
                            {renderTab(techTabs.devices)}
                        </TabsContent>
                        <TabsContent value="os" className="mt-4 flex-1">
                            {renderTab(techTabs.os)}
                        </TabsContent>
                        <TabsContent value="browsers" className="mt-4 flex-1">
                            {renderTab(techTabs.browsers)}
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    );
};

export default Widgets;
