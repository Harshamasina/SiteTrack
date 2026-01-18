import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const ip = req.nextUrl.searchParams.get("ip");
    if (!ip) {
        return NextResponse.json({ message: "ip is required" }, { status: 400 });
    }

    try {
        // Request the fields we need, including continent info.
        const res = await fetch(
            `http://ip-api.com/json/${ip}?fields=status,message,continent,continentCode,country,countryCode,region,regionName,city,district,zip,lat,lon,timezone,query`
        );
        if (!res.ok) {
            return NextResponse.json(
                { message: "Failed to reach IP lookup service" },
                { status: 502 }
            );
        }
        const data = await res.json();
        if (data?.status === "fail") {
            return NextResponse.json(
                { message: data?.message || "Lookup failed" },
                { status: 400 }
            );
        }
        return NextResponse.json(data);
    } catch (error: any) {
        return NextResponse.json(
            { message: "Error fetching IP info", error: error?.message || "Unknown error" },
            { status: 500 }
        );
    }
}
