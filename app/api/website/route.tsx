import { db } from "@/configs/db";
import { pageViewTable, websiteTable } from "@/configs/schema";
import { currentUser } from "@clerk/nextjs/server";
import { and, desc, eq, sql } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const { websiteId, domain, timeZone, enableLocalhostTracking } = await req.json();
    const user = await currentUser();

    if (!user?.primaryEmailAddress?.emailAddress) {
        return NextResponse.json(
            { message: "Unauthorized or missing email address" },
            { status: 401 }
        );
    }

    const userEmail = user.primaryEmailAddress.emailAddress;

    const existingDomain = await db
        .select()
        .from(websiteTable)
        .where(and(eq(websiteTable.domain, domain), eq(websiteTable.userEmail, userEmail)));

    if (existingDomain.length > 0) {
        return NextResponse.json(
            { message: "Domain already exists!", data: existingDomain[0] },
            { status: 400 }
        );
    }

    const result = await db
        .insert(websiteTable)
        .values({
            domain: domain,
            websiteId: websiteId,
            timeZone: timeZone,
            enableLocalhostTracking: enableLocalhostTracking,
            userEmail: user.primaryEmailAddress.emailAddress,
        })
        .returning();

    return NextResponse.json(result);
}

// export async function GET(req:NextRequest) {
//     const user = await currentUser();
//     const userEmail = user?.primaryEmailAddress?.emailAddress;
//     const result = await db.select().from(websiteTable)
//         .where(eq(websiteTable.userEmail, userEmail as string))
//         .orderBy(desc(websiteTable.id));
//     return NextResponse.json(result);
// }


export async function GET(req:NextRequest) {
    const user = await currentUser();

    if (!user?.primaryEmailAddress?.emailAddress) {
        return NextResponse.json(
            { message: "Unauthorized or missing email address" },
            { status: 401 }
        );
    }

    const userEmail = user.primaryEmailAddress.emailAddress;
    const range = req.nextUrl.searchParams.get("range") ?? "all";
    const websiteOnly = req.nextUrl.searchParams.get("websiteOnly") === "true";
    const websiteIdFilter = req.nextUrl.searchParams.get("websiteId");
    const fromParam = req.nextUrl.searchParams.get("from");
    const toParam = req.nextUrl.searchParams.get("to");
    const rangeStartMs = Date.now() - 24 * 60 * 60 * 1000;

    const parseDateToMs = (value: string | null) => {
        if (!value) return undefined;
        const d = new Date(value);
        const ms = d.getTime();
        return Number.isFinite(ms) ? ms : undefined;
    };

    const startMs = parseDateToMs(fromParam);
    const endMs = (() => {
        const base = parseDateToMs(toParam);
        if (!Number.isFinite(base)) return undefined;
        return base + (24 * 60 * 60 * 1000) - 1;
    })();
    const websitePredicates = [eq(websiteTable.userEmail, userEmail)];
    if (websiteIdFilter) {
        websitePredicates.push(eq(websiteTable.websiteId, websiteIdFilter));
    }

    const websites = await db
        .select()
        .from(websiteTable)
        .where(and(...websitePredicates))
        .orderBy(desc(websiteTable.id));

    if (websiteOnly) {
        return NextResponse.json(websites);
    }

    const result = [];
    type visitorWithCode = { visitors: number; code?: string };

    function formatCountries(map: Record<string, visitorWithCode>){
        return Object.entries(map).map(([name, data]) => ({
            name,
            visitors: data.visitors,
            image: data.code
              ? `https://flagsapi.com/${data.code.toUpperCase()}/flat/64.png`
              : "/country.png",
        }));
    }

    function formatRegions(map: Record<string, visitorWithCode>){
        return Object.entries(map).map(([name, data]) => ({
            name,
            visitors: data.visitors,
            image: data.code
                ? `https://flagsapi.com/${data.code.toUpperCase()}/flat/64.png`
                : "/region.png",
        }));
    }

    function formatCities(map: Record<string, visitorWithCode>){
        return Object.entries(map).map(([name, data]) => ({
            name,
            visitors: data.visitors,
            image: data.code
                ? `https://flagsapi.com/${data.code.toUpperCase()}/flat/64.png`
                : "/city.png",
        }));
    }

    function formatDevices(map: Record<string, number>){
        return Object.entries(map).map(([name, visitors]) => ({
            name,
            visitors,
            image: `/${name.toLowerCase()}.png`
        }));
    }

    function formatOS(map: Record<string, number>){
        return Object.entries(map).map(([name, visitors]) => ({
            name,
            visitors,
            image: `/${name.toLowerCase()}.png`
        }));
    }

    function formatBrowsers(map: Record<string, number>){
        return Object.entries(map).map(([name, visitors]) => ({
            name,
            visitors,
            image: `/${name.toLowerCase()}.png`
        }));
    }

    for (const site of websites) {
        const predicates = [eq(pageViewTable.websiteId, site.websiteId)];
        const epochExpr = sql`CASE
            WHEN ${pageViewTable.entryTime} ~ '^[0-9]+$' AND length(${pageViewTable.entryTime}) <= 10
                THEN (${pageViewTable.entryTime})::bigint * 1000
            WHEN ${pageViewTable.entryTime} ~ '^[0-9]+$'
                THEN (${pageViewTable.entryTime})::bigint
            ELSE NULL
        END`;

        if (Number.isFinite(startMs) && Number.isFinite(endMs)) {
            predicates.push(sql`${epochExpr} BETWEEN ${startMs!} AND ${endMs!}`);
        } else if (range === "24h") {
            predicates.push(sql`${epochExpr} >= ${rangeStartMs}`);
        }

        const views = await db
            .select()
            .from(pageViewTable)
            .where(and(...predicates));

        const hourlyMap: Record<string, { date: string; hour: number; hourLabel: string; visitors: number }> = {};
        const countryCount: Record<string, visitorWithCode> = {};
        const regionCount: Record<string, visitorWithCode> = {};
        const cityCount: Record<string, visitorWithCode> = {};
        const deviceCount: Record<string, number> = {};
        const osCount: Record<string, number> = {};
        const browserCount: Record<string, number> = {};
        const visitorIds = new Set<string>();
        let siteTZ = site.timeZone || "UTC";
        try {
            new Intl.DateTimeFormat("en-US", { timeZone: siteTZ });
        } catch {
            siteTZ = "UTC";
        }

        const dateFormatter = new Intl.DateTimeFormat("en-CA", {
            timeZone: siteTZ,
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        });
        const hourFormatter = new Intl.DateTimeFormat("en-US", {
            timeZone: siteTZ,
            hour: "numeric",
            hour12: false,
        });
        const hourLabelFormatter = new Intl.DateTimeFormat("en-US", {
            timeZone: siteTZ,
            hour: "numeric",
            hour12: true,
        });

        let totalActiveTime = 0;
        let totalSessions = 0;

        views.forEach((v) => {
            if (!v.entryTime) return;

            const rawEpoch = Number(v.entryTime);
            if (!Number.isFinite(rawEpoch)) return;
            const unixMs = rawEpoch < 10_000_000_000 ? rawEpoch * 1000 : rawEpoch;

            const d = new Date(unixMs);
            const date = dateFormatter.format(d);
            const hour = Number(hourFormatter.format(d));
            const hourLabel = hourLabelFormatter.format(d);

            const key = `${date}-${hour}`;

            if (!hourlyMap[key]) {
                hourlyMap[key] = { date, hour, hourLabel, visitors: 0 };
            }
            hourlyMap[key].visitors++;

            if (v.country) {
                if (!countryCount[v.country]) countryCount[v.country] = { visitors: 0, code: v.countryCode || "" };
                countryCount[v.country].visitors++;
                if (v.countryCode) countryCount[v.country].code = v.countryCode;
            }

            if (v.region) {
                if (!regionCount[v.region]) regionCount[v.region] = { visitors: 0, code: v.countryCode || "" };
                regionCount[v.region].visitors++;
                if (v.countryCode) regionCount[v.region].code = v.countryCode;
            }

            if (v.city) {
                if (!cityCount[v.city]) cityCount[v.city] = { visitors: 0, code: v.countryCode || "" };
                cityCount[v.city].visitors++;
                if (v.countryCode) cityCount[v.city].code = v.countryCode;
            }

            if (v.device) {
                if (!deviceCount[v.device]) deviceCount[v.device] = 0;
                deviceCount[v.device]++;
            }

            if (v.os) {
                if (!osCount[v.os]) osCount[v.os] = 0;
                osCount[v.os]++;
            }

            if (v.browser) {
                if (!browserCount[v.browser]) browserCount[v.browser] = 0;
                browserCount[v.browser]++;
            }

            if (v.totalActiveTime && v.totalActiveTime > 0) {
                totalActiveTime += v.totalActiveTime;
            }
            totalSessions++;

            if (v.visitorId) {
                visitorIds.add(v.visitorId);
            }
        });

        const hourlyVisitors = Object.values(hourlyMap).sort((a, b) =>
            a.date === b.date
                ? a.hour - b.hour
                : new Date(a.date).getTime() - new Date(b.date).getTime()
        );

        const avgActiveTime = totalSessions > 0 ? Math.floor(totalActiveTime / totalSessions) : 0;

        result.push({
            website: site,
            analytics: {
                last24hVisitors: views.length,
                hourlyVisitors,
                countries: formatCountries(countryCount),
                regions: formatRegions(regionCount),
            cities: formatCities(cityCount),
            devices: formatDevices(deviceCount),
            os: formatOS(osCount),
            browsers: formatBrowsers(browserCount),
            totalVisitors: visitorIds.size,
            totalSessions,
            totalActiveTime,
            avgActiveTime,
        },
        });
    }
    return NextResponse.json(result);
}
