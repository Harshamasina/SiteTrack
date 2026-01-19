import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, Globe2, Copy } from "lucide-react";

type IpInfo = {
    ip: string;
    country?: string;
    countryCode?: string;
    region?: string;
    city?: string;
};

type IpDetails = {
    continent?: string;
    continentCode?: string;
    country?: string;
    countryCode?: string;
    region?: string;
    regionName?: string;
    city?: string;
    district?: string;
    zip?: string;
    lat?: number;
    lon?: number;
    timezone?: string;
    query?: string;
    status?: string;
    message?: string;
};

type Props = {
    websiteId?: string;
    refreshKey?: number;
};

const RecentIP = ({ websiteId, refreshKey }: Props) => {
    const [ips, setIps] = useState<IpInfo[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selected, setSelected] = useState<IpInfo | null>(null);
    const [details, setDetails] = useState<IpDetails | null>(null);
    const [detailsLoading, setDetailsLoading] = useState(false);
    const [detailsError, setDetailsError] = useState<string | null>(null);
    const [copiedIp, setCopiedIp] = useState<string | null>(null);

    useEffect(() => {
        const fetchIps = async () => {
            if (!websiteId) return;
            setLoading(true);
            setError(null);
            try {
                const res = await axios.get(`/api/recentip?websiteId=${websiteId}`);
                setIps(res.data ?? []);
            } catch (e: any) {
                setError(e?.message || "Failed to load recent IPs");
            } finally {
                setLoading(false);
            }
        };
        fetchIps();
    }, [websiteId, refreshKey]);

    const fetchDetails = async (ip: string) => {
        setDetailsLoading(true);
        setDetailsError(null);
        setDetails(null);
        try {
            const res = await axios.get(`/api/ipinfo?ip=${ip}`);
            setDetails(res.data);
        } catch (e: any) {
            setDetailsError(e?.message || "Failed to fetch IP details");
        } finally {
            setDetailsLoading(false);
        }
    };

    const handleOpen = (ipInfo: IpInfo) => {
        setSelected(ipInfo);
        if (ipInfo.ip) fetchDetails(ipInfo.ip);
    };

    const handleCopy = async (ip: string) => {
        try {
            await navigator.clipboard.writeText(ip);
            setCopiedIp(ip);
            setTimeout(() => setCopiedIp(null), 1500);
        } catch {
            setCopiedIp(null);
        }
    };

    if (!websiteId) return null;

    return (
        <Card className="h-full mt-7">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Globe2 className="h-5 w-5" />
                    Recent IPs
                </CardTitle>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <div className="space-y-2">
                        {[1,2,3,4].map((i) => (
                            <Skeleton key={i} className="h-10 w-full" />
                        ))}
                    </div>
                ) : error ? (
                    <div className="flex items-center gap-2 text-sm text-destructive">
                        <AlertCircle className="h-4 w-4" />
                        {error}
                    </div>
                ) : ips.length === 0 ? (
                    <div className="text-sm text-muted-foreground">No recent IPs found.</div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {ips.map((ip) => (
                            <Dialog
                                key={ip.ip}
                                onOpenChange={(open) => {
                                    if (open) {
                                        handleOpen(ip);
                                    } else {
                                        setDetails(null);
                                        setDetailsError(null);
                                    }
                                }}
                            >
                                <DialogTrigger asChild>
                                    <Button variant="outline" className="justify-between h-auto py-3 px-3">
                                        <div className="flex flex-col items-start">
                                            <span className="font-semibold">{ip.ip || "Unknown IP"}</span>
                                            <span className="text-xs text-muted-foreground">
                                                {[ip.city, ip.region, ip.country].filter(Boolean).join(", ")}
                                            </span>
                                        </div>
                                        {ip.ip ? (
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    handleCopy(ip.ip!);
                                                }}
                                                aria-label="Copy IP"
                                                className="transition-transform"
                                            >
                                                <Copy
                                                    className={`h-4 w-4 ${
                                                        copiedIp === ip.ip ? "animate-ping text-primary" : ""
                                                    }`}
                                                />
                                            </Button>
                                        ) : null}
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>IP Details</DialogTitle>
                                    </DialogHeader>
                                    {detailsLoading ? (
                                        <div className="space-y-2">
                                            {[1,2,3].map((i) => (
                                                <Skeleton key={i} className="h-6 w-full" />
                                            ))}
                                        </div>
                                    ) : detailsError ? (
                                        <div className="flex items-center gap-2 text-sm text-destructive">
                                            <AlertCircle className="h-4 w-4" />
                                            {detailsError}
                                        </div>
                                    ) : details ? (
                                        <div className="space-y-2 text-sm">
                                            <div><strong>IP:</strong> {details.query || "N/A"}</div>
                                            <div><strong>Continent:</strong> {details.continent || "N/A"} ({details.continentCode || "-"})</div>
                                            <div><strong>Country:</strong> {details.country || "N/A"} ({details.countryCode || "-"})</div>
                                            <div><strong>Region:</strong> {details.regionName || "N/A"} ({details.region || "-"})</div>
                                            <div><strong>City:</strong> {details.city || "N/A"}</div>
                                            <div><strong>District:</strong> {details.district || "N/A"}</div>
                                            <div><strong>ZIP:</strong> {details.zip || "N/A"}</div>
                                            <div><strong>Coordinates:</strong> {details.lat ?? "N/A"}, {details.lon ?? "N/A"}</div>
                                            <div><strong>Timezone:</strong> {details.timezone || "N/A"}</div>
                                        </div>
                                    ) : (
                                        <div className="text-sm text-muted-foreground">No details available.</div>
                                    )}
                                </DialogContent>
                            </Dialog>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default RecentIP;
