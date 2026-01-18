"use client";

import { LiveUserType, WebsiteInfoType, WebsiteType } from "@/configs/type";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import FormInput from "./_components/FormInput";
import PageView from "./_components/PageView";
import Widgets from "./_components/Widgets";
import RecentIP from "./_components/RecentIP";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";
import Link from "next/link";

const websiteDetails = () => {
    const { websiteId } = useParams<{ websiteId?: string }>();
    const router = useRouter();
    const [websiteList, setWebsiteList] = useState<WebsiteType[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [websiteInfo, setWebsiteInfo] = useState<WebsiteInfoType | null>(null);
    const [selectedWebsiteId, setSelectedWebsiteId] = useState<string | undefined>(websiteId);
    const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
    const [viewMode, setViewMode] = useState<"hourly" | "daily">("hourly");
    const [liveUsers, setLiveUsers] = useState<LiveUserType[]>([]);

    const GetWebsiteList = useCallback(async () => {
        const websites = await axios.get('/api/website?websiteOnly=true');
        setWebsiteList(websites?.data);
        if (!selectedWebsiteId && websites?.data?.length) {
            setSelectedWebsiteId(websites.data[0].websiteId);
            router.replace(`/dashboard/website/${websites.data[0].websiteId}`);
        }
    }, [router, selectedWebsiteId]);

    const GetWebsiteAnalyticDetail = useCallback(async () => {
        if (!selectedWebsiteId) return;
        setLoading(true);
        const params = new URLSearchParams({ websiteId: selectedWebsiteId });

        if (dateRange?.from) {
            params.set("from", format(dateRange.from, "yyyy-MM-dd"));
        }
        if (dateRange?.to || dateRange?.from) {
            params.set("to", format(dateRange?.to ?? dateRange.from!, "yyyy-MM-dd"));
        }

        const websiteResult = await axios.get(`/api/website?${params.toString()}`);
        setWebsiteInfo(websiteResult?.data?.[0] ?? null);
        setLoading(false);
        handleLiveUsers();
    }, [dateRange?.from, dateRange?.to, selectedWebsiteId]);

    useEffect(() => {
        GetWebsiteList();
    }, [GetWebsiteList]);

    useEffect(() => {
        GetWebsiteAnalyticDetail();
    }, [GetWebsiteAnalyticDetail]);

    const handleWebsiteChange = (id: string) => {
        setSelectedWebsiteId(id);
        router.replace(`/dashboard/website/${id}`);
    };

    const handleRefresh = () => {
        GetWebsiteAnalyticDetail();
    };

    const handleLiveUsers = async () => {
        const result = await axios.get(`/api/live?websiteId=${selectedWebsiteId}`);
        console.log("Live Users:", result.data);
        setLiveUsers(result.data.activeUsers || []);
    };

    console.log("live users", liveUsers);
    console.log("live users length", liveUsers.length);

    return (
        <div className="mt-10">
            <FormInput
                websiteList={websiteList}
                selectedWebsiteId={selectedWebsiteId}
                dateRange={dateRange}
                onDateRangeChange={setDateRange}
                onWebsiteChange={handleWebsiteChange}
                onRefresh={handleRefresh}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
                loading={loading}
            />
            <PageView websiteInfo={websiteInfo} loading={loading} viewMode={viewMode} liveuserCount={liveUsers?.length} />
            <Widgets websiteId={selectedWebsiteId} />
            <RecentIP websiteId={selectedWebsiteId} />
            <footer className="mt-12 border-t backdrop-blur-sm">
              <div className="mx-auto flex max-w-6xl flex-col gap-3 px-6 py-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2">
                  <p className="text-xs text-muted-foreground hidden sm:block">SiteTrack</p>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <Link href="/">Home</Link>
                  <Link href="/dashboard">Dashboard</Link>
                  <a href="mailto:support@sitetrack.app">Support</a>
                </div>
              </div>
            </footer>
        </div>
    )
};

export default websiteDetails;
