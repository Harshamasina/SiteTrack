import { db } from "@/configs/db";
import { liveUserTable } from "@/configs/schema"
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { UAParser } from "ua-parser-js";

type GeoInfo = {
    city: string;
    region: string;
    country: string;
    lat: string;
    lon: string;
};

const ACTIVE_WINDOW_MS = 30_000;

const DEFAULT_GEO: GeoInfo = {
    city: "Unknown City",
    region: "Unknown Region",
    country: "Unknown Country",
    lat: "0",
    lon: "0",
};

async function getGeoFromIp(ip?: string | null): Promise<GeoInfo> {
    if (!ip) {
        return { ...DEFAULT_GEO };
    }

    const trimmedIp = ip.trim();
    if (!trimmedIp || trimmedIp === "127.0.0.1" || trimmedIp === "::1") {
        return { ...DEFAULT_GEO };
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 1500);

    try {
        const geoRes = await fetch(`https://ipapi.co/${trimmedIp}/json/`, {
            signal: controller.signal,
        });

        if (!geoRes.ok) {
            return { ...DEFAULT_GEO };
        }

        const geoInfo = await geoRes.json();

        return {
            city: geoInfo.city || DEFAULT_GEO.city,
            region: geoInfo.regionName || geoInfo.region || DEFAULT_GEO.region,
            country: geoInfo.country_name || geoInfo.country || DEFAULT_GEO.country,
            lat: (geoInfo.latitude ?? geoInfo.lat ?? DEFAULT_GEO.lat).toString(),
            lon: (geoInfo.longitude ?? geoInfo.lon ?? DEFAULT_GEO.lon).toString(),
        };
    } catch (err) {
        const isAbortError = (err as Error)?.name === "AbortError";
        if (!isAbortError) {
            console.error("Geo lookup failed:", err);
        }
        return { ...DEFAULT_GEO };
    } finally {
        clearTimeout(timeout);
    }
}

export async function POST(req: NextRequest) {
    try {
        let body: Record<string, unknown>;

        try {
            body = await req.json();
        } catch {
            return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
        }

        const { visitorId, websiteId, last_seen } = body;

        if (!visitorId || !websiteId) {
            return NextResponse.json({ error: "visitorId and websiteId are required" }, { status: 400 });
        }

        const parsedLastSeen = last_seen === undefined ? Date.now() : Number(last_seen);
        if (!Number.isFinite(parsedLastSeen) || parsedLastSeen <= 0) {
            return NextResponse.json({ error: "last_seen must be a valid timestamp" }, { status: 400 });
        }
        const lastSeenString = parsedLastSeen.toString();

        const parser = new UAParser(req.headers.get("user-agent") || "");
        const deviceInfo = parser.getDevice()?.model || "Unknown Device";
        const osInfo = parser.getOS()?.name || "Unknown OS";
        const browserInfo = parser.getBrowser()?.name || "Unknown Browser";

        const ip =
            req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
            req.headers.get("x-real-ip") ||
            undefined;

        const geoInfo = await getGeoFromIp(ip);

        await db
            .insert(liveUserTable)
            .values({
                visitorId: String(visitorId),
                websiteId: String(websiteId),
                last_seen: lastSeenString,
                city: geoInfo.city,
                region: geoInfo.region,
                country: geoInfo.country,
                lat: geoInfo.lat,
                lon: geoInfo.lon,
                os: osInfo,
                browser: browserInfo,
                device: deviceInfo,
            })
            .onConflictDoUpdate({
                target: liveUserTable.visitorId,
                set: {
                    websiteId: String(websiteId),
                    last_seen: lastSeenString,
                    city: geoInfo.city,
                    region: geoInfo.region,
                    country: geoInfo.country,
                    lat: geoInfo.lat,
                    lon: geoInfo.lon,
                    device: deviceInfo,
                    os: osInfo,
                    browser: browserInfo,
                },
            });

        return NextResponse.json(
            { message: "Live user data recorded/updated successfully." },
            { status: 200 },
        );
    } catch (err) {
        console.error("Error in live route:", err);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    try {
        const websiteId = req.nextUrl.searchParams.get("websiteId");

        if (!websiteId) {
            return NextResponse.json({ error: "websiteId is required" }, { status: 400 });
        }

        const rows = await db
            .select()
            .from(liveUserTable)
            .where(eq(liveUserTable.websiteId, websiteId));

        const now = Date.now();
        const activeUsers = rows.filter((row) => {
            const lastSeen = Number(row.last_seen);
            return Number.isFinite(lastSeen) && lastSeen > now - ACTIVE_WINDOW_MS;
        });

        return NextResponse.json({ activeUsers }, { status: 200 });
    } catch (err) {
        console.error("Error fetching live users:", err);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}