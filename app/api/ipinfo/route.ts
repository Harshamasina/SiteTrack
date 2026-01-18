import { corsJson, corsOptionsResponse } from "@/lib/cors";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    const ip = req.nextUrl.searchParams.get("ip");
    if (!ip) {
        return corsJson({ message: "ip is required" }, { status: 400 });
    }

    try {
        // Request the fields we need, including continent info.
        const res = await fetch(
            `http://ip-api.com/json/${ip}?fields=status,message,continent,continentCode,country,countryCode,region,regionName,city,district,zip,lat,lon,timezone,query`
        );
        if (!res.ok) {
            return corsJson(
                { message: "Failed to reach IP lookup service" },
                { status: 502 }
            );
        }
        const data = await res.json();
        if (data?.status === "fail") {
            return corsJson(
                { message: data?.message || "Lookup failed" },
                { status: 400 }
            );
        }
        return corsJson(data);
    } catch (error: any) {
        return corsJson(
            { message: "Error fetching IP info", error: error?.message || "Unknown error" },
            { status: 500 }
        );
    }
}

export function OPTIONS() {
    return corsOptionsResponse();
}
