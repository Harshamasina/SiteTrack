"use client"

import { Button } from "@/components/ui/button";
import { WebsiteInfoType } from "@/configs/type";
import Image from "next/image";
import { useEffect, useState } from "react";
import addImage from "../../../public/www.png";
import Link from "next/link";
import axios from "axios";
import WebsiteCard from "./_components/WebsiteCard";
import { Skeleton } from "@/components/ui/skeleton";
import { format, subDays } from "date-fns";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const Dashboard = () => {
    const [websiteList, setWebsiteList] = useState<WebsiteInfoType[]>([]);
    const [loading, setLoading] = useState(true);
    type RangeOption = "24h" | "month" | "year" | "all";
    const [range, setRange] = useState<RangeOption>("month");

    const fetchUserWebsites = async (selectedRange: RangeOption = range) => {
        setLoading(true);
        try {
            const today = new Date();
            const to = format(today, "yyyy-MM-dd");
            let url = "/api/website";

            if (selectedRange === "24h") {
                url += "?range=24h";
            } else if (selectedRange === "month") {
                const from = format(subDays(today, 30), "yyyy-MM-dd");
                url += `?from=${from}&to=${to}`;
            } else if (selectedRange === "year") {
                const from = format(subDays(today, 365), "yyyy-MM-dd");
                url += `?from=${from}&to=${to}`;
            } else {
                // all time: no query params
            }

            const result = await axios.get(url);
            setWebsiteList(result?.data);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchUserWebsites(range);
    }, [])

    console.log("websiteList:", websiteList);
    
    return (
        <div className="mt-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="font-bold text-xl">My Websites</h2>
                <div className="flex items-center gap-3 flex-wrap">
                    {
                        websiteList.length > 0 && (
                            <Select
                                defaultValue={range}
                                onValueChange={(value) => {
                                    const nextRange = value as RangeOption;
                                    setRange(nextRange);
                                    fetchUserWebsites(nextRange);
                                }}
                            >
                                <SelectTrigger className="w-44">
                                    <SelectValue placeholder="Select range" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="24h">Past 24 hours</SelectItem>
                                    <SelectItem value="month">Last month</SelectItem>
                                    <SelectItem value="year">Last year</SelectItem>
                                    <SelectItem value="all">All time</SelectItem>
                                </SelectContent>
                            </Select>
                        )
                    }
                    <Link href={'/dashboard/new'}>
                        <Button>+ Website</Button>
                    </Link>
                </div>
            </div>

            <div>
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                        {[1,2,3,4].map((item, index) => (
                            <div className="p-4" key={index}>
                                <div className="flex gap-2 items-center">
                                    <Skeleton className="h-8 w-8 rounded-sm" />
                                    <Skeleton className="h-8 w-1/2 rounded-sm" />
                                </div>
                                <Skeleton className="h-[80px] w-full mt-4" />
                            </div>
                        ))}
                    </div>
                ) : websiteList?.length === 0 ? (
                    <div className="flex flex-col justify-center items-center gap-4 p-8 border-2 border-dashed rounded-2xl mt-5">
                        <Image src={addImage} alt="add website" width={100} height={100}/>
                        <h2>You don't have any website added for tracking</h2>
                        <Link href={'/dashboard/new'}>
                            <Button>+ Website</Button>
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 mt-5">
                        {websiteList?.map((website, index) => (
                            <WebsiteCard key={index} websiteInfo={website} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default Dashboard;
